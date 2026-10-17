(function(root){
 'use strict';
 const types={Walking:'Walking',Running:'Running',Cycling:'Cycling',Swimming:'Swimming',Yoga:'Yoga',Pilates:'Pilates',Flexibility:'Stretching',TraditionalStrengthTraining:'Strength',FunctionalStrengthTraining:'Strength',HighIntensityIntervalTraining:'Conditioning'};
 function parse(xml){
  if(xml.length>20*1024*1024)throw Error('This export exceeds the 20 MB limit. Large exports need a future streaming importer.');
  if(/<!ENTITY/i.test(xml))throw Error('XML entities are not supported.');
  const doc=new DOMParser().parseFromString(xml,'application/xml');
  if(doc.querySelector('parsererror')||doc.documentElement.tagName!=='HealthData')throw Error('Choose an Apple Health export.xml file. Unzip the export first.');
  let skipped=0;
  const records=[...doc.querySelectorAll('Workout')].flatMap(w=>{
   const attr=n=>w.getAttribute(n),start=attr('startDate'),type=attr('workoutActivityType'),duration=attr('duration'),unit=attr('durationUnit');
   const factor={min:1,s:1/60,hr:60,h:60}[unit];
   const minutes=Number(duration)*factor,date=start?.slice(0,10);
   if(!start||!type||!duration||!factor||!Number.isFinite(minutes)||minutes<=0||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date){skipped++;return []}
   const d=attr('totalDistance'),distanceFactor={km:1,mi:1.609344,m:0.001}[attr('totalDistanceUnit')];
   const distanceKm=d!==null&&distanceFactor&&Number.isFinite(Number(d))&&Number(d)>=0?Number(d)*distanceFactor:null;
   return [{id:'health-'+[start,type,attr('sourceName')||'',duration,unit].join('|'),date,category:types[type.replace(/^HKWorkoutActivityType/,'')]||'Custom',minutes:Math.round(minutes*100)/100,distanceKm,notes:'Imported Apple Health workout: '+type,source:'Apple Health',sourceStart:start,sourceType:type,confirmed:false}];
  });
  return {records,skipped};
 }
 function open({records,onSave,escape}){
  const dialog=document.createElement('dialog');dialog.className='panel import-editor';let candidates=[];
  dialog.innerHTML='<h2>Import Apple Health workouts</h2><p>Select an unzipped export.xml (up to 20 MB). Processing stays on this device. Only workout dates, types, durations and supported distances are read into FORM. Heart rate, energy, routes and other health records are not imported.</p><label class="field">Health export<input type="file" accept=".xml,application/xml,text/xml"></label><p role="status"></p><form><div data-workouts></div><p class="tiny muted">Tick only workouts you confirm as completed by this profile. These activities never create confirmed gym sets.</p><div class="row"><button class="primary" type="submit">Import confirmed activities</button><button class="secondary" type="button" data-cancel>Cancel</button></div></form>';
  dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
  dialog.querySelector('input[type=file]').onchange=async event=>{candidates=[];dialog.querySelector('[data-workouts]').innerHTML='';const file=event.target.files[0];if(!file)return;try{if(file.size>20*1024*1024)throw Error('Choose an XML export smaller than 20 MB.');const parsed=parse(await file.text());const seen=new Set(records.map(r=>r.id));candidates=parsed.records.filter(r=>{if(seen.has(r.id))return false;seen.add(r.id);return true});if(candidates.length>500)throw Error('This export has more than 500 new workouts. Importing large histories is not supported yet.');dialog.querySelector('[role=status]').textContent=candidates.length+' new workouts; '+parsed.skipped+' unsupported or invalid workouts skipped. Existing duplicates are excluded.';dialog.querySelector('[data-workouts]').innerHTML=candidates.map((r,i)=>'<label class="row" style="padding:12px 0;border-bottom:1px solid #42525d"><input type="checkbox" value="'+i+'">'+escape(r.date+' · '+r.category+' · '+r.minutes+' minutes'+(r.distanceKm===null?'':' · '+r.distanceKm.toFixed(2)+' km'))+'</label>').join('')}catch(e){candidates=[];dialog.querySelector('[role=status]').textContent=e.message}};
  dialog.querySelector('form').onsubmit=event=>{event.preventDefault();const chosen=[...dialog.querySelectorAll('[data-workouts] input:checked')].map(el=>({...candidates[Number(el.value)],confirmed:true,updatedAt:new Date().toISOString()}));if(!chosen.length){dialog.querySelector('[role=status]').textContent='Select at least one completed workout to import.';return}if(onSave(records.concat(chosen)))dialog.close()};
  document.body.appendChild(dialog);dialog.showModal();
 }
 root.FormHealth={parse,open};
})(typeof window==='undefined'?globalThis:window);
