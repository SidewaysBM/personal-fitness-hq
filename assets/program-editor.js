(function(root){
 'use strict';
 function mount(title,body,onSubmit){
  const dialog=document.createElement('dialog');dialog.className='panel program-editor';dialog.setAttribute('aria-label',title);
  dialog.innerHTML='<form><h2>'+title+'</h2>'+body+'<p role="alert"></p><div class="row program-actions"><button class="primary" type="submit">Save changes</button><button class="secondary" type="button" data-cancel>Cancel</button></div></form>';
  dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
  dialog.querySelector('form').onsubmit=event=>{event.preventDefault();try{if(onSubmit(dialog))dialog.close()}catch(e){dialog.querySelector('[role=alert]').textContent=e.message}};
  document.body.appendChild(dialog);dialog.showModal();return dialog;
 }
 function routine({data,id,escape,onSave,title='Edit workout prescriptions',intro='Edits the normal routine for sessions you have not started. Dated training plans and recorded sessions retain their saved targets.'}){
  const r=data.routines.find(r=>r.id===id),ordered=[...r.ids,...data.exercises.map(e=>e.id).filter(id=>!r.ids.includes(id))];
  const cards=ordered.map(id=>{const original=data.exercises.find(e=>e.id===id),e={...original,...r.prescriptions?.[id]},included=r.ids.includes(id),preference=root.FormPreferences?.get(data,id);return '<details data-exercise="'+escape(id)+'"'+(included?' open':'')+'><summary>'+escape(e.name)+'</summary>'+(preference?'<p class="notice">Current preference: '+escape(root.FormPreferences.labels[preference.state])+(preference.note?' · '+escape(preference.note):'')+'</p>':'')+'<label class="include"><input type="checkbox" name="included"'+(included?' checked':'')+'> Include in this workout</label><div class="program-fields"><label>Sets<input name="sets" type="number" min="1" max="100" step="1" value="'+(e.sets||'')+'"></label><label>Reps / seconds<input name="reps" type="number" min="0" step="1" value="'+e.reps+'"></label><label>Unit<select name="kind"><option value="'+escape(e.kind)+'">'+(e.kind==='seconds'?'Seconds':'Repetitions')+'</option>'+(e.kind==='seconds'?'<option value="reps">Repetitions</option>':'<option value="seconds">Seconds</option>')+'</select></label><label>Rest (seconds)<input name="rest" type="number" min="0" step="1" value="'+e.rest+'"></label></div><label class="field">Loads by set (kg)<input name="weights" value="'+escape(e.weights.map(w=>w??'').join(', '))+'" placeholder="For example: 30, 32.5, 35"></label><p class="tiny muted">Comma-separated loads in set order. Leave blank for unknown loads. A blank position stays unknown.</p></details>'}).join('');
  const editor=mount(title,'<p>'+escape(intro)+'</p><p class="notice">Keep physiotherapist-prescribed changes aligned with your clinician’s guidance. No suggested progression is applied automatically.</p><label class="field">Workout name<input name="title" required maxlength="120" value="'+escape(r.name)+'"></label><label class="field">Workout instructions<textarea name="note">'+escape(r.note)+'</textarea></label>'+cards,dialog=>{
   const ids=[],prescriptions={};
   for(const row of dialog.querySelectorAll('[data-exercise]')){
    if(!row.querySelector('[name=included]').checked)continue;
    const val=n=>row.querySelector('[name='+n+']').value,sets=Number(val('sets')),reps=Number(val('reps')),rest=Number(val('rest'));
    if(!val('sets')||!Number.isInteger(sets)||sets<1||sets>100||val('reps')===''||!Number.isInteger(reps)||reps<0||val('rest')===''||!Number.isInteger(rest)||rest<0)throw Error('Enter valid sets, repetitions/seconds and rest for every included movement.');
    const weights=val('weights').trim()===''?[]:val('weights').split(',').map(w=>w.trim()===''?null:Number(w.trim()));
    if(weights.length>sets||weights.some(w=>w!==null&&(!Number.isFinite(w)||w<0)))throw Error('Use no more than one non-negative load per set. Leave unknown loads blank.');
    const id=row.dataset.exercise;ids.push(id);prescriptions[id]={sets,reps,rest,weights,kind:val('kind')};
   }
   const name=dialog.querySelector('[name=title]').value.trim();if(!name)throw Error('Enter a workout name.');
   return onSave({name,note:dialog.querySelector('[name=note]').value,ids,prescriptions});
  });
  for(const row of editor.querySelectorAll('[data-exercise]')){const controls=document.createElement('div');controls.className='row';for(const [label,dir] of [['Move up',-1],['Move down',1]]){const b=document.createElement('button');b.type='button';b.className='ghost';b.textContent=label;b.onclick=()=>{const other=dir<0?row.previousElementSibling:row.nextElementSibling;if(other?.matches('[data-exercise]')){if(dir<0)other.before(row);else other.after(row);b.focus()}};controls.append(b)}row.append(controls)}
 }
 function schedule({data,profile,today,escape,onSave}){
  const days=FormProgram.week(data,profile,today),names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  mount('Edit weekly schedule','<p>This schedule belongs to '+escape(profile)+'. Date-specific choices take priority. Recorded sessions are preserved.</p><label class="field">Apply from<input name="from" type="date" value="'+today+'" min="'+today+'" required></label><div class="schedule-days">'+[1,2,3,4,5,6,0].map(day=>'<label>'+names[day]+'<select name="day-'+day+'"><option value="">Rest / unscheduled</option>'+data.routines.map(r=>'<option value="'+escape(r.id)+'"'+(days[day]===r.id?' selected':'')+'>'+escape(r.name)+'</option>').join('')+'</select></label>').join('')+'</div><p class="tiny muted">Each revision applies until the next saved revision. The calendar continues indefinitely.</p>'+((data.scheduleChanges||[]).length?'<p class="tiny muted">Saved revision dates: '+data.scheduleChanges.map(r=>escape(r.from)).join(', ')+'</p>':''),dialog=>{
   const from=dialog.querySelector('[name=from]').value;if(from<today)throw Error('Choose today or a future date.');
   const days=Object.fromEntries(names.map((_,i)=>[i,dialog.querySelector('[name=day-'+i+']').value||null]));return onSave(from,days);
  });
 }
 root.FormProgramEditor={routine,schedule};
})(typeof window==='undefined'?globalThis:window);
