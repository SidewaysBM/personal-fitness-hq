// Synthetic prescriptions only. Private screenshot transcriptions do not belong in source control.
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http');
const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!/^(index.html|manifest.webmanifest|assets\/[a-z0-9/-]+\.(js|css|png|webp))$/.test(name)||!fs.existsSync(name)){res.writeHead(404).end();return;}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.png')?'image/png':name.endsWith('.webmanifest')?'application/manifest+json':'text/html');res.end(fs.readFileSync(name));});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 for(const [name,engine,launch,options] of [['desktop',chromium,{channel:'chrome'},{viewport:{width:1440,height:1000}}],['iphone',webkit,{},devices['iPhone 13']]]){
 const b=await engine.launch(launch);try{
 const p=await b.newPage({...options,serviceWorkers:'block'}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());
 await p.goto(`http://127.0.0.1:${server.address().port}/`);
 await p.getByLabel('Active profile').selectOption('Georgie');
 const beforeBen=await p.evaluate(()=>localStorage.getItem('form-fitness-v02'));
 await p.evaluate(()=>{const next=structuredClone(data);next.exercises[0]={...next.exercises[0],sets:2,reps:6,rest:null,instructions:'Source preparation preserved.'};next.routines[0].ids=[next.exercises[0].id];next.overrides['2026-10-19']=next.routines[0].id;FormStore.validate(next);store.write(next);data=structuredClone(store.value);render()});
 await p.reload();const nav=p.locator(options.isMobile?'#mobileNav':'#desktopNav');await nav.getByRole('button',{name:'Workout'}).click();await p.getByLabel('Workout date').fill('2026-10-19');await p.getByLabel('Workout date').blur();
 const movement=p.locator('[data-session-exercise="back-squat"]');assert.match(await movement.innerText(),/Rest not supplied/);assert.match(await movement.innerText(),/Source preparation preserved/);assert.equal(await movement.locator('[data-action-click^="startTimer"]').count(),0);
 await p.locator('#check-back-squat-0').click();assert.equal(await p.locator('#timerDisplay').innerText(),'00:00');
 assert.equal(await p.evaluate(()=>data.logs['2026-10-19'].plan.exercises[0].rest),null);
 await p.reload();assert.equal(await p.evaluate(()=>data.logs['2026-10-19'].sets[0].confirmed),true);assert.equal(await p.evaluate(()=>localStorage.getItem('form-fitness-v02')),beforeBen);
 await nav.getByRole('button',{name:'Exercises'}).click();await p.locator('[data-edit-program="A"]').click();assert.equal(await p.getByRole('dialog').locator('[data-exercise="back-squat"] [name=rest]').inputValue(),'');await p.getByRole('dialog').locator('[data-exercise="back-squat"] [name=rest]').fill('45');await p.getByRole('button',{name:'Save changes',exact:true}).click();
 assert.equal(await p.evaluate(()=>data.routines[0].prescriptions['back-squat'].rest),45);assert.equal(await p.evaluate(()=>data.logs['2026-10-19'].plan.exercises[0].rest),null);
 assert.deepEqual(errors,[]);console.log('PASS',name,'unknown rest, recording, reload, target editing, frozen history, profile isolation');
 }finally{await b.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
