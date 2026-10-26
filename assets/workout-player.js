/* Presentation only: navigation never writes training data or recreates entry fields. */
(() => {
 'use strict';
 const phases={warmup:'Warm-up',main:'Main workout',cooldown:'Cooldown'};
 const withheld={
  'box-jumps':'The source shows a jump-down return; the guide uses a step-down. Exact return needs confirmation.',
  'leg-raise':'The source uses a neutral grip; your prescribed grip and range need confirmation.',
  'side-plank':'Straight-leg or bent-knee support has not been confirmed.',
  'burpee':'The required floor, push-up and jump components have not been confirmed.',
  'lunge':'The source alternates sides; your prescribed side order and loading need confirmation.',
  'pushup':'Toe, knee or incline support needs confirmation.'
 };
 function reference(e){
  const id=e.sourceExerciseId||e.id,g=window.FormGuides?.[id];
  // A renamed/customised movement must not silently inherit a different demonstration.
  const original=base.find(item=>item.id===id);
  const changed=original&&e.name!==original.name;
  return {g,reason:changed?'This movement has been renamed. Its exact variation needs review.':withheld[id]||(!g?'No reviewed exact-variation demonstration is available.':'')};
 }
 function video(e){
  const {g,reason}=reference(e);
  if(reason)return '<p class="notice video-pending"><strong>Video pending verification</strong><br>'+esc(reason)+'</p>';
  if(g.video?.type==='external')return '<div class="video-reference video-external"><a class="primary" data-video-link href="'+esc(g.source)+'" target="_blank" rel="noopener noreferrer">Watch single-arm instructional video ↗</a><p class="tiny muted">Standing · one dumbbell · one arm at a time. Movement and publisher playback checked 26 October 2026. Opens the publisher’s page because it blocks playback inside other sites.</p></div>';
  return '<div class="video-reference"><p class="tiny">'+esc(g.variant)+' · '+esc(g.publisher)+'</p><div class="video-player" data-video-exercise="'+esc(e.sourceExerciseId||e.id)+'"><button type="button" class="primary" data-play-video>Play demonstration</button></div><p class="tiny muted" data-video-status aria-live="polite">Reviewed movement reference · '+(e.id==='tricep-extension'?'single-arm source checked 26 October 2026':'playback checked 17 October 2026')+'. Loads from '+esc(g.publisher)+' only when you press Play. Individual setup and range remain as prescribed.</p><a data-video-link href="'+esc(g.source)+'" target="_blank" rel="noopener noreferrer">Open verified movement source ↗</a></div>';
 }
 function guide(e){
  const {g,reason}=reference(e);
  return '<div class="player-content"><p class="player-instruction notice">Review the movement below, follow your prescribed targets, then enter your actual reps or seconds and load. Confirm each set only after completing it.</p><div class="player-visual">'+movementArt(e,true)+'</div><p class="tiny muted">'+esc(g?.variant||'No reviewed image for this movement')+(reason?' · Example variation; individual setup unconfirmed.':' · Movement illustration; follow your prescribed setup.')+'</p>'+video(e)+(g?'<details class="player-technique"><summary>Step-by-step technique</summary><ol class="guide-steps">'+g.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><p class="guide-cue">'+esc(g.cue)+'</p>'+(g.note?'<p class="notice">'+esc(g.note)+'</p>':'')+'<p class="tiny muted">General reference. Your saved clinician instructions take priority.</p></details>':'<p class="muted">Technique instructions have not been supplied.</p>')+'</div>';
 }
 function settings(plan){const p=plan.routine.player;return p&&typeof p==='object'&&!Array.isArray(p)?p:{}}
 function phase(plan,id){const value=settings(plan).phases?.[id];return Object.hasOwn(phases,value)?value:'main'}
 function exerciseSequence(plan){const ids=plan.routine.ids;return [{id:'@warmup',name:'Warm-up instructions',phase:'warmup'},...ids.filter(id=>phase(plan,id)==='warmup').map(id=>({id,name:plan.exercises.find(e=>e.id===id)?.name||id,phase:'warmup'})),...ids.filter(id=>phase(plan,id)==='main').map(id=>({id,name:plan.exercises.find(e=>e.id===id)?.name||id,phase:'main'})),...ids.filter(id=>phase(plan,id)==='cooldown').map(id=>({id,name:plan.exercises.find(e=>e.id===id)?.name||id,phase:'cooldown'})),{id:'@cooldown',name:'Cooldown instructions',phase:'cooldown'}]}
 function preparationCount(plan,id){const n=settings(plan).preparation?.[id];return Number.isInteger(n)&&n>=0&&n<=100?n:0}
 function roundCount(plan,id){const n=settings(plan).rounds?.[groupName(plan,id)];return Number.isInteger(n)&&n>0&&n<=100?n:0}
 function sequence(plan,targetEdits={}){
  if(!plan)return [];
  plan={...plan,exercises:plan.exercises.map(e=>({...e,...targetEdits?.[e.id]}))};
  const result=[],seen=new Set(),used=new Set();
  const add=(step,index,label)=>{const first=!used.has(step.id);used.add(step.id);result.push({...step,id:first?step.id:step.id+'::'+index,exerciseId:step.id,setIndex:index,name:step.name+' — '+label})};
  for(const step of exerciseSequence(plan)){
   if(seen.has(step.id))continue;
   const members=groupMembers(plan,step.id),rounds=roundCount(plan,step.id);
   if(members.length>1&&rounds&&members.every(m=>plan.exercises.find(e=>e.id===m.id)?.sets>=preparationCount(plan,m.id)+rounds)){
    for(const member of members){seen.add(member.id);const prep=preparationCount(plan,member.id);for(let i=0;i<prep;i++)add(member,i,'preparation '+(i+1)+' of '+prep+' · load as prescribed')}
    for(let round=0;round<rounds;round++)for(const member of members)add(member,preparationCount(plan,member.id)+round,'group '+groupName(plan,member.id)+' · round '+(round+1)+' of '+rounds);
    for(const member of members){const count=plan.exercises.find(e=>e.id===member.id).sets;for(let i=preparationCount(plan,member.id)+rounds;i<count;i++)add(member,i,'additional target set '+(i+1))}
   }else result.push({...step,exerciseId:step.id});
  }
  return result;
 }
 function strengthTemplate(plan){return plan.routine.ids.includes('back-squat')&&['push-press','box-jumps','tricep-extension','leg-raise'].every(id=>plan.routine.ids.includes(id))&&data.exercises.some(e=>e.id==='deadbug')}
 function groupName(plan,id){const name=settings(plan).groups?.[id];return typeof name==='string'?name.trim():''}
 function groupMembers(plan,id){const name=groupName(plan,id);return name?exerciseSequence(plan).filter(step=>!step.id.startsWith('@')&&groupName(plan,step.id)===name&&step.phase===phase(plan,id)):[]}
 function orderGuide(plan,id){const steps=sequence(plan),index=steps.findIndex(step=>step.id===id),members=groupMembers(plan,id),position=members.findIndex(step=>step.id===id);return '<div class="player-order notice"><p data-active-set-label class="active-set-label"></p><strong>Exercise order '+(exerciseSequence(plan).findIndex(step=>step.id===id)+1)+(members.length>1?' · '+(members.length===2?'Superset':'Circuit')+' '+esc(groupName(plan,id))+' · '+(position+1)+' of '+members.length:'')+'</strong>'+(members.length>1?'<p>One round: '+members.map(step=>esc(step.name)).join(' → ')+'. Record and confirm each exercise’s actual set separately.</p><p>'+ (roundCount(plan,id)?roundCount(plan,id)+' working rounds. '+(preparationCount(plan,id)?preparationCount(plan,id)+' preparation sets come first; their loads are unspecified. ':''):'')+esc(typeof settings(plan).groupInstructions==='string'&&settings(plan).groupInstructions||(roundCount(plan,id)?'Rest between grouped exercises and rounds is not specified. Existing exercise rest targets are retained.':'Round count and between-exercise rest have not been supplied. Follow your original prescription; do not infer them from the card order.'))+'</p>'+(roundCount(plan,id)?'<p>Next exercise and swipe right advance through the planned preparation sets and alternating working rounds. Each step shows its own set entry; moving never confirms it.</p>':'<button class="secondary" data-player-jump="'+esc(members[(position+1)%members.length].id)+'">'+(position===members.length-1?'Return to first exercise in group':'Next exercise in group')+' →</button><p class="tiny">Use Next exercise below to leave the group when its prescribed rounds are finished. Navigation does not confirm a round or set.</p>'):settings(plan).standalone?.[id]===true?'<p>Individual exercise: complete its prescribed sets, using the saved rest between sets, before moving to the next group.</p>':'<p>No superset or circuit is assigned to this exercise. Its '+esc(plan.exercises.find(e=>e.id===id)?.sets??'')+' set rows belong to this exercise only. Confirm the original grouping before treating this as straight sets.</p>')+'</div>'}
 function phaseCard(plan,which){const value=settings(plan)[which];const text=typeof value==='string'?value:'';return '<section class="workout-ex player-phase" data-player-step="@'+which+'"><div class="eyebrow">'+phases[which]+'</div><h3>'+phases[which]+' instructions</h3><p class="tiny">Step '+(which==='warmup'?1:sequence(plan).length)+' of '+sequence(plan).length+'</p><p class="phase-instructions">'+esc(text||'Not supplied in the available physiotherapy source. Follow your existing clinician instructions; no routine has been invented.')+'</p><p class="tiny muted">Viewing this step does not record completion.</p></section>'}
 let touch=null;
 const interactive='input,select,textarea,button,a,summary,video,iframe,[contenteditable]';
 document.addEventListener('touchstart',event=>{
  const surface=event.target.closest('[data-player-step]');
  touch=surface&&workoutFocus.enabled&&!event.target.closest(interactive)&&event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY,surface,time:Date.now()}:null;
 },{passive:true});
 document.addEventListener('touchmove',event=>{if(event.touches.length!==1)touch=null},{passive:true});
 document.addEventListener('touchcancel',()=>{touch=null},{passive:true});
 document.addEventListener('touchend',event=>{
  const start=touch;touch=null;if(!start||!start.surface.isConnected||event.changedTouches.length!==1||Date.now()-start.time>900)return;
  const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;
  if(Math.abs(dx)>=60&&Math.abs(dx)>Math.abs(dy)*1.6)stepWorkoutExercise(dx>0?1:-1);
 },{passive:true});
 document.addEventListener('keydown',event=>{
  if(!workoutFocus.enabled||!event.target.closest('[data-player-step]')||event.target.closest(interactive)||event.altKey||event.ctrlKey||event.metaKey)return;
  if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();stepWorkoutExercise(event.key==='ArrowRight'?1:-1)}
 });
 function intro(plan){return overview(plan)+ '<section class="player-start panel"><div class="eyebrow">'+esc(activeProfile)+' · '+esc(plan.routine.name)+'</div><h2>Start here: warm-up</h2><p>1. Read your warm-up instructions. 2. Work through each exercise with its images and technique. 3. Review your cooldown.</p><p class="tiny muted">Enter what you actually did, then confirm each completed set. Moving to another exercise does not complete it.</p><button class="primary" data-player-jump="@warmup">Start with warm-up →</button></section>'}
 function overview(plan){return '<section class="workout-overview" hidden><div class="row between"><div><div class="eyebrow">Your workout</div><h2>'+esc(plan.routine.name)+'</h2></div><button class="ghost" data-action-click="navigate(\'Calendar\')">← Calendar</button></div><p>Choose a section to see the movement, instructions and set entries.</p><p class="tiny muted">Planned targets only; opening a section does not record completion. Read the numbered cards in order. A set is one bout of one exercise; a superset or circuit groups exercises into repeated rounds. Groupings remain provisional until supplied.</p><button class="ghost" data-edit-sequence>Edit future sequence &amp; groups</button>'+(strengthTemplate(plan)?'<button class="ghost" data-strength-sequence>Review supplied strength grouping</button>':'')+''+Object.entries(phases).map(([phaseId,title])=>'<section class="overview-phase"><h3>'+title+'</h3><div class="overview-grid">'+exerciseSequence(plan).filter(step=>step.phase===phaseId).map(step=>{const original=plan.exercises.find(e=>e.id===step.id),log=activeLog(),change=log?.changes?.[step.id],e=original?{...original,...log?.targetEdits?.[step.id]}:null,text=e?e.sets+' sets · '+e.reps+' '+(e.kind==='seconds'?'seconds':'reps'):(settings(plan)[phaseId]?'View supplied instructions':'Instructions not supplied');return '<button class="overview-card" data-player-jump="'+esc(step.id)+'">'+(e?'<span class="overview-art">'+movementArt(e,true)+'</span>':'<span class="overview-marker">'+String(exerciseSequence(plan).findIndex(item=>item.id===step.id)+1).padStart(2,'0')+'</span>')+'<span><small class="order-number">STEP '+(exerciseSequence(plan).findIndex(item=>item.id===step.id)+1)+(groupMembers(plan,step.id).length>1?' · '+(groupMembers(plan,step.id).length===2?'Superset ':'Circuit ')+esc(groupName(plan,step.id)):settings(plan).standalone?.[step.id]===true?' · Individual':'')+'</small><strong>'+esc(step.name)+'</strong><small>'+esc(text)+'</small>'+(e&&preparationCount(plan,step.id)?'<small>'+preparationCount(plan,step.id)+' preparation sets + '+roundCount(plan,step.id)+' working sets</small>':'')+(e&&roundCount(plan,step.id)?'<small>'+roundCount(plan,step.id)+' alternating rounds</small>':'')+(change?'<small>'+esc(change.status==='skipped'?'Remaining sets skipped':'Substitute: '+change.replacement.name)+'</small>':'')+'<small>Open details →</small></span></button>'}).join('')+'</div></section>').join('')+'</section>'}
 function empty(plan){return '<section class="panel empty-workout"><div class="eyebrow">'+esc(activeProfile)+' · '+esc(plan.routine.name)+'</div><h2>No exercises in this workout yet</h2><p>This is an empty workout template for '+esc(activeProfile)+'. There are no prescribed exercises to demonstrate or sets to record.</p><p><strong>Next:</strong> check the profile at the top. For this profile, open the exercise library to edit the workout prescriptions, or import your supplied workout.</p><div class="row"><button class="primary" data-action-click="navigate(\'Exercises\')">Open exercise library</button><button class="secondary" data-action-click="importWorkout()">Import supplied workout</button></div><h3>Warm-up and cooldown</h3><p>Only use supplied clinician instructions. Empty phases do not mean that preparation or cooldown should be skipped.</p>'+phaseCard(plan,'warmup')+phaseCard(plan,'cooldown')+'</section>'}
 document.addEventListener('click',event=>{if(event.target.closest('[data-show-overview]')){workoutFocus.enabled=false;workoutFocus.overview=true;applyWorkoutFocus();document.querySelector('.workout-overview')?.scrollIntoView({block:'start'});}const button=event.target.closest('[data-player-jump]');if(button)jumpWorkoutExercise(button.dataset.playerJump)});
 window.FormPlayer={phases,reference,video,guide,settings,phase,sequence,phaseCard,intro,empty,groupName,groupMembers,orderGuide,exerciseSequence,preparationCount,roundCount};
})();
