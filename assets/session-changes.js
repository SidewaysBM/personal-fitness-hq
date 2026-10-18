(function(root){
 'use strict';
 function exercise(log,id,library=[]){const e=Object.values(log?.changes||{}).find(c=>c.replacement?.id===id)?.replacement||log?.plan?.exercises.find(e=>e.id===id)||library.find(e=>e.id===id);return e?{...e,...log?.targetEdits?.[id]}:e}
 function change(data,profile,date,id,action,options={}){
  const next=structuredClone(data),log=FormProgram.record(next,profile,date,options.sessionId),original=exercise(log,id);
  if(!original)throw Error('This movement is not in the recorded session.');
  log.changes=log.changes||{};const previous=log.changes[id];
  const note=String(options.note??previous?.note??'').trim(),updatedAt=new Date().toISOString();
  if(action==='skip'&&(log.sets.filter(s=>s.exerciseId===(previous?.replacement?.id||id)&&s.confirmed===true).length>=(previous?.replacement||original).sets)&&(previous?.replacement||original).sets>0)throw Error('All target sets are already confirmed. Correct the actual records first if needed.');
  if(action==='skip')log.changes[id]=previous?.status==='substituted'?{...previous,remainingSkipped:true,note,updatedAt}:{status:'skipped',note,updatedAt};
  else if(action==='resume'){
   if(previous?.status==='substituted')log.changes[id]={...previous,remainingSkipped:false,note,updatedAt};else delete log.changes[id];
  }else if(action==='undo'){
   if(previous?.replacement&&log.sets.some(s=>s.exerciseId===previous.replacement.id))throw Error('This substitute has recorded entries. Keep it to preserve those records; you can correct its actual values or skip its remaining sets.');
   delete log.changes[id];
  }else if(action==='substitute'){
   if(previous?.replacement&&log.sets.some(s=>s.exerciseId===previous.replacement.id))throw Error('The existing substitute has recorded entries. Correct its records instead of replacing it.');
   const target=next.exercises.find(e=>e.id===options.replacementId);
   if(!target||log.plan.routine.ids.includes(target.id)||Object.entries(log.changes).some(([key,c])=>key!==id&&c.replacement?.id===target.id))throw Error('Choose a different movement that is not already part of this session.');
   const {sets,reps,rest,kind,weights}=options;
   if(!Number.isInteger(sets)||sets<1||sets>100||!Number.isInteger(reps)||reps<0||!Number.isFinite(rest)||rest<0||!['reps','seconds'].includes(kind)||!Array.isArray(weights)||weights.length>sets||weights.some(w=>w!==null&&(typeof w!=='number'||!Number.isFinite(w)||w<0)))throw Error('Enter valid targets for the substitute. Unknown loads can remain blank.');
   const replacement={...structuredClone(target),sets,reps,rest,kind,weights:structuredClone(weights)};
   log.changes[id]={status:'substituted',replacement,remainingSkipped:false,note,updatedAt};
  }else throw Error('Unknown session change.');
  return next;
 }
 function canRecord(log,id,index){
  if(log?.sets.some(s=>s.exerciseId===id&&s.index===index))return true;
  const replacement=Object.values(log?.changes||{}).find(c=>c.replacement?.id===id);
  if(replacement)return !replacement.remainingSkipped;
  return !log?.changes?.[id];
 }
 function summary(log){
  const result={confirmed:0,skipped:0,substituted:0,partial:0,unconfirmed:0,unrecorded:0};
  result.confirmed=(log?.sets||[]).filter(s=>s.confirmed===true).length;
  for(const e of log?.plan?.exercises||[]){
   const c=log.changes?.[e.id],actual=c?.replacement||{...e,...log.targetEdits?.[e.id]},verified=(log.sets||[]).filter(s=>s.exerciseId===actual.id&&s.confirmed===true).length;
   if(c?.status==='substituted')result.substituted++;
   if(c?.status==='skipped'||c?.remainingSkipped)result.skipped++;
   else if(verified>0&&verified<actual.sets)result.partial++;
   else if(!verified){if((log.sets||[]).some(s=>s.exerciseId===actual.id))result.unconfirmed++;else result.unrecorded++}
  }
  result.allSkipped=Boolean(log?.plan?.exercises.length)&&result.skipped===log.plan.exercises.length&&result.confirmed===0;
  return result;
 }
 function open({data,plan,id,change:current,log,escape,onSave}){
  const e=plan.exercises.find(e=>e.id===id),used=new Set(plan.routine.ids);
  for(const c of Object.values(log?.changes||{}))if(c.replacement)used.add(c.replacement.id);
  const candidates=data.exercises.filter(e=>!used.has(e.id));
  const dialog=document.createElement('dialog');dialog.className='panel program-editor';dialog.setAttribute('aria-label','Change this session');
  dialog.innerHTML='<form><h2>Change this session</h2><p>'+escape(e.name)+'</p><p class="notice">The original prescription and all recorded sets stay intact. Substitutions are your choice; follow your clinician’s guidance.</p><label class="field">Action<select name="action"><option value="skip">Skip remaining sets</option>'+(current?'<option value="resume">Resume remaining sets</option>':'')+(current?.status==='substituted'?'<option value="undo">Remove substitution (before recording)</option>':'<option value="substitute">Use a substitute</option>')+'</select></label><fieldset data-substitute hidden disabled><legend>Substitute targets</legend><label class="field">Exercise<select name="replacementId" required><option value="">Choose a movement</option>'+candidates.map(e=>'<option value="'+escape(e.id)+'">'+escape(e.name)+(root.FormPreferences?.get(data,e.id)?' · '+escape(root.FormPreferences.labels[root.FormPreferences.get(data,e.id).state]):'')+'</option>').join('')+'</select></label><p data-preference class="notice" hidden></p><p class="tiny muted">Enter known targets for this session. Original loads are not copied.</p><div class="program-fields"><label>Sets<input name="sets" type="number" min="1" max="100" step="1" required></label><label>Reps / seconds<input name="reps" type="number" min="0" step="1" required></label><label>Unit<select name="kind"><option value="reps">Repetitions</option><option value="seconds">Seconds</option></select></label><label>Rest (seconds)<input name="rest" type="number" min="0" step="1" required></label></div><label class="field">Loads by set (kg, optional)<input name="weights" placeholder="Blank means unknown"></label></fieldset><label class="field">Reason or session note (optional)<textarea name="note">'+escape(current?.note||'')+'</textarea></label><p role="alert"></p><div class="row program-actions"><button type="submit" class="primary">Save session change</button><button type="button" class="secondary" data-cancel>Cancel</button></div></form>';
  const action=dialog.querySelector('[name=action]');action.onchange=()=>{const fields=dialog.querySelector('fieldset');fields.hidden=action.value!=='substitute';fields.disabled=fields.hidden};
  dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
  const replacement=dialog.querySelector('[name=replacementId]');replacement.onchange=()=>{const p=root.FormPreferences?.get(data,replacement.value),notice=dialog.querySelector('[data-preference]');notice.hidden=!p;notice.textContent=p?'Current preference: '+root.FormPreferences.labels[p.state]+(p.note?' · '+p.note:'')+'. Choosing a substitute does not change that preference.':''};
  dialog.querySelector('form').onsubmit=async event=>{event.preventDefault();const f=new FormData(event.target),options={note:f.get('note')};if(action.value==='substitute'){for(const key of ['sets','reps','rest'])options[key]=Number(f.get(key));options.kind=f.get('kind');options.replacementId=f.get('replacementId');options.weights=f.get('weights').trim()===''?[]:f.get('weights').split(',').map(w=>w.trim()===''?null:Number(w.trim()))}try{if(await onSave(action.value,options))dialog.close()}catch(e){dialog.querySelector('[role=alert]').textContent=e.message}};
  document.body.appendChild(dialog);dialog.showModal();
 }
 function entries(data){return Object.entries(data.logs).map(([date,log])=>[date,log,'']).concat((data.extraSessions||[]).map(s=>[s.date,s.log,s.id]))}
 root.FormSession={entries,exercise,change,canRecord,summary,open};
})(typeof window==='undefined'?globalThis:window);
