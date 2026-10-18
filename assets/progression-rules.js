/* Opt-in local rules prepare review drafts only. They never apply prescriptions. */
(function(root){
 'use strict';
 function validate(rules,data){
  if(!Array.isArray(rules)||rules.length>500)throw Error('Invalid progression rules.');
  const seen=new Set();
  for(const rule of rules){
   const r=data.routines.find(r=>r.id===rule?.routine),e=data.exercises.find(e=>e.id===rule?.exercise),key=rule?.routine+':'+rule?.exercise;
   if(!r||!e||seen.has(key)||!['reps','load'].includes(rule.metric)||!['strength','reps','seconds'].includes(rule.kind)||typeof rule.increment!=='number'||!Number.isFinite(rule.increment)||rule.increment<=0||(rule.metric==='reps'&&!Number.isSafeInteger(rule.increment))||(rule.metric==='load'&&rule.kind==='seconds')||typeof rule.enabled!=='boolean'||typeof rule.guidance!=='string'||(rule.preference!==undefined&&typeof rule.preference!=='string'))throw Error('Invalid progression rule. Use a positive increment and matching units.');
   seen.add(key);
  }
  return rules;
 }
 function configure(data,rule){
  if(rule.enabled&&root.FormPreferences?.blocked(data,rule.exercise))throw Error('Progression is paused by your exercise preference. Review it in Settings first.');
  const next=structuredClone(data),r=next.routines.find(r=>r.id===rule.routine);
  if(!r||rule.enabled&&!r.ids.includes(rule.exercise))throw Error('Choose a movement included in this workout.');
  const current=FormTraining.target(data,rule.routine,rule.exercise);
  const value={routine:rule.routine,exercise:rule.exercise,metric:rule.metric,increment:rule.increment,enabled:rule.enabled,kind:current.kind,guidance:data.restrictions};const preference=root.FormPreferences?.signature(data,rule.exercise);if(preference)value.preference=preference;
  next.progressionRules=(next.progressionRules||[]).filter(r=>r.routine!==value.routine||r.exercise!==value.exercise).concat(value);validate(next.progressionRules,next);return next;
 }
 function pauseReason(data,rule){
  if(!rule.enabled)return 'Disabled';
  if(root.FormPreferences?.blocked(data,rule.exercise))return 'Paused: exercise preference';
  if((rule.preference||'')!==(root.FormPreferences?.signature(data,rule.exercise)||''))return 'Paused: exercise preference changed';
  if(rule.guidance!==data.restrictions)return 'Paused: guidance changed';
  if(!data.routines.find(r=>r.id===rule.routine)?.ids.includes(rule.exercise))return 'Paused: movement removed from workout';
  if(FormTraining.target(data,rule.routine,rule.exercise).kind!==rule.kind)return 'Paused: movement unit changed';
  return '';
 }
 function queue(data,today){
  let next=structuredClone(data);const created=[],skipped=[];
  for(const rule of next.progressionRules||[]){
   try{
   if(pauseReason(next,rule))continue;
   const current=FormTraining.target(next,rule.routine,rule.exercise);
   if(current.kind!==rule.kind||!FormTraining.reviewSignals(next,today).some(s=>s.routine===rule.routine&&s.exercise===rule.exercise))continue;
   const target=FormTraining.calculateTarget(next,rule.routine,rule.exercise,today,rule.metric,rule.increment);
   const proposal=FormTraining.propose(next,rule.routine,rule.exercise,target.reps,today,{target,note:'Prepared by your enabled rule: +'+rule.increment+' '+(rule.metric==='load'?'kg per set':rule.kind==='seconds'?'seconds':'repetitions')+'. Review readiness and guidance before approval.'});
   // Dismissing a draft prevents another prompt for the same evidence and rule.
   if((next.progressionReviews||[]).some(p=>p.baseline===proposal.baseline&&JSON.stringify(p.target)===JSON.stringify(proposal.target)))continue;
   next.progressionReviews=(next.progressionReviews||[]).concat(proposal);created.push(proposal.id);
   }catch(error){skipped.push({exercise:rule.exercise,message:error.message})}
  }
  return {data:next,created,skipped};
 }
 root.FormProgressionRules={validate,configure,queue,pauseReason};
})(typeof window==='undefined'?globalThis:window);
