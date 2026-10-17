/* Local deterministic analysis: no requests, credentials or clinical prescriptions. */
(function(root){
 'use strict';
 function analyse(data, today){
  const days=Object.entries(data.logs).filter(([date])=>date<=today).sort(([a],[b])=>a.localeCompare(b));
  const sessions=days.map(([date,log])=>({date,sets:log.sets.filter(s=>s.confirmed===true)})).filter(s=>s.sets.length);
  const last=sessions.at(-1), total=sessions.reduce((n,s)=>n+s.sets.length,0);
  const volume=sessions.reduce((n,s)=>n+s.sets.reduce((sum,set)=>{const exercise=data.exercises.find(e=>e.id===set.exerciseId);return sum+(exercise&&exercise.kind!=='seconds'&&set.weight!==null?set.weight*set.reps:0)},0),0);
  const cutoff=new Date(today+'T12:00:00Z');cutoff.setUTCDate(cutoff.getUTCDate()-6);
  const week=sessions.filter(s=>s.date>=cutoff.toISOString().slice(0,10)).length;
  const reviews=[];
  if(!last)reviews.push({id:'first-session',title:'Start with a verified session',text:'Record your actual performance and confirm completed sets. Scheduled workouts and draft entries do not contribute to this review.'});
  else {
   const drafts=data.logs[last.date].sets.filter(s=>!s.confirmed).length;
   reviews.push({id:'session-'+last.date,title:'Latest session · '+last.date,text:last.sets.length+' confirmed sets'+(drafts?' and '+drafts+' unconfirmed drafts':'')+'. Only confirmed sets contribute to your results.'});
   const first=sessions[0].date,elapsed=Math.floor((Date.parse(today)-Date.parse(first))/86400000);
   if(elapsed>=28)reviews.push({id:'review-'+Math.floor(elapsed/28),title:'Program reassessment',text:'You have at least four weeks of recorded training. Review your goals, availability and confirmed performance before changing your plan. Changes to physiotherapy prescriptions need clinician guidance.'});
   const byExercise=new Map();
   for(const session of sessions)for(const set of session.sets){if(!byExercise.has(set.exerciseId))byExercise.set(set.exerciseId,[]);byExercise.get(set.exerciseId).push({...set,date:session.date})}
   for(const [id,sets] of byExercise){const exercise=data.exercises.find(e=>e.id===id);const dates=[...new Set(sets.map(s=>s.date))];if(!exercise||dates.length<2||exercise.kind==='seconds')continue;
    const previous=sets.filter(s=>s.date===dates.at(-2)),current=sets.filter(s=>s.date===dates.at(-1));
    const comparable=previous.length===current.length&&previous.every(a=>current.some(b=>a.index===b.index&&a.weight===b.weight));
    if(comparable&&current.every(a=>a.reps>=previous.find(b=>b.index===a.index).reps))reviews.push({id:'progress-'+id+'-'+dates.at(-1),title:exercise.name+' · progression review',text:'Across the last two recorded sessions, you matched or exceeded repetitions for the same confirmed sets and entered loads. Check technique, effort and any missing sets before considering a progression. This does not establish readiness or change your prescription.'});
   }
  }
  return {sessions:sessions.length,sets:total,volume,week,reviews};
 }
 function reply(question,data,today,guides={}){
  const q=question.toLowerCase(),report=analyse(data,today);
  if(/pain|injur|cervical|medical|diagnos/.test(q))return 'This local coach cannot assess symptoms or change clinical guidance. Follow your saved clinician instructions and discuss changes with your treating professional.';
  if(/progress|review|week|history|recent/.test(q))return report.week+' verified sessions in the last 7 days. '+report.sets+' confirmed sets overall.\n\n'+report.reviews.map(r=>r.title+': '+r.text).join('\n\n');
  const e=data.exercises.find(e=>q.includes(e.name.toLowerCase()));
  if(e){const guide=guides[e.sourceExerciseId||e.id];return e.name+'\n'+(e.instructions||guide?.steps?.join('\n')||'No reviewed instructions are available for this exercise.')+'\nOpen its movement guide for the exact variation and demonstration.';}
  if(/add|modif|generat|yoga|mobility|import|substitut/.test(q))return 'Use Exercises to add your own movement or import a reviewed workout. Choose a routine in Calendar to schedule it. I cannot generate or approve exercise substitutions; your prescriptions remain unchanged.';
  return 'I can summarise confirmed progress or show instructions for an exercise named exactly as it appears in your library. For goals or program changes, this local assistant can only help you review your records; external AI is not connected.';
 }
 root.FormCoach={analyse,reply};
})(typeof window==='undefined'?globalThis:window);
