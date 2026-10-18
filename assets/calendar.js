/* Calendar reads never create records. Moves preserve plans and destination sessions. */
(function(root){
 'use strict';
 function validDate(date){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&date>='1900-01-01'&&date<='9998-12-31'&&!Number.isNaN(Date.parse(date+'T12:00:00Z'))&&new Date(date+'T12:00:00Z').toISOString().slice(0,10)===date}
 function movable(log){return !log||(!(log.sets||[]).length&&!Object.keys(log.changes||{}).length&&!log.reviewedAt&&!log.finishedAt)}
 function sessions(data,profile,date,today){
  const primary=FormProgram.plan(data,profile,date),rows=primary?[{id:'',date,plan:primary,log:data.logs[date]}]:[];
  for(const s of data.extraSessions||[])if(s.date===date)rows.push({id:s.id,date,plan:s.log.plan,log:s.log});
  return rows.map(row=>{const log=row.log,sets=log?.sets||[],confirmed=sets.filter(s=>s.confirmed===true).length,drafts=sets.length-confirmed,changes=Object.values(log?.changes||{}),skipped=FormSession.summary(log).allSkipped;
   const complete=row.plan.exercises.length>0&&row.plan.exercises.every(original=>{const e=FormSession.exercise({...log,plan:row.plan},original.id);return !log?.changes?.[original.id]&&e.sets>0&&Array.from({length:e.sets},(_,i)=>i).every(i=>sets.some(s=>s.exerciseId===e.id&&s.index===i&&s.confirmed===true))});
   const status=date>today&&sets.length?'Future entry':skipped?'Skipped':changes.length?'Modified':complete&&!drafts?'All target sets confirmed':confirmed?'Partly recorded':drafts?'Draft': 'Planned';
   return {...row,confirmed,drafts,status,movable:movable(log)};
  });
 }
 function move(data,profile,date,id,destination,newId){
  if(!validDate(date)||!validDate(destination))throw Error('Choose a valid calendar date between 1900 and 9998.');
  if(date===destination)throw Error('Choose a different date.');
  const row=sessions(data,profile,date,date).find(s=>s.id===id);if(!row)throw Error('Session not found.');
  if(!row.movable)throw Error('Recorded, skipped or reviewed sessions retain their dates. Add a new session instead.');
  const next=structuredClone(data);
  if(id){const extra=next.extraSessions.find(s=>s.id===id);extra.date=destination;extra.log.date=destination;return {data:next,id}}
  if(!newId||(next.extraSessions||[]).some(s=>s.id===newId))throw Error('A unique session identifier is required.');
  const log=structuredClone(row.log||{sets:[]});log.date=destination;log.plan=structuredClone(row.plan);
  next.extraSessions=(next.extraSessions||[]).concat({id:newId,date:destination,log});delete next.logs[date];next.overrides[date]=null;
  return {data:next,id:newId};
 }
 function skip(data,profile,date,id){
  const row=sessions(data,profile,date,date).find(s=>s.id===id);if(!row||!row.movable)throw Error('Use the workout player to change a session with existing entries.');
  let next=structuredClone(data);for(const e of row.plan.exercises)next=FormSession.change(next,profile,date,e.id,'skip',{sessionId:id});return next;
 }
 root.FormCalendar={sessions,move,skip,movable,validDate};
})(typeof window==='undefined'?globalThis:window);
