/* Local deterministic analysis: no requests, credentials or clinical prescriptions. */
(function(root){
 'use strict';
 function analyse(data, today){
  const days=root.FormSession.entries(data).filter(([date])=>date<=today).sort(([a],[b])=>a.localeCompare(b));
  const sessions=days.map(([date,log])=>({date,log,sets:log.sets.filter(s=>s.confirmed===true)})).filter(s=>s.sets.length);
  const last=sessions.at(-1), total=sessions.reduce((n,s)=>n+s.sets.length,0);
  const volume=sessions.reduce((n,s)=>n+s.sets.reduce((sum,set)=>{const exercise=root.FormSession.exercise(s.log,set.exerciseId,data.exercises);return sum+(exercise&&['strength','reps'].includes(exercise.kind)&&set.weight!==null?set.weight*set.reps:0)},0),0);
  const cutoff=new Date(today+'T12:00:00Z');cutoff.setUTCDate(cutoff.getUTCDate()-6);
  const week=sessions.filter(s=>s.date>=cutoff.toISOString().slice(0,10)).length;
  const reviews=[];for(const p of data.exercisePreferences||[])if(['avoid','review'].includes(p.state))reviews.push({id:'preference-'+p.exercise,title:(data.exercises.find(e=>e.id===p.exercise)?.name||p.exercise)+' · current preference',text:(root.FormPreferences?.labels[p.state]||p.state)+(p.note?': '+p.note:'.')+' Progression is paused. Saved prescriptions and actual recording remain available.'});
  if(!last)reviews.push({id:'first-session',title:'Start with a verified session',text:'Record your actual performance and confirm completed sets. Scheduled workouts and draft entries do not contribute to this review.'});
  else {
   const drafts=last.log.sets.filter(s=>!s.confirmed).length;
   reviews.push({id:'session-'+last.date,title:'Latest session · '+last.date,text:last.sets.length+' confirmed sets'+(drafts?' and '+drafts+' unconfirmed drafts':'')+'. Only confirmed sets contribute to your results.'});
   const first=sessions[0].date,elapsed=Math.floor((Date.parse(today)-Date.parse(first))/86400000);
   if(elapsed>=28)reviews.push({id:'review-'+Math.floor(elapsed/28),title:'Program reassessment',text:'You have at least four weeks of recorded training. Review your goals, availability and confirmed performance before changing your plan. Changes to physiotherapy prescriptions need clinician guidance.'});
   for(const signal of root.FormTraining?.reviewSignals(data,today)||[])reviews.push({id:'progress-'+signal.exercise+'-'+signal.dates.at(-1),title:signal.name+' · progression review',text:'All targets were confirmed on '+signal.dates.join(' and ')+', with matching saved targets and known loads. Review these results in Progression reviews. This does not establish readiness or change your prescription.'});
  }
  const adjusted=days.filter(([,log])=>Object.keys(log.changes||{}).length).at(-1);
  if(adjusted){const summary=root.FormSession.summary(adjusted[1]);reviews.push({id:'changes-'+adjusted[0],title:'Session changes · '+adjusted[0],text:summary.skipped+' movements with remaining sets skipped; '+summary.substituted+' substitutions. Prescriptions remain unchanged and only confirmed actual sets count.'})}
  const unfinished=days.filter(([,log])=>log.sets.some(s=>s.confirmed!==true)).map(([date,log,id])=>({date,id,name:log.plan?.routine?.name||'Recorded session',drafts:log.sets.filter(s=>s.confirmed!==true).length}));
  if(unfinished.length)reviews.push({id:'draft-review',title:'Unconfirmed entries to review',text:unfinished.reduce((n,s)=>n+s.drafts,0)+' draft sets across '+unfinished.length+' sessions. Review actual values and confirm only sets you completed. Drafts are excluded from progress.'});
  return {sessions:sessions.length,sets:total,volume,week,reviews,unfinished};
 }
 function reply(question,data,today,guides={}){
  const q=question.toLowerCase(),report=analyse(data,today);
  if(/preference|avoid|paused/.test(q))return (data.exercisePreferences||[]).length?data.exercisePreferences.map(p=>(data.exercises.find(e=>e.id===p.exercise)?.name||p.exercise)+': '+(root.FormPreferences?.labels[p.state]||p.state)+(p.note?' — '+p.note:'')).join('\n'):'No exercise preferences have been saved. Add your own choices in Settings.';
  if(/pain|injur|cervical|medical|diagnos/.test(q))return 'This local coach cannot assess symptoms or change clinical guidance. Follow your saved clinician instructions and discuss changes with your treating professional.';
  if(/restriction|clinician|physio/.test(q))return data.restrictions?.trim()?'Your saved guidance:\n'+data.restrictions:'No exercise restrictions or clinician guidance have been saved in Settings. I will not infer them from your records.';
  if(/draft|unconfirmed|unfinished/.test(q))return report.unfinished.length?report.unfinished.map(s=>s.date+' · '+s.name+': '+s.drafts+' draft sets').join('\n')+'\nReview these sessions; do not confirm entries unless the sets were completed.':'No unconfirmed set entries through today. This does not imply that every scheduled session was completed.';
  if(/progress|review|week|history|recent/.test(q))return report.week+' sessions with confirmed sets in the last 7 days. '+report.sets+' confirmed sets overall.\n\n'+report.reviews.map(r=>r.title+': '+r.text).join('\n\n');
  const e=data.exercises.find(e=>q.includes(e.name.toLowerCase()));
  if(e){const guide=guides[e.sourceExerciseId||e.id];return e.name+'\n'+(e.instructions||guide?.steps?.join('\n')||'No reviewed instructions are available for this exercise.')+'\nOpen its movement guide for the exact variation and demonstration.';}
  if(/add|modif|generat|yoga|mobility|import|substitut/.test(q))return 'Use Exercises to add your own movement or import a reviewed workout. Choose a routine in Calendar to schedule it. I cannot generate or approve exercise substitutions; your prescriptions remain unchanged.';
  return 'I can summarise confirmed progress or show instructions for an exercise named exactly as it appears in your library. For goals or program changes, this local assistant can only help you review your records; external AI is not connected.';
 }
 root.FormCoach={analyse,reply};
})(typeof window==='undefined'?globalThis:window);
