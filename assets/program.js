/* Pure programming operations. Existing records are never changed in place. */
(function(root){
 'use strict';
 const clone=v=>structuredClone(v);
 function week(data,profile,date){
  const revision=(data.scheduleChanges||[]).filter(r=>r.from<=date).sort((a,b)=>a.from.localeCompare(b.from)).at(-1);
  return revision?.days||(profile==='Ben'?{0:null,1:data.routines[0]?.id||null,2:null,3:data.routines[1]?.id||null,4:null,5:data.routines[2]?.id||null,6:null}:{0:null,1:null,2:null,3:null,4:null,5:null,6:null});
 }
 function scheduled(data,profile,date){
  if(Object.hasOwn(data.overrides,date))return data.overrides[date];
  if(date<'2026-10-13'&&!(data.scheduleChanges||[]).some(r=>r.from<=date))return null;
  return week(data,profile,date)[new Date(date+'T12:00:00').getDay()]||null;
 }
 function plan(data,profile,date){
  const log=data.logs[date];if(log?.plan)return clone(log.plan);
  const routine=data.routines.find(r=>r.id===scheduled(data,profile,date));
  if(!routine&&!log?.sets.length)return null;
  // Old records did not store prescriptions. Retain a labelled reference, never claim reconstruction.
  const legacy=Boolean(log?.sets.length);
  const ids=legacy?[...new Set(log.sets.map(s=>s.exerciseId))]:(routine?.ids||[]);
  const exercises=ids.map(id=>{
   const original=data.exercises.find(e=>e.id===id);
   const e=original?{...clone(original),...clone(routine?.prescriptions?.[id]||{})}:{id,name:id,group:'Historical record · original unit unknown',kind:'unknown',sets:0,reps:0,rest:0,weights:[]};
   const recorded=(log?.sets||[]).filter(s=>s.exerciseId===id).map(s=>s.index+1);
   e.sets=Math.max(e.sets,...recorded);return e;
  });
  return {provenance:legacy?'legacy-reference':'recorded',routine:{id:routine?.id||'history',name:legacy?'Recorded session':routine.name,note:legacy?'Original prescriptions were not stored. Reference values shown are not verified historical targets.':routine.note,ids},exercises};
 }
 function preserve(data,profile){const next=clone(data);for(const date of Object.keys(next.logs))if(!next.logs[date].plan){const p=plan(data,profile,date);if(p)next.logs[date].plan=p}return next}
 function editRoutine(data,profile,id,change){
  const next=preserve(data,profile),r=next.routines.find(r=>r.id===id);if(!r)throw Error('Workout not found.');
  Object.assign(r,clone(change));return next;
 }
 function setSchedule(data,profile,from,days){
  const next=preserve(data,profile);next.scheduleChanges=(next.scheduleChanges||[]).filter(r=>r.from!==from).concat({from,days:clone(days)}).sort((a,b)=>a.from.localeCompare(b.from));return next;
 }
 function record(data,profile,date){
  if(!data.logs[date]){const snapshot=plan(data,profile,date);if(!snapshot)throw Error('Choose a scheduled workout first.');data.logs[date]={date,sets:[],plan:snapshot}}
  else if(!data.logs[date].plan){const snapshot=plan(data,profile,date);if(snapshot)data.logs[date].plan=snapshot}
  return data.logs[date];
 }
 root.FormProgram={week,scheduled,plan,preserve,editRoutine,setSchedule,record};
})(typeof window==='undefined'?globalThis:window);
