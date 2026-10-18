/* Local-only Health export reader. Raw health data is never stored or uploaded. */
(function(root){
 'use strict';
 const MB=1024*1024,LIMITS={file:200*MB,xml:200*MB,workouts:50000,page:50};
 const types={Walking:'Walking',Running:'Running',Cycling:'Cycling',Swimming:'Swimming',Yoga:'Yoga',Pilates:'Pilates',Flexibility:'Stretching',TraditionalStrengthTraining:'Strength',FunctionalStrengthTraining:'Strength',HighIntensityIntervalTraining:'Conditioning',CrossTraining:'Conditioning',MixedCardio:'Conditioning'};
 const units={km:1,mi:1.609344,m:.001,yd:.0009144};
 function stamp(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{4}$/.test(value))return false;
  const date=value.slice(0,10),hour=+value.slice(11,13),minute=+value.slice(14,16),second=+value.slice(17,19),zoneHour=+value.slice(21,23),zoneMinute=+value.slice(23,25);
  return !Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date&&hour<24&&minute<60&&second<60&&zoneHour<=14&&zoneMinute<60&&(zoneHour<14||zoneMinute===0)&&Number.isFinite(Date.parse(value.replace(' ','T').replace(' ','')));
 }
 function distance(value,unit){const result=value!=null&&String(value).trim()!==''&&units[unit]&&Number.isFinite(+value)&&+value>=0?+value*units[unit]:null;return Number.isFinite(result)?result:null}
 function summaries(statistics){
  const values={};let warnings=0;
  for(const [type,fields,units,positive] of [
   ['ActiveEnergyBurned',[['sum','activeEnergyKcal']],{kcal:1,kJ:1/4.184,J:1/4184},false],
   ['HeartRate',[['average','averageHeartRateBpm'],['maximum','maximumHeartRateBpm']],{'count/min':1},true]
  ]){
   const rows=statistics.filter(s=>s.type==='HKQuantityTypeIdentifier'+type);if(!rows.length)continue;
   if(rows.length!==1){warnings++;continue}const row=rows[0];let invalid=false;
   for(const [attribute,key] of fields){if(row[attribute]===undefined)continue;const raw=row[attribute],value=Number(raw)*units[row.unit];if(!String(raw).trim()||!Number.isFinite(value)||value<0||(positive&&value===0)){invalid=true;continue}values[key]=Math.round(value*100)/100;if(!Number.isFinite(values[key])||(positive&&values[key]===0)){delete values[key];invalid=true}}
   if(!fields.some(([attribute])=>row[attribute]!==undefined))invalid=true;
   if(type==='HeartRate'&&values.averageHeartRateBpm>values.maximumHeartRateBpm){delete values.averageHeartRateBpm;delete values.maximumHeartRateBpm;invalid=true}
   if(invalid)warnings++;
  }
  return {values,warnings};
 }
 function workout(a,statistics){
  const start=a.startDate,type=a.workoutActivityType,duration=a.duration,unit=a.durationUnit,factor={min:1,s:1/60,hr:60,h:60}[unit];
  const minutes=Math.round(Number(duration)*factor*100)/100;
  if(!stamp(start)||!type?.startsWith('HKWorkoutActivityType')||!duration?.trim()||!factor||!Number.isFinite(minutes)||minutes<=0||(a.endDate&&(!stamp(a.endDate)||Date.parse(a.endDate.replace(' ','T').replace(' ',''))<Date.parse(start.replace(' ','T').replace(' ','')))))return null;
  let distanceKm=distance(a.totalDistance,a.totalDistanceUnit),distanceWarning=a.totalDistance!==undefined&&distanceKm===null;
  if(a.totalDistance===undefined){const relevant=statistics.filter(s=>/^HKQuantityTypeIdentifierDistance/.test(s.type||''));if(relevant.length===1)distanceKm=distance(relevant[0].sum,relevant[0].unit);if(relevant.length&&distanceKm===null)distanceWarning=true}
  const sourceName=a.sourceName||'',category=types[type.replace(/^HKWorkoutActivityType/,'')]||'Custom',metrics=summaries(statistics);
  return {record:{id:'health-'+[start,type,sourceName,duration,unit].join('|'),date:start.slice(0,10),category,minutes,distanceKm,...metrics.values,notes:'Imported Apple Health workout: '+type,source:'Apple Health',sourceStart:start,sourceType:type,sourceName,confirmed:false},distanceWarning,summaryWarnings:metrics.warnings,custom:category==='Custom'};
 }
 function reader(limits=LIMITS){
  const parser=root.sax.parser(true,{strictEntities:true}),records=[];let depth=0,roots=0,current=null,skipped=0,distanceWarnings=0,summaryWarnings=0,custom=0,count=0;
  parser.onerror=()=>{throw Error('This XML is incomplete or malformed. No workouts have been imported.')};
  parser.ondoctype=value=>{if(/<!ENTITY|SYSTEM|PUBLIC/i.test(value))throw Error('External declarations and XML entities are not supported.')};
  parser.onopentag=node=>{depth++;if(depth===1){if(++roots!==1||node.name!=='HealthData')throw Error('Choose an Apple Health export.xml file.')}if(node.name==='Workout'&&depth===2){if(++count>limits.workouts)throw Error('This export exceeds the '+limits.workouts+' workout limit.');current={attributes:node.attributes,statistics:[]}}
   else if(current&&depth===3&&node.name==='WorkoutStatistics'){if(current.statistics.length>=1000)throw Error('Too many statistics within one workout.');current.statistics.push(node.attributes)}
  };
  parser.onclosetag=name=>{if(name==='Workout'&&depth===2&&current){const result=workout(current.attributes,current.statistics);if(result){records.push(result.record);if(result.distanceWarning)distanceWarnings++;summaryWarnings+=result.summaryWarnings;if(result.custom)custom++}else skipped++;current=null}depth--};
  return {write:text=>parser.write(text),finish:()=>{parser.close();if(roots!==1||depth!==0)throw Error('Choose a complete Apple Health XML export.');return {records,skipped,distanceWarnings,summaryWarnings,custom}}};
 }
 function parse(xml){if(typeof xml!=='string'||new TextEncoder().encode(xml).length>LIMITS.xml)throw Error('The XML export exceeds 200 MB.');const r=reader();for(let i=0;i<xml.length;i+=65536)r.write(xml.slice(i,i+65536));return r.finish()}
 async function checkZip(file){
  const start=Math.max(0,file.size-65557),tail=new Uint8Array(await file.slice(start).arrayBuffer()),view=new DataView(tail.buffer);let end=-1;
  for(let i=tail.length-22;i>=0;i--)if(view.getUint32(i,true)===0x06054b50&&i+22+view.getUint16(i+20,true)===tail.length){end=i;break}
  if(end<0)throw Error('This ZIP is incomplete or damaged.');
  if(view.getUint16(end+4,true)||view.getUint16(end+6,true)||view.getUint16(end+8,true)!==view.getUint16(end+10,true))throw Error('Split ZIP archives are not supported.');
  const count=view.getUint16(end+10,true),size=view.getUint32(end+12,true),offset=view.getUint32(end+16,true);
  if(count===65535||size===0xffffffff||offset===0xffffffff)throw Error('ZIP64 archives are not supported. Choose the unzipped export.xml instead.');
  if(offset+size>start+end)throw Error('This ZIP has an invalid directory.');
 }
 async function readFile(file,{cancelled=()=>false,progress=()=>{},limits=LIMITS}={}){
  if(file.size>limits.file)throw Error('Choose an export no larger than '+Math.round(limits.file/MB)+' MB.');
  const check=()=>{if(cancelled())throw Error('Import cancelled.')},r=reader(limits),decoder=new TextDecoder('utf-8',{fatal:true});let bytes=0,found=0,ended=false;
  const consume=(chunk,final)=>{check();bytes+=chunk.length;if(bytes>limits.xml)throw Error('Expanded XML exceeds '+Math.round(limits.xml/MB)+' MB.');r.write(decoder.decode(chunk,{stream:!final}));if(final)ended=true};
  const zip=/\.zip$/i.test(file.name||'');let unzip;
  if(zip){await checkZip(file);check();unzip=new root.fflate.Unzip(entry=>{if(!/(^|\/)export\.xml$/i.test(entry.name))return;if(++found!==1)throw Error('This ZIP contains multiple export.xml files. Choose one unzipped export.');if(entry.originalSize>limits.xml)throw Error('Expanded XML exceeds '+Math.round(limits.xml/MB)+' MB.');entry.ondata=(error,chunk,final)=>{if(error)throw Error('Unable to decompress this ZIP export.');consume(chunk,final)};entry.start()});unzip.register(root.fflate.UnzipInflate)}
  for(let offset=0;offset<file.size;offset+=65536){check();const chunk=new Uint8Array(await file.slice(offset,offset+65536).arrayBuffer());check();const final=offset+chunk.length===file.size;if(zip)unzip.push(chunk,final);else consume(chunk,final);progress(Math.round((offset+chunk.length)/file.size*100));await new Promise(resolve=>setTimeout(resolve,0))}
  check();if(zip&&!found)throw Error('No export.xml was found in this ZIP.');if(!ended)throw Error('The export is empty or incomplete.');return r.finish();
 }
 function unique(incoming,existing){const seen=new Set(existing.map(r=>r.id));let duplicates=0;const records=incoming.filter(r=>{if(seen.has(r.id)){duplicates++;return false}seen.add(r.id);return true});return {records,duplicates}}
 function merge(existing,chosen){return existing.concat(unique(chosen,existing).records)}
 function possibleDuplicates(incoming,existing){
  const groups=new Map();for(const r of [...existing,...incoming]){if(r.source!=='Apple Health'||!stamp(r.sourceStart)||!(r.minutes>0))continue;const key=JSON.stringify([Date.parse(r.sourceStart.replace(' ','T').replace(' ','')),r.sourceType||r.category,r.minutes]);if(!groups.has(key))groups.set(key,new Set());groups.get(key).add(r.id)}
  return new Set([...groups.values()].filter(ids=>ids.size>1).flatMap(ids=>[...ids]));
 }
 function open({records,onSave,escape,today=new Date().toISOString().slice(0,10)}){
  const dialog=document.createElement('dialog');dialog.className='panel import-editor';dialog.setAttribute('aria-label','Import Apple Health workouts');let candidates=[],selected=new Set(),possible=new Set(),page=0,token=0,busy=false;
  dialog.innerHTML='<h2>Import Apple Health workouts</h2><p>Choose export.zip or export.xml, up to 200 MB (including expanded XML), with up to 50,000 workouts. Processing stays on this device. Explicit workout summaries can include active energy and average/maximum heart rate. Missing summaries stay unknown. Routes and separate health samples are not imported.</p><label class="field">Health export<input type="file" accept=".zip,.xml,application/zip,application/xml,text/xml"></label><p role="status" aria-live="polite"></p><details data-date-filter><summary>Filter by date (optional)</summary><div class="row"><label class="field">From<input type="date" name="from"></label><label class="field">To<input type="date" name="to"></label></div><button class="ghost" type="button" data-reset-dates>Clear date filter</button></details><form><p class="tiny muted">Selections survive page and date-filter changes. Each tick confirms that workout was completed by this profile. Future entries cannot be selected. Unknown activity types are labelled Custom; review their original type below.</p><p data-selection></p><div data-workouts></div><div class="row"><button type="button" class="ghost" data-prev>Previous page</button><span data-page></span><button type="button" class="ghost" data-next>Next page</button><button type="button" class="ghost" data-select>Confirm displayed workouts</button><button type="button" class="ghost" data-clear>Clear selections</button></div><div class="row" style="margin-top:16px"><button class="primary" type="submit">Import confirmed activities</button><button class="secondary" type="button" data-cancel>Cancel</button></div></form>';
  dialog.querySelector('[data-reset-dates]').onclick=()=>{dialog.querySelector('[name=from]').value='';dialog.querySelector('[name=to]').value='';page=0;draw()};
  const status=dialog.querySelector('[role=status]'),submit=dialog.querySelector('[type=submit]');
  function draw(){const from=dialog.querySelector('[name=from]').value,to=dialog.querySelector('[name=to]').value,filtered=candidates.filter(r=>(!from||r.date>=from)&&(!to||r.date<=to)),pages=Math.max(1,Math.ceil(filtered.length/LIMITS.page));page=Math.min(page,pages-1);dialog.querySelector('[data-page]').textContent=(page+1)+' / '+pages;dialog.querySelector('[data-prev]').disabled=busy||page===0;dialog.querySelector('[data-next]').disabled=busy||page>=pages-1;submit.disabled=busy;dialog.querySelector('[data-selection]').textContent=selected.size+' selected across all pages · '+filtered.length+(from||to?' in this date range':' available · no date filter');dialog.querySelector('[data-workouts]').innerHTML=filtered.slice(page*LIMITS.page,(page+1)*LIMITS.page).map(r=>'<label class="health-row"><input type="checkbox" value="'+escape(r.id)+'"'+(selected.has(r.id)?' checked':'')+(r.date>today?' disabled':'')+'><span><strong>'+escape(r.date+' · '+r.category+' · '+r.minutes+' minutes')+'</strong><small>'+escape(r.sourceStart+' · '+(r.sourceName||'Source not supplied'))+'</small><small>'+escape(r.sourceType.replace('HKWorkoutActivityType','')+' · '+(r.distanceKm===null?'Distance unknown':r.distanceKm.toFixed(2)+' km')+(root.FormActivities.metricsText(r)?' · '+root.FormActivities.metricsText(r):'')+(r.date>today?' · Future date: not selectable':''))+'</small>'+(possible.has(r.id)?'<small><strong>Possible duplicate</strong> · Same activity, start time and duration as another saved, archived or listed record. Check the source before selecting.</small>':'')+'</span></label>').join('');}
  dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.onclose=()=>{token++;dialog.remove()};
  for(const n of ['from','to'])dialog.querySelector('[name='+n+']').onchange=()=>{page=0;draw()};dialog.querySelector('[data-prev]').onclick=()=>{page--;draw()};dialog.querySelector('[data-next]').onclick=()=>{page++;draw()};dialog.querySelector('[data-select]').onclick=()=>{for(const input of dialog.querySelectorAll('[data-workouts] input:not(:disabled)'))selected.add(input.value);draw()};dialog.querySelector('[data-clear]').onclick=()=>{selected.clear();draw()};dialog.querySelector('[data-workouts]').onchange=e=>{if(e.target.checked)selected.add(e.target.value);else selected.delete(e.target.value);dialog.querySelector('[data-selection]').textContent=selected.size+' selected across all pages'};
  dialog.querySelector('input[type=file]').onchange=async event=>{const own=++token;busy=true;candidates=[];possible.clear();selected.clear();page=0;draw();status.textContent='Reading locally…';const file=event.target.files[0];if(!file){busy=false;status.textContent='Choose an export.';draw();return}try{const parsed=await readFile(file,{cancelled:()=>own!==token,progress:p=>{if(own===token)status.textContent='Reading locally… '+p+'%'}});if(own!==token)return;possible=possibleDuplicates(parsed.records,records);const dedup=unique(parsed.records,records);candidates=dedup.records.sort((a,b)=>b.sourceStart.localeCompare(a.sourceStart));status.textContent=candidates.length+' new workouts · '+dedup.duplicates+' duplicates excluded (saved or archived) · '+parsed.skipped+' invalid workouts skipped.'+(parsed.distanceWarnings?' '+parsed.distanceWarnings+' distances unresolved.':'')+(parsed.summaryWarnings?' '+parsed.summaryWarnings+' heart-rate or energy summaries unresolved.':'')+(parsed.custom?' '+parsed.custom+' Custom activity types to review.':'')}catch(e){if(own!==token)return;candidates=[];status.textContent=e.message}finally{if(own===token){busy=false;draw()}}};
  dialog.querySelector('form').onsubmit=event=>{event.preventDefault();if(busy)return;try{const chosen=candidates.filter(r=>selected.has(r.id)&&r.date<=today).map(r=>({...r,confirmed:true,updatedAt:new Date().toISOString()}));if(!chosen.length)throw Error('Select at least one completed workout to import.');if(chosen.some(r=>possible.has(r.id))&&!confirm('Some selected workouts match the activity, start time and duration of another saved, archived or listed record. Confirm you reviewed the sources and intend to import these selected records separately.'))return;if(onSave(chosen))dialog.close()}catch(e){status.textContent=e.message}};
  document.body.appendChild(dialog);dialog.showModal();draw();
 }
 root.FormHealth={parse,reader,readFile,unique,merge,possibleDuplicates,open,LIMITS};
})(typeof window==='undefined'?globalThis:window);
