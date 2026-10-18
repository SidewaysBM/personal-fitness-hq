const {chromium,webkit,devices}=require('playwright'),fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const server=http.createServer((req,res)=>{const path=new URL(req.url,'http://localhost').pathname.replace(/^\/personal-fitness-hq\//,''),file=path||'index.html';if(!/^(index\.html|sw\.js|manifest\.webmanifest|assets\/(?:exercise-images\/)?[a-z0-9-]+\.(js|css|png|webp))$/.test(file)||!fs.existsSync(file)){res.statusCode=404;return res.end()}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':file.endsWith('.png')?'image/png':file.endsWith('.webmanifest')?'application/manifest+json':'text/html');res.end(fs.readFileSync(file))});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/personal-fitness-hq/`;
for(const [name,engine,launch,device] of [['desktop',chromium,{channel:'chrome'},{viewport:{width:1440,height:1000}}],['iphone',webkit,{},devices['iPhone 13']],['small-iphone',webkit,{},devices['iPhone SE']]]){
const browser=await engine.launch(launch),context=await browser.newContext({...device,serviceWorkers:name==='desktop'?'allow':'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('dialog',d=>d.accept());await page.clock.setFixedTime(new Date('2026-10-27T12:00:00+11:00'));await page.goto(url);
const nav=page.locator(device.isMobile?'#mobileNav':'#desktopNav'),go=async n=>{await nav.getByRole('button',{name:n}).click();if(n==='Progress')await page.getByRole('button',{name:'All reports',exact:true}).click()};

// Additional-only days must be reachable without creating a primary session.
await page.evaluate(()=>{selected='2026-10-18';data.overrides[selected]=null;const reference={...data,logs:{},overrides:{...data.overrides,[selected]:'A'}};data.extraSessions=[{id:'extra-audit',date:selected,log:{date:selected,sets:[],plan:FormProgram.plan(reference,'Ben',selected)}}];save();render()});
const before=await page.evaluate(()=>localStorage.getItem(KEY));
assert.match(await page.locator('.hero h2').innerText(),/Strength/);
assert.equal(await page.locator('[aria-label="Selected day sessions"] button').count(),1);
assert(!await page.locator('.week').innerText().then(t=>t.includes('extra-audit')));
await page.locator('.hero [data-dashboard-session]').click();
assert.equal(await page.getByLabel('Session on this date').inputValue(),'extra-audit');
assert.equal(await page.evaluate(()=>localStorage.getItem(KEY)),before);
await page.getByLabel('Workout date').fill('');await page.getByLabel('Workout date').blur();
assert.equal(await page.getByLabel('Workout date').inputValue(),'2026-10-18');
assert.equal(await page.evaluate(()=>activeSessionId),'extra-audit');
// An elapsed timer must be cleared even when its workout display is absent.
await page.getByRole('button',{name:'1m rest',exact:true}).click();await go('Dashboard');
await page.evaluate(()=>{timerUntil=Date.now()-1000;updateTimer()});assert.equal(await page.evaluate(()=>timerInterval),null);
await page.locator('.hero [data-dashboard-session]').click();
await page.locator('#rep-back-squat-0').fill('3');await page.locator('#check-back-squat-0').click();
await page.getByRole('button',{name:'1m rest',exact:true}).click();await go('Progress');await page.locator('.history-row').click();assert.equal(await page.evaluate(()=>timerInterval),null);
// An open edit must never save into another session or profile.
await page.getByRole('button',{name:'Edit session notes'}).click();let dialog=page.getByRole('dialog');await dialog.locator('textarea').fill('Do not redirect');
const unchanged=await page.evaluate(()=>JSON.stringify(data));await page.evaluate(()=>{activeSessionId='';render()});await dialog.getByRole('button',{name:'Save',exact:true}).click();assert.match(await dialog.locator('[role=alert]').innerText(),/Session changed/);assert.equal(await page.evaluate(()=>JSON.stringify(data)),unchanged);await dialog.getByRole('button',{name:'Cancel'}).click();
for(const open of ['editProgram(\'A\')','editSchedule()','recordActivity()','addExercise()','addDaySession()','changeSessionExercise(\'back-squat\')']){
 await page.evaluate(()=>{switchProfile('Ben');selected='2026-10-19';activeSessionId='';view='Workout';render()});
 await page.evaluate(source=>eval(source),open);dialog=page.getByRole('dialog');
 if(open==='recordActivity()')await dialog.locator('[name=minutes]').fill('20');
 if(open==='addExercise()'){await dialog.locator('#customName').fill('Audit movement');await dialog.locator('#customSets').fill('1');await dialog.locator('#customReps').fill('4')}
 await page.evaluate(()=>switchProfile('Georgie'));const georgie=await page.evaluate(()=>JSON.stringify(data));
 await dialog.locator('form').evaluate(f=>f.requestSubmit());
 assert.match(await dialog.locator('[role=alert],#customError').innerText(),/Profile changed/);
 assert.equal(await page.evaluate(()=>JSON.stringify(data)),georgie);await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
}
await page.evaluate(()=>{switchProfile('Ben');selected='2026-10-18';activeSessionId='';view='Dashboard';render()});await page.screenshot({path:`test-results/${name}-dashboard-audit.png`});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
// Library instructions can change without rewriting recorded session references.
await page.evaluate(()=>{selected='2026-10-19';activeSessionId='';FormProgram.record(data,'Ben',selected);save()});const snapshots=await page.evaluate(()=>JSON.stringify(data.logs));await go('Exercises');await page.locator('[data-guide="back-squat"]').click();await page.getByRole('button',{name:'Edit my instructions'}).click();dialog=page.getByRole('dialog');await dialog.locator('[name=instructions]').fill('My supplied setup instruction');await dialog.locator('[name=equipment]').fill('Barbell');await dialog.getByRole('button',{name:'Save',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.stringify(data.logs)),snapshots);await page.locator('[data-guide="back-squat"]').click();assert.match(await page.getByRole('dialog').innerText(),/My supplied setup instruction/);await page.getByLabel('Close exercise guide').click();
// An explicit personal increment can fill a review draft, never approve it.
await page.evaluate(()=>{data.routines[0].prescriptions={'back-squat':{sets:2,reps:5,rest:90,weights:[20,25],kind:'strength'}};for(const date of ['2026-10-24','2026-10-26']){data.overrides[date]='A';FormProgram.record(data,'Ben',date).sets=[20,25].map((weight,index)=>({exerciseId:'back-squat',index,reps:5,weight,confirmed:true}))}save()});const beforeCalculation=await page.evaluate(()=>JSON.stringify(data));await go('Progress');await page.getByRole('button',{name:'Create target review',exact:true}).click();dialog=page.getByRole('dialog');await dialog.getByText('Calculate from my chosen increment',{exact:true}).click();assert.equal(await dialog.locator('[name=increment]').inputValue(),'');await dialog.locator('[name=incrementMetric]').selectOption('load');await dialog.locator('[name=increment]').fill('2.5');await dialog.getByRole('button',{name:'Calculate draft target'}).click();assert.equal(await dialog.locator('[name=weights]').inputValue(),'22.5, 27.5');assert.equal(await dialog.locator('[name=target]').inputValue(),'5');assert.equal(await page.evaluate(()=>JSON.stringify(data)),beforeCalculation);await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
assert.deepEqual(errors,[]);console.log(`PASS ${name}: extra-session dashboard routing, invalid date retention, timer cleanup, stale profile/session edit rejection`);await browser.close()}
server.close()})().catch(e=>{console.error(e);server.close();process.exit(1)});
