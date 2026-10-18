/* Local planning and evidence tools. Plans never create completed performance. */
(function(root){
 'use strict';
 const copy=x=>structuredClone(x), day=(d,n)=>{const t=new Date(d+'T12:00:00Z');t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10)};
 function history(data,today){return FormSession.entries(data).filter(([d])=>d<=today).sort(([a],[b])=>b.localeCompare(a)).map(([date,log,sessionId])=>{const sets=log.sets.filter(s=>s.confirmed),volume=sets.reduce((n,s)=>n+(['strength','reps'].includes(FormSession.exercise(log,s.exerciseId,data.exercises)?.kind)?(s.weight||0)*s.reps:0),0);return {date,log,sessionId,sets,volume}})}
 function evidence(data,id,today,routineId){return history(data,today).filter(h=>!routineId||h.log.plan?.routine.id===routineId).map(h=>({...h,sets:h.sets.filter(s=>s.exerciseId===id)})).filter(h=>h.sets.length).slice(0,2)}
 function fingerprint(data,rid,eid,today){const r=data.routines.find(r=>r.id===rid),e=data.exercises.find(e=>e.id===eid);const parts=[r,e,data.restrictions||'',data.progressionRules?.filter(p=>p.routine===rid&&p.exercise===eid)||[],evidence(data,eid,today,rid).map(h=>[h.date,h.sessionId,h.log.plan,h.log.changes,h.log.targetEdits,h.log.sets])];const preference=root.FormPreferences?.signature(data,eid);if(preference)parts.push(preference);return JSON.stringify(parts)}
 function target(data,rid,eid){const r=data.routines.find(r=>r.id===rid),e={...data.exercises.find(e=>e.id===eid),...r?.prescriptions?.[eid]};return Object.fromEntries(['sets','reps','rest','weights','kind'].map(k=>[k,copy(e[k])]))}
 function validateTarget(t){if(!t||!Number.isInteger(t.sets)||t.sets<1||t.sets>100||!Number.isInteger(t.reps)||t.reps<0||!Number.isFinite(t.rest)||t.rest<0||!['strength','reps','seconds'].includes(t.kind)||!Array.isArray(t.weights)||t.weights.length>t.sets||t.weights.some(w=>w!==null&&(typeof w!=='number'||!Number.isFinite(w)||w<0)))throw Error('Enter valid sets, repetitions/duration, rest and loads. Leave unknown loads blank.');return t}
 function calculateTarget(data,rid,eid,today,metric,increment){
  if(!reviewSignals(data,today).some(s=>s.routine===rid&&s.exercise===eid))throw Error('A calculation needs two separate, fully confirmed sessions with matching targets and known loads.');
  const current=validateTarget(target(data,rid,eid)),next=copy(current);
  if(typeof increment!=='number'||!Number.isFinite(increment)||increment<=0)throw Error('Enter your own positive increment. No increment is selected for you.');
  if(metric==='reps'){if(!Number.isInteger(increment))throw Error('Use a whole-number repetition or duration increment.');next.reps+=increment}
  else if(metric==='load'){
   if(!['strength','reps'].includes(current.kind)||Array.from({length:current.sets},(_,i)=>current.weights[i]).some(w=>typeof w!=='number'))throw Error('Load calculation requires a known load for every repetition-based set.');
   next.weights=current.weights.map(w=>Math.round((w+increment)*1000)/1000);
  }else throw Error('Choose repetitions/duration or load.');
  return validateTarget(next);
 }
 function propose(data,rid,eid,reps,today,options={}){
  if(root.FormPreferences?.blocked(data,eid))throw Error('Progression is paused by your exercise preference. Review it in Settings first.');
  const r=data.routines.find(r=>r.id===rid),rows=evidence(data,eid,today,rid);
  if(!r?.ids.includes(eid)||!Number.isInteger(reps)||reps<0||rows.length<2||new Set(rows.map(h=>h.date)).size<2)throw Error('Choose a movement with confirmed results on two separate dates and enter a whole-number target.');
  if((data.progressionReviews||[]).some(p=>p.status==='pending'&&p.routine===rid&&p.exercise===eid))throw Error('Resolve the existing pending review for this movement first.');
  const previous=target(data,rid,eid),proposed=validateTarget({...previous,...copy(options.target||{}),reps}),normal=k=>['strength','reps'].includes(k)?'reps':k;
  if(proposed.kind!==previous.kind||rows.some(h=>normal(FormSession.exercise(h.log,eid,data.exercises)?.kind)!==normal(previous.kind)))throw Error('The recorded units differ from this target. Review comparable records first.');
  return {id:'review-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),routine:rid,exercise:eid,reps,status:'pending',baseline:fingerprint(data,rid,eid,today),created:today,kind:previous.kind,target:proposed,previous,note:String(options.note||''),evidence:rows.map(h=>({date:h.date,sessionId:h.sessionId||'',sets:copy(h.sets)}))};
 }
 function resolve(data,profile,id,action,today){
  let next=copy(data),p=next.progressionReviews?.find(p=>p.id===id);if(!p||p.status!=='pending')throw Error('This review has already been resolved.');
  if(action==='approve'){
   if(root.FormPreferences?.blocked(data,p.exercise))throw Error('Progression is paused by your exercise preference. Review it in Settings first.');
   if(p.baseline!==fingerprint(data,p.routine,p.exercise,today))throw Error('The program, guidance or supporting records changed. Dismiss this review and create a fresh one.');
   const r=data.routines.find(r=>r.id===p.routine),proposed=validateTarget(p.target||{...target(data,p.routine,p.exercise),reps:p.reps});
   if(proposed.kind!==target(data,p.routine,p.exercise).kind||proposed.reps!==p.reps)throw Error('The review target is inconsistent. Create a fresh review.');
   next=FormProgram.editRoutine(next,profile,r.id,{prescriptions:{...r.prescriptions,[p.exercise]:copy(proposed)}});
  }else if(action!=='dismiss')throw Error('Invalid review action.');
  const resolved=next.progressionReviews.find(x=>x.id===id);resolved.status=action==='approve'?'approved':'dismissed';resolved.resolved=today;return next;
 }
 function blockReport(data,block,today){
  const through=block.end<today?block.end:today;if(through<block.start)return {through:null,current:{sessions:0,sets:0,volume:0,minutes:0},previous:null,drafts:0,skipped:0};
  const index=(data.trainingBlocks||[]).findIndex(b=>b.start===block.start),from=block.reviewType==='annual'&&index>=0?data.trainingBlocks[Math.max(0,index-12)].start:block.start;
  const length=Math.round((Date.parse(through)-Date.parse(from))/86400000)+1,previousTo=day(from,-1),previousFrom=day(from,-length),rows=FormSession.entries(data).filter(([date])=>date>=from&&date<=through);
  return {from,through,current:reviewSummary(data,from,through,today),previous:{from:previousFrom,to:previousTo,...reviewSummary(data,previousFrom,previousTo,today)},drafts:rows.reduce((n,[,log])=>n+log.sets.filter(s=>!s.confirmed).length,0),skipped:rows.reduce((n,[,log])=>n+FormSession.summary(log).skipped,0)};
 }
 function saveBlock(data,index,values,today){
  const next=copy(data),b=next.trainingBlocks?.[index];if(!b)throw Error('Training block not found.');
  const focus=String(values.focus||'').trim(),recovery=String(values.recovery||'');if(!focus)throw Error('Enter the goals and focus for this block.');
  b.focus=focus;b.recovery=recovery;
  if(values.reviewed){b.reviewed=b.reviewed||today>=b.review;b.reviewEntries=(b.reviewEntries||[]).concat({date:today,focus,recovery,note:String(values.note||''),report:blockReport(data,b,today)})}
  return next;
 }
 function blocks(start,count=13){return Array.from({length:count},(_,i)=>({start:day(start,i*28),end:day(start,i*28+27),focus:'Strength, muscle and general fitness',review:day(start,i*28+27),reviewType:i===count-1?'annual':'block',recovery:'Discuss recovery needs at review',reviewed:false}))}
 function records(data,id,unit,today){
  const rows=history(data,today).flatMap(h=>{const e=FormSession.exercise(h.log,id,data.exercises);return e?.kind===unit?h.sets.filter(s=>s.exerciseId===id).map(s=>({...s,date:h.date})):[]});
  const best=key=>rows.filter(s=>typeof s[key]==='number').sort((a,b)=>b[key]-a[key]||b.date.localeCompare(a.date))[0]||null;
  return {repetitions:best('reps'),load:['strength','reps'].includes(unit)?best('weight'):null};
 }
 function reviewSummary(data,from,to,today){const rows=history(data,today).filter(h=>h.date>=from&&h.date<=to),activities=(data.activities||[]).filter(a=>a.confirmed&&a.date>=from&&a.date<=to&&a.date<=today);return {sessions:rows.filter(h=>h.sets.length).length,sets:rows.reduce((n,h)=>n+h.sets.length,0),volume:rows.reduce((n,h)=>n+h.volume,0),minutes:activities.reduce((n,a)=>n+a.minutes,0)}}
 function weekly(data,today,count=8){
  if(![8,26,52].includes(count))throw Error('Choose 8, 26 or 52 weeks.');
  const weekday=new Date(today+'T12:00:00Z').getUTCDay(),monday=day(today,-((weekday+6)%7)),rows=history(data,today);
  return Array.from({length:count},(_,i)=>{const from=day(monday,(i-count+1)*7),to=day(from,6),sessions=rows.filter(h=>h.date>=from&&h.date<=to&&h.sets.length),activities=(data.activities||[]).filter(a=>a.confirmed&&a.date>=from&&a.date<=to&&a.date<=today);return {from,to,sessions:sessions.length,days:new Set(sessions.map(h=>h.date)).size,sets:sessions.reduce((n,h)=>n+h.sets.length,0),volume:sessions.reduce((n,h)=>n+h.volume,0),minutes:activities.reduce((n,a)=>n+a.minutes,0)}});
 }
 function reviewSignals(data,today){
  const rows=history(data,today),signals=[];
  for(const routine of data.routines)for(const id of routine.ids){
   if(root.FormPreferences?.blocked(data,id))continue;
   if((data.progressionReviews||[]).some(p=>p.status==='pending'&&p.routine===routine.id&&p.exercise===id))continue;
   const recent=rows.filter(h=>h.log.plan?.routine.id===routine.id&&(h.log.plan.exercises.some(e=>e.id===id)||h.sets.some(s=>s.exerciseId===id))).slice(0,2);
   if(recent.length!==2||recent[0].date===recent[1].date||recent.some(h=>h.log.plan.provenance!=='recorded'||h.log.changes?.[id]||h.log.sets.some(s=>s.exerciseId===id&&!s.confirmed)))continue;
   const targets=recent.map(h=>FormSession.exercise(h.log,id,data.exercises)),current={...data.exercises.find(e=>e.id===id),...routine.prescriptions?.[id]};
   const signature=e=>JSON.stringify([e.kind,e.sets,e.reps,e.weights]);
   if(!targets[0]||!targets[1]||!['strength','reps','seconds'].includes(current.kind)||current.sets<1||targets.some(e=>signature(e)!==signature(current)))continue;
   const complete=recent.every((h,j)=>{const e=targets[j];return Array.from({length:e.sets},(_,index)=>index).every(index=>{const set=h.sets.find(s=>s.exerciseId===id&&s.index===index);if(!set||set.reps<e.reps)return false;const load=e.weights[index];return e.kind==='seconds'||typeof load==='number'&&set.weight===load})});
   if(complete)signals.push({routine:routine.id,exercise:id,name:current.name,dates:recent.map(h=>h.date),sets:current.sets,reps:current.reps,kind:current.kind});
  }
  return signals;
 }
 root.FormTraining={calculateTarget,target,validateTarget,blockReport,saveBlock,weekly,reviewSignals,reviewSummary,records,history,evidence,propose,resolve,blocks,day};
})(typeof window==='undefined'?globalThis:window);
