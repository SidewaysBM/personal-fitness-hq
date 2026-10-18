/* User-entered preferences. These never infer medical restrictions or rewrite training. */
(function(root){
 'use strict';
 const labels={preferred:'Preferred',avoid:'Avoid for now',review:'Review before progressing'};
 function identity(data,id){const seen=new Set();while(!seen.has(id)){seen.add(id);const source=data.exercises.find(e=>e.id===id)?.sourceExerciseId;if(!source||seen.has(source)||!data.exercises.some(e=>e.id===source))break;id=source}return id}
 function get(data,id){return data.exercisePreferences?.find(p=>p.exercise===identity(data,id))||null}
 function signature(data,id){const p=get(data,id);return p?JSON.stringify([p.state,p.note,p.updatedAt]):''}
 function blocked(data,id){return ['avoid','review'].includes(get(data,id)?.state)}
 function validate(preferences,data){
  if(!Array.isArray(preferences))throw Error('Invalid exercise preferences');const ids=new Set();
  for(const p of preferences){if(!p||!data.exercises.some(e=>e.id===p.exercise)||ids.has(p.exercise)||identity(data,p.exercise)!==p.exercise||!Object.hasOwn(labels,p.state)||typeof p.note!=='string'||p.note.length>1000||typeof p.updatedAt!=='string'||!Number.isFinite(Date.parse(p.updatedAt))||new Date(p.updatedAt).toISOString()!==p.updatedAt)throw Error('Invalid exercise preference');ids.add(p.exercise)}return preferences;
 }
 function set(data,id,state,note,when){
  if(!data.exercises.some(e=>e.id===id))throw Error('Movement not found.');
  id=identity(data,id);const next=structuredClone(data);next.exercisePreferences=(next.exercisePreferences||[]).filter(p=>p.exercise!==id);
  if(state!=='none')next.exercisePreferences.push({exercise:id,state,note:String(note||'').trim(),updatedAt:when});
  validate(next.exercisePreferences,next);return next;
 }
 root.FormPreferences={labels,get,signature,blocked,validate,set};
})(typeof window==='undefined'?globalThis:window);

function exercisePreferenceNotice(exercise){
 const p=FormPreferences.get(data,exercise.id);if(!p)return '';
 return '<div class="notice"><strong>Current preference: '+esc(FormPreferences.labels[p.state])+'</strong>'+(p.note?'<p class="tiny">'+esc(p.note)+'</p>':'')+(p.state==='preferred'?'':'<p class="tiny">Progression is paused for this movement. Existing prescriptions and recorded results remain unchanged.</p>')+'</div>';
}
function exercisePreferencesPanel(){
 const preferences=data.exercisePreferences||[];return '<section class="panel section"><h2>Exercise preferences</h2><p>Choose preferences and restrictions for '+esc(activeProfile)+'. Avoid for now and Review before progressing pause target proposals for that movement. Preferred is a personal label, not a readiness assessment.</p><p class="tiny muted">Preferences also apply to imported copies matched to that library movement. Nothing is selected automatically. Existing programmes, saved sessions and actual recording remain available. Change a future workout explicitly if needed.</p><button class="secondary" data-action-click="editExercisePreference()">Set exercise preference</button>'+preferences.map(p=>'<article class="review-card"><strong>'+esc(ex(p.exercise)?.name||p.exercise)+' · '+esc(FormPreferences.labels[p.state])+'</strong>'+(p.note?'<p>'+esc(p.note)+'</p>':'')+'<button class="ghost" data-edit-preference="'+esc(p.exercise)+'">Edit preference</button></article>').join('')+'</section>';
}
function editExercisePreference(id){
 const assertContext=editingContext(false),signature=JSON.stringify(data.exercisePreferences||[]),options=data.exercises.map(e=>'<option value="'+esc(e.id)+'">'+esc(e.name)+'</option>').join('');
 const dialog=trainingDialog('Exercise preference','<p>Preferences apply to the library movement and imported copies matched to it. Avoid/review pauses progression; it does not remove exercises or change saved results.</p><label class="field">Movement<select name="movement">'+options+'</select></label><label class="field">Preference<select name="preference"><option value="none">No preference / remove</option>'+Object.entries(FormPreferences.labels).map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('')+'</select></label><label class="field">My instruction or reason (optional)<textarea name="preferenceNote" maxlength="1000"></textarea></label>',async d=>{
  assertContext();if(signature!==JSON.stringify(data.exercisePreferences||[]))throw Error('Preferences changed. Close and reopen this form.');
  data=FormPreferences.set(data,d.querySelector('[name=movement]').value,d.querySelector('[name=preference]').value,d.querySelector('[name=preferenceNote]').value,new Date().toISOString());if(!await save())return false;render();
 });
 const movement=dialog.querySelector('[name=movement]');if(id)movement.value=id;
 const show=()=>{const p=FormPreferences.get(data,movement.value);dialog.querySelector('[name=preference]').value=p?.state||'none';dialog.querySelector('[name=preferenceNote]').value=p?.note||''};movement.onchange=show;show();
}
if(typeof document!=='undefined')document.addEventListener('click',event=>{const b=event.target.closest('[data-edit-preference]');if(b)editExercisePreference(b.dataset.editPreference)});
