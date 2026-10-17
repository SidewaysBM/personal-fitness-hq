(function(root){
 'use strict';
 const categories=['Strength','Yoga','Pilates','Mobility','Stretching','Running','Walking','Cycling','Swimming','Conditioning','Custom'];
 function validate(records){
  if(!Array.isArray(records))throw Error('Invalid activity records');
  const ids=new Set();
  for(const r of records){
   if(!r||typeof r.id!=='string'||ids.has(r.id)||!categories.includes(r.category)||typeof r.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!Number.isFinite(Date.parse(r.date))||new Date(r.date).toISOString().slice(0,10)!==r.date||typeof r.confirmed!=='boolean'||typeof r.notes!=='string')throw Error('Invalid activity details');
   ids.add(r.id);
   for(const key of ['minutes','distanceKm'])if(r[key]!==null&&(typeof r[key]!=='number'||!Number.isFinite(r[key])||r[key]<0))throw Error('Invalid activity measurements');
   if(r.confirmed&&!(r.minutes>0))throw Error('Confirmed activities need a duration');
  }
  return records;
 }
 function open({records=[],today,onSave,escape,editId}){
  const existing=records.find(r=>r.id===editId);
  const dialog=document.createElement('dialog');dialog.className='panel activity-editor';
  dialog.innerHTML=`<form><h2>${existing?'Correct activity':'Record activity'}</h2><p>Enter actual activity. Confirm completion only when you have finished.</p><label class="field">Date<input name="date" type="date" required value="${existing?.date||today}"></label><label class="field">Activity<select name="category">${categories.map(c=>`<option${existing?.category===c?' selected':''}>${c}</option>`).join('')}</select></label><label class="field">Duration (minutes)<input name="minutes" type="number" min="0.1" step="0.1" required value="${existing?.minutes??''}"></label><label class="field">Distance (km, optional)<input name="distanceKm" type="number" min="0" step="0.01" value="${existing?.distanceKm??''}"></label><label class="field">Notes<textarea name="notes">${escape(existing?.notes||'')}</textarea></label><label class="row"><input name="confirmed" type="checkbox"> I confirm this activity is completed</label><p class="tiny muted">Saving without confirmation keeps a draft. Corrections require fresh confirmation. Activity minutes stay separate from gym set counts and load volume.</p><p role="alert"></p><div class="row"><button class="primary" type="submit">Save activity</button><button class="secondary" type="button" data-cancel>Cancel</button></div></form>`;
  dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
  dialog.querySelector('form').onsubmit=event=>{event.preventDefault();const f=new FormData(event.target);const next={...(existing||{}),id:existing?.id||crypto.randomUUID(),date:f.get('date'),category:f.get('category'),minutes:Number(f.get('minutes')),distanceKm:f.get('distanceKm')===''?null:Number(f.get('distanceKm')),notes:f.get('notes'),confirmed:f.has('confirmed'),updatedAt:new Date().toISOString()};const updated=records.filter(r=>r.id!==next.id).concat(next);try{validate(updated);if(onSave(updated))dialog.close()}catch(e){dialog.querySelector('[role=alert]').textContent=e.message}};
  document.body.appendChild(dialog);dialog.showModal();
 }
 root.FormActivities={validate,open};
})(typeof window==='undefined'?globalThis:window);
