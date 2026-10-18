/* Dated prescription snapshots. No inferred loads, automatic readiness or completed sets. */
(function(root){
 'use strict';
 const copy=v=>structuredClone(v);
 function validDate(date){return typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&date>='1900-01-01'&&date<='9998-12-31'&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date}
 function snapshot(data,rid,change){
  const r=data.routines.find(r=>r.id===rid);if(!r)throw Error('Workout not found.');
  if(!change.name?.trim()||!Array.isArray(change.ids)||!change.ids.length||new Set(change.ids).size!==change.ids.length)throw Error('Choose at least one distinct movement and name this plan.');
  const exercises=change.ids.map(id=>{const original=data.exercises.find(e=>e.id===id);if(!original)throw Error('Movement not found.');const target=FormTraining.validateTarget(change.prescriptions?.[id]);return {...copy(original),...copy(target)}});
  return {provenance:'recorded',routine:{id:rid,name:change.name.trim(),note:String(change.note||''),ids:[...change.ids]},exercises};
 }
 function add(data,profile,{id,routine,from,to,plan},today){
  if(!validDate(today)||!validDate(from)||!validDate(to)||from<today||to<from)throw Error('Choose dates from today onwards, with the end on or after the start.');
  if(!/^[a-zA-Z0-9_-]+$/.test(id)||['__proto__','constructor','prototype'].includes(id)||(data.periodPlans||[]).some(p=>p.id===id))throw Error('A unique plan identifier is required.');
  if(plan?.routine?.id!==routine||!data.routines.some(r=>r.id===routine))throw Error('Choose a valid workout for this plan.');
  if((data.periodPlans||[]).some(p=>p.routine===routine&&p.from<=to&&p.to>=from))throw Error('This workout already has a plan within these dates. End that plan from today or choose a separate period.');
  const next=FormProgram.preserve(data,profile),saved=copy(plan);saved.period={id,from,to};
  next.periodPlans=(next.periodPlans||[]).concat({id,routine,from,to,plan:saved}).sort((a,b)=>a.from.localeCompare(b.from));
  return next;
 }
 function end(data,profile,id,today){
  if(!validDate(today))throw Error('Choose a valid date.');
  const existing=data.periodPlans?.find(p=>p.id===id);if(!existing)throw Error('Plan not found.');
  if(existing.to<today)throw Error('This past plan is retained for historical reference.');
  const next=FormProgram.preserve(data,profile);
  if(existing.from>=today)next.periodPlans=next.periodPlans.filter(p=>p.id!==id);
  else next.periodPlans.find(p=>p.id===id).to=FormTraining.day(today,-1);
  return next;
 }
 root.FormPeriod={snapshot,add,end,validDate};
})(typeof window==='undefined'?globalThis:window);
