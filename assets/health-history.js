/* Local import receipts and reversible archival. Never overwrite a later correction. */
(function(root){
 'use strict';
 const copy=value=>structuredClone(value),stamp=value=>typeof value==='string'&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString()===value;
 const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
 function validate(batches){
  if(!Array.isArray(batches))throw Error('Invalid Health import history');const seen=new Set();
  for(const b of batches){
   if(!b||!/^health-batch-[a-zA-Z0-9-]+$/.test(b.id)||seen.has(b.id)||!stamp(b.createdAt)||!Array.isArray(b.records)||!b.records.length||!Array.isArray(b.archivedIds))throw Error('Invalid Health import receipt');seen.add(b.id);
   root.FormActivities.validate(b.records);
   if(b.records.some(r=>r.source!=='Apple Health'||!r.confirmed)||new Set(b.archivedIds).size!==b.archivedIds.length||b.archivedIds.some(id=>!b.records.some(r=>r.id===id)))throw Error('Invalid archived Health activities');
   for(const key of ['lastUndoneAt','lastRestoredAt'])if(b[key]!==undefined&&(!stamp(b[key])||b[key]<b.createdAt))throw Error('Invalid Health import history date');
  }
  return batches;
 }
 function known(data){return [...(data.activities||[]),...(data.healthImports||[]).flatMap(b=>b.records)]}
 function add(data,chosen,id,when){
  const existing=new Set(known(data).map(r=>r.id)),records=chosen.filter(r=>{if(existing.has(r.id))return false;existing.add(r.id);return true});
  if(!records.length)throw Error('These workouts are already saved or archived. Use import history to restore archived activities.');
  const next=copy(data),batch={id,createdAt:when,records:copy(records),archivedIds:[]};
  next.healthImports=(next.healthImports||[]).concat(batch);validate(next.healthImports);next.activities=(next.activities||[]).concat(copy(records));return next;
 }
 function inspect(data,id){
  const batch=data.healthImports?.find(b=>b.id===id);if(!batch)throw Error('Import batch not found.');
  const current=new Map((data.activities||[]).map(r=>[r.id,r])),archived=new Set(batch.archivedIds),unchanged=[],changed=[],missing=[],restorable=[],conflicts=[];
  for(const r of batch.records){const live=current.get(r.id);if(archived.has(r.id)){(live?conflicts:restorable).push(r)}else if(!live)missing.push(r);else (canonical(live)===canonical(r)?unchanged:changed).push(r)}
  return {batch,unchanged,changed,missing,restorable,conflicts};
 }
 function apply(data,id,action,when){
  const report=inspect(data,id);if(!stamp(when)||when<report.batch.createdAt)throw Error('The action date precedes this import.');
  const next=copy(data),batch=next.healthImports.find(b=>b.id===id);
  if(action==='undo'){
   if(!report.unchanged.length)throw Error('No unchanged activities remain to undo.');const ids=new Set(report.unchanged.map(r=>r.id));
   next.activities=(next.activities||[]).filter(r=>!ids.has(r.id));batch.archivedIds.push(...ids);batch.lastUndoneAt=when;
  }else if(action==='restore'){
   if(!report.restorable.length)throw Error('No archived activities can be restored without replacing existing records.');const ids=new Set(report.restorable.map(r=>r.id));
   next.activities=(next.activities||[]).concat(copy(report.restorable));batch.archivedIds=batch.archivedIds.filter(id=>!ids.has(id));batch.lastRestoredAt=when;
  }else throw Error('Unknown import history action');
  validate(next.healthImports);root.FormActivities.validate(next.activities);return next;
 }
 root.FormHealthHistory={validate,known,add,inspect,apply,canonical};
})(typeof window==='undefined'?globalThis:window);

function healthHistoryHtml(){
 const batches=data.healthImports||[];return '<details class="section"><summary>Health import history ('+batches.length+')</summary><p class="tiny muted">Undo archives unchanged activities from an import. Later corrections stay in place. Archived originals stay in your JSON backup and can be restored. Imports made before this feature have no receipt.</p>'+batches.slice().reverse().map(b=>{const r=FormHealthHistory.inspect(data,b.id);return '<article class="review-card"><strong>'+esc(new Date(b.createdAt).toLocaleString('en-AU',{dateStyle:'medium',timeStyle:'short'}))+' · '+b.records.length+' imported activities</strong><p>'+r.unchanged.length+' unchanged · '+r.changed.length+' corrected · '+b.archivedIds.length+' archived'+(r.missing.length?' · '+r.missing.length+' no longer present':'')+'</p><button class="ghost" data-health-batch="'+esc(b.id)+'">Review import</button></article>'}).join('')+'</details>';
}
function reviewHealthBatch(id){
 const assertContext=editingContext(false),baseline=FormHealthHistory.canonical([data.activities,data.healthImports]),report=FormHealthHistory.inspect(data,id),d=document.createElement('dialog');let page=0;
 d.className='panel import-editor';d.setAttribute('aria-label','Review Health import');
 d.innerHTML='<h2>Review Health import</h2><p>'+esc(new Date(report.batch.createdAt).toLocaleString('en-AU',{dateStyle:'medium',timeStyle:'short'}))+' · '+report.batch.records.length+' activities</p><p>'+report.unchanged.length+' unchanged activities can be archived. '+report.changed.length+' corrected activities will be kept. '+report.restorable.length+' archived activities can be restored.'+(report.conflicts.length?' '+report.conflicts.length+' archived originals have a matching current record and will not replace it.':'')+'</p><p class="tiny muted">Rows show original imported values. Corrections are kept in Activities.</p><div data-batch-rows style="max-height:30dvh;overflow:auto"></div><div class="row"><button class="ghost" data-prev>Previous page</button><span data-page></span><button class="ghost" data-next>Next page</button></div><p role="alert"></p><div class="row" style="position:sticky;bottom:-20px;background:#151e28;padding:12px 0"><button class="secondary" data-undo'+(!report.unchanged.length?' disabled hidden':'')+'>Undo unchanged activities</button><button class="secondary" data-restore'+(!report.restorable.length?' disabled hidden':'')+'>Restore archived activities</button><button class="ghost" data-close>Close</button></div>';
 function draw(){const pages=Math.ceil(report.batch.records.length/20);d.querySelector('[data-page]').textContent=(page+1)+' / '+pages;d.querySelector('[data-prev]').disabled=page===0;d.querySelector('[data-next]').disabled=page>=pages-1;d.querySelector('[data-batch-rows]').innerHTML=report.batch.records.slice(page*20,(page+1)*20).map(r=>{const state=report.unchanged.includes(r)?'Unchanged · eligible for undo':report.changed.includes(r)?'Corrected · kept':report.restorable.includes(r)?'Archived · restorable':report.conflicts.includes(r)?'Archived · current record kept':'No longer present';return '<article class="review-card"><strong>'+esc(r.date+' · '+r.category+' · '+r.minutes+' min')+'</strong><p>'+esc(r.sourceName||'Source not supplied')+' · '+state+'</p></article>'}).join('')}
 for(const action of ['undo','restore'])d.querySelector('[data-'+action+']').onclick=()=>{try{assertContext();if(baseline!==FormHealthHistory.canonical([data.activities,data.healthImports]))throw Error('Activities changed. Close and reopen this review.');if(!confirm(action==='undo'?'Archive '+report.unchanged.length+' unchanged activities? They will leave totals but remain restorable. Corrected activities stay in place.':'Restore '+report.restorable.length+' archived activities with their original confirmation status? Existing records stay in place.'))return;data=FormHealthHistory.apply(data,id,action,new Date().toISOString());if(save()){d.close();render()}}catch(error){d.querySelector('[role=alert]').textContent=error.message}};
 d.querySelector('[data-prev]').onclick=()=>{page--;draw()};d.querySelector('[data-next]').onclick=()=>{page++;draw()};d.querySelector('[data-close]').onclick=()=>d.close();d.onclose=()=>d.remove();document.body.append(d);draw();d.showModal();const h=d.querySelector('h2');h.tabIndex=-1;h.focus();
}
if(typeof document!=='undefined')document.addEventListener('click',event=>{const b=event.target.closest('[data-health-batch]');if(b)reviewHealthBatch(b.dataset.healthBatch)});
