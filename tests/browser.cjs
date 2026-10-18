const { chromium, webkit, devices } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const http = require('node:http');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
fs.mkdirSync('test-results',{recursive:true});
const oldHtml=require('node:child_process').execFileSync('git',['show','25f4cc6:index.html'],{encoding:'utf8'});
const initialFrom=source=>vm.runInNewContext(source.slice(source.indexOf('const base='),source.indexOf(';let data;'))+';JSON.stringify(initial())');
assert.equal(initialFrom(html),initialFrom(oldHtml),'Saved-data schema and original prescriptions must remain unchanged');

new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
for(const file of ['assets/vendor-sax.js','assets/vendor-fflate.js','assets/calendar.js','assets/calendar-ui.js','assets/exercise-preferences.js','assets/training-tools.js','assets/progression-rules.js','assets/period-plans.js','assets/period-ui.js','assets/training-ui.js','assets/offline.js','assets/session-changes.js','assets/program.js','assets/program-editor.js','assets/health-import.js','assets/health-history.js','assets/workout-ocr.js','assets/workout-import.js','assets/activities.js','assets/coaching.js','assets/data-store.js','assets/exercise-guides.js','assets/exercise-art.js','assets/exercise-videos.js'])new vm.Script(fs.readFileSync(file,'utf8'));
const server = http.createServer((req,res)=>{if(req.url.endsWith('manifest.webmanifest')){res.setHeader('Content-Type','application/manifest+json');res.end(fs.readFileSync('manifest.webmanifest'));return}
 const relative=new URL(req.url,'http://localhost').pathname.replace(/^\/personal-fitness-hq\//,'');
 if(['assets/exercise-images/single-leg-squat-isometric-v1.png','assets/exercise-images/single-leg-squat-female-isometric-v1.png'].includes(relative)){res.setHeader('Content-Type','image/png');res.end(fs.readFileSync(relative));return}
 if(relative.startsWith('assets/')&&/^assets\/(?:exercise-images\/)?[a-z0-9-]+\.(js|css|png)$/.test(relative)&&fs.existsSync(relative)){
  res.setHeader('Content-Type',relative.endsWith('.js')?'text/javascript':'text/css');res.end(fs.readFileSync(relative));
 }else if(relative===''||relative==='original'){res.setHeader('Content-Type','text/html');res.end(html)}
 else {res.statusCode=404;res.end('Not found')}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url=`http://127.0.0.1:${server.address().port}/personal-fitness-hq/`;
 for (const [name,engine,launch,device] of [
  ['mac-chrome',chromium,{channel:'chrome'},{viewport:{width:1440,height:1000}}],
  ['iphone-webkit',webkit,{},devices['iPhone 13']],
  ['small-iphone-webkit',webkit,{}, {...devices['iPhone SE'],viewport:{width:375,height:667}}]
 ]) {
 const browser=await engine.launch(launch);const context=await browser.newContext({serviceWorkers: 'block',...device,acceptDownloads:true});const page=await context.newPage();
 // Stub external media for deterministic interaction tests; live playback has a separate check.
 await context.route('https://**/*',r=>{if(r.request().resourceType()==='document')return r.fulfill({contentType:'text/html',body:'<title>Embedded player fixture</title>'});});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/^Button failed to load, iconName = (invalid|pip|airplay)-placard, layoutTraits = \[MacOSLayoutTraits Inline\], src = blob:/.test(m.text()))errors.push(m.text())});page.on('dialog',d=>d.accept());
 if(name==='mac-chrome'){
  await page.route('**/original',r=>r.fulfill({contentType:'text/html',body:require('node:child_process').execFileSync('git',['show','2ddb3c79cbc78a12497ef666976d4f65cad0faa1:index.html'],{encoding:'utf8'})}));
  await page.goto(url+'original');assert(errors.some(e=>/top/.test(e)));assert.equal(await page.locator('#app').innerText(),'');console.log('Original Chrome startup failure reproduced:',errors.join('; ')); errors.length=0;
 }
 await page.goto(url);await page.getByRole('heading',{name:'Build what lasts.'}).waitFor();
 assert.equal(await page.evaluate(()=>window.top===window),true);
 const nav=page.locator(device.isMobile?'#mobileNav':'#desktopNav');
 for(const [tab,title] of [['Calendar','Training calendar'],['Workout','Workout studio'],['Exercises','Exercise library'],['Progress','Progress & insights'],['Settings','Your settings'],['Dashboard','Build what lasts.']]){
  await nav.getByRole('button',{name:tab,exact:false}).click();await page.getByRole('heading',{name:title,exact:true}).waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name}: overflow ${tab}`);
 }
 await page.screenshot({path:`test-results/${name}-dashboard.png`,fullPage:true});

 // Every guide must be reachable through actual UI, with distinct SVG poses and no storage writes.
 await nav.getByRole('button',{name:'Exercises',exact:false}).click();
 const beforeGuides=await page.evaluate(()=>localStorage.getItem('form-fitness-v02'));
 const guideButtons=page.locator('#app [data-guide]');assert.equal(await guideButtons.count(),16);
 const arts=new Set();
 for(let i=0;i<16;i++){
  const button=guideButtons.nth(i);const name=await button.getAttribute('aria-label');
  await button.click();const dialog=page.getByRole('dialog');await dialog.waitFor();
  assert.equal(await dialog.locator('.guide-steps li').count(),4,name);
  // Count movement frames, not nested transforms used for hands and footwear.
  assert.equal(await dialog.locator('svg > g[transform]').count(),2,name);
  arts.add(await dialog.locator('svg').innerHTML());
  for(const image of await dialog.locator('svg image').all()){
    const href=await image.getAttribute('href');
    await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();if(img.naturalWidth<1000)throw Error('Reference image too small')},href);
  }
  const link=dialog.locator('[data-video-link]');assert.match(await link.getAttribute('href'),/^https:\/\//);
  assert.equal(await link.getAttribute('rel'),'noopener noreferrer');assert.equal(await dialog.locator('iframe,video').count(),0);
  assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth),`${name}: dialog overflow`);
  const initialUrl=page.url();
  await dialog.getByRole('button',{name:'Play demonstration',exact:true}).click();
  assert.equal(await dialog.locator('iframe,video').count(),1);
  const player=dialog.locator('iframe,video');
  assert.match(await player.getAttribute('src'),/^https:\/\//);
  assert.equal(page.url(),initialUrl);assert.equal(context.pages().length,1);
  if(await dialog.locator('video').count())assert.equal(await player.getAttribute('playsinline'),'');
  assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth));
  if(i===0){
   assert.equal(await page.getByRole('dialog').count(),1);await page.getByRole('button',{name:'Close exercise guide'}).focus();
   await page.screenshot({path:`test-results/${name.replace(/[^a-z]/gi,'')}-${device.isMobile?'mobile':'desktop'}-guide.png`,fullPage:true});
   await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY');
   await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'Close exercise guide'}).evaluate(e=>e===document.activeElement),true);}
  await page.getByRole('button',{name:'Close exercise guide'}).click();assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.locator('iframe,video').count(),0);
  assert.equal(await button.evaluate(e=>e===document.activeElement),true);
 }
 await guideButtons.first().click();await context.setOffline(true);
 await page.getByRole('button',{name:'Play demonstration',exact:true}).click();
 assert.match(await page.locator('[data-video-status]').innerText(),/offline/);assert.equal(await page.locator('iframe,video').count(),0);
 await context.setOffline(false);await page.keyboard.press('Escape');
 assert.equal(arts.size,16);assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),beforeGuides);
 await page.screenshot({path:`test-results/${name}-library.png`,fullPage:true});
 await nav.getByRole('button',{name:'Workout'}).click();await page.getByLabel('Workout date').fill('2026-10-19');await page.getByLabel('Workout date').blur();
 await page.locator('#rep-back-squat-0').waitFor();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02'))?.logs||{}).then(v=>Object.keys(v).length),0);
 await page.locator('#rep-back-squat-0').fill('4');
 await page.locator('[data-guide="back-squat"]').click();await page.getByRole('button',{name:'Close exercise guide'}).click();assert.equal(await page.locator('#rep-back-squat-0').inputValue(),'4');
await page.locator('#wt-back-squat-0').fill('35');await page.locator('#check-back-squat-0').click();
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02')));assert.equal(saved.logs['2026-10-19'].sets[0].confirmed,true);assert.equal(await page.locator('#sessionCount').innerText(),'1 verified sets recorded');assert.equal(saved.logs['2026-10-19'].sets[0].reps,4);
 await page.reload();await nav.getByRole('button',{name:'Workout'}).click();await page.getByLabel('Workout date').fill('2026-10-19');await page.getByLabel('Workout date').blur();
 assert.equal(await page.locator('#rep-back-squat-0').inputValue(),'4');assert(await page.locator('#check-back-squat-0').evaluate(e=>e.classList.contains('checked')));
 await page.locator('#rep-back-squat-0').fill('5');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02')).logs['2026-10-19'].sets[0].confirmed),false);
 await page.locator('#check-back-squat-0').click();await page.getByRole('button',{name:'1m rest',exact:true}).click();assert.match(await page.locator('#timerDisplay').innerText(),/^0[01]:\d\d$/);await page.getByRole('button',{name:'Stop',exact:true}).click();assert.equal(await page.locator('#timerDisplay').innerText(),'00:00');
 await page.screenshot({path:`test-results/${name}-workout.png`,fullPage:true});
 await page.getByRole('button',{name:'Finish session'}).click();await page.getByRole('heading',{name:'Build what lasts.'}).waitFor();
 await nav.getByRole('button',{name:'Settings'}).click();
 let dl=page.waitForEvent('download');await page.getByRole('button',{name:'Backup JSON'}).click();const download=await dl;const backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 assert.equal(backup.logs['2026-10-19'].sets[0].reps,5);assert.equal(backup.version,2);
 let csvEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Export sets CSV'}).click();const csvDownload=await csvEvent;const csv=fs.readFileSync(await csvDownload.path(),'utf8');assert.match(csv,/2026-10-19/);assert.match(csv,/"5","35","true"/);
 await page.locator('#age').fill('43');await page.getByRole('button',{name:'Save profile'}).click();assert.equal(await page.locator('#age').inputValue(),'43');
 await page.locator('input[type=file]').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.waitForFunction(()=>document.querySelector('#age')?.value==='42');assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02'))),backup);
 await page.reload();assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02'))),backup);
 assert.deepEqual(errors,[]);console.log(`PASS ${name}: startup, six views, no horizontal overflow, set confirmation/correction, reload persistence, timer, finish, backup download and restore; no console errors`);

 // Existing version-2 records, edited prescriptions, custom movements and unknown fields survive display-only upgrades byte for byte.
 const legacy=JSON.parse(initialFrom(oldHtml));legacy.profile.age=47;legacy.restrictions='Keep my clinician notes <private>';
 legacy.exercises[0].reps=7;legacy.exercises[0].weights=[12,13,14,15,16];legacy.notes='Private synthetic note';
 legacy.exercises.push({id:'custom-existing',name:'My custom exercise',group:'Custom',sets:1,reps:4,weights:[],rest:60,kind:'reps'});
 legacy.logs['2026-10-14']={date:'2026-10-14',sets:[{exerciseId:'back-squat',index:0,reps:5,weight:35,confirmed:true,updatedAt:'2026-10-14T00:00:00Z'},{exerciseId:'deadbug',index:0,reps:18,weight:null,confirmed:false}],finishedAt:'2026-10-14T01:00:00Z'};
 legacy.measurements=[{date:'2026-10-14',weight:94,waist:91}];legacy.overrides['2026-10-16']='A';legacy.futureMetadata={retain:true};
 const raw=JSON.stringify(legacy);await page.evaluate(raw=>localStorage.setItem('form-fitness-v02',raw),raw);await page.reload();
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),raw);
 await nav.getByRole('button',{name:'Exercises'}).click();await page.locator('[data-guide="back-squat"]').click();
 assert.match(await page.getByRole('dialog').innerText(),/Keep my clinician notes <private>/);
 await page.locator('.prescription summary').click();assert.match(await page.locator('.prescription').innerText(),/12 kg/);
 await page.getByRole('button',{name:'Close exercise guide'}).click();
 await page.locator('[data-guide="custom-existing"]').click();assert.match(await page.getByRole('dialog').innerText(),/No reviewed technique guide/);assert.equal(await page.locator('[data-video-link]').count(),0);await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),raw);
 // Draft actuals survive navigation and reload without contributing to totals.
 await nav.getByRole('button',{name:'Workout'}).click();await page.getByLabel('Workout date').fill('2026-10-19');await page.getByLabel('Workout date').blur();
 await page.locator('#rep-back-squat-0').fill('9');await page.locator('#wt-back-squat-0').fill('44');
 await page.reload();await nav.getByRole('button',{name:'Workout'}).click();await page.getByLabel('Workout date').fill('2026-10-19');await page.getByLabel('Workout date').blur();
 assert.equal(await page.locator('#rep-back-squat-0').inputValue(),'9');assert.equal(await page.locator('#wt-back-squat-0').inputValue(),'44');
 assert.equal(await page.locator('#sessionCount').innerText(),'0 verified sets recorded');
 await page.locator('#check-back-squat-0').click();await page.locator('#rep-back-squat-0').fill('-1');assert.equal(await page.locator('#sessionCount').innerText(),'0 verified sets recorded');await page.locator('#rep-back-squat-0').fill('');await page.locator('#check-back-squat-0').click();
 assert.equal(await page.locator('#sessionCount').innerText(),'0 verified sets recorded');
 await nav.getByRole('button',{name:'Settings'}).click();
 const beforeBad=await page.evaluate(()=>localStorage.getItem('form-fitness-v02'));
 for(const invalid of [{...backup,logs:null},{...backup,measurements:null},{...backup,version:99},{...backup,logs:{'2026-10-19':{date:'2026-10-19',sets:[{exerciseId:'back-squat',index:0,reps:5,weight:20,confirmed:'true'}]}}}]){
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
 await page.waitForFunction(()=>document.querySelector('input[type=file]').value==='');
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),beforeBad);
 }
 // A failed storage write must not show a confirmed set or success message.
 await page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Synthetic quota limit','QuotaExceededError')}});
 await page.locator('#age').fill('55');await page.getByRole('button',{name:'Save profile'}).click();
 assert.equal(await page.locator('#age').inputValue(),'47');assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),beforeBad);
 await page.evaluate(()=>Storage.prototype.setItem=window.originalSetItem);
 // Corrupt stored bytes remain intact and are downloadable; recovery restore is explicit.
 await page.evaluate(()=>localStorage.setItem('form-fitness-v02','{broken'));await page.reload();
 await page.getByRole('heading',{name:'Saved data needs attention'}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),'{broken');
 const originalEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Download original data'}).click();
 assert.equal(fs.readFileSync(await (await originalEvent).path(),'utf8'),'{broken');
 await page.locator('input[type=file]').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.getByRole('heading',{name:'Build what lasts.'}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02-before-restore')),'{broken');
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02'))),backup);
 // Separate profiles must never copy Ben's history or prescriptions into Georgie's.
 const benBytes=await page.evaluate(()=>localStorage.getItem('form-fitness-v02'));
 await page.getByLabel('Active profile').selectOption('Georgie');
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-georgie-v02')),null);
 await page.getByRole('button',{name:'View guide: Barbell single-leg squat',exact:true}).click();
 const female=page.getByRole('dialog').locator('svg image');assert.equal(await female.count(),2);
 assert.match(await female.first().getAttribute('href'),/female-isometric/);
 await page.evaluate(async()=>{const img=new Image();img.src=document.querySelector('[role=dialog] image').getAttribute('href');await img.decode()});
 await page.screenshot({path:`test-results/${name}-georgie-art.png`});await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-georgie-v02')),null);
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),benBytes);
 await nav.getByRole('button',{name:'Workout'}).click();assert.match(await page.locator('#app').innerText(),/No workout scheduled/);
 await nav.getByRole('button',{name:'Exercises'}).click();await page.getByRole('button',{name:'+ Add exercise'}).click();
 await page.locator('#customName').fill('Evening mobility');await page.locator('#customCategory').selectOption('Mobility');
 await page.locator('#customSets').fill('2');await page.locator('#customReps').fill('30');await page.locator('#customUnit').selectOption('seconds');
 await page.locator('#customInstructions').fill('My own movement instructions');await page.locator('#customRoutine').selectOption('A');
 assert(await page.getByRole('dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));await page.screenshot({path:`test-results/${name}-custom-editor.png`});await page.getByRole('button',{name:'Save exercise',exact:true}).click();
 const georgie=await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-georgie-v02')));
 assert.equal(Object.keys(georgie.logs).length,0);assert.equal(georgie.exercises[0].sets,0);assert.equal(georgie.routines[0].ids.length,1);
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),benBytes);
 await page.getByRole('button',{name:'View guide: Evening mobility',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/My own movement instructions/);await page.keyboard.press('Escape');
 await nav.getByRole('button',{name:'Settings'}).click();
 const georgieBytes=await page.evaluate(()=>localStorage.getItem('form-fitness-georgie-v02'));
 await page.locator('input[type=file]').setInputFiles({name:'ben.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.waitForFunction(()=>document.querySelector('input[type=file]').value==='');
 assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-georgie-v02')),georgieBytes);
 await page.getByLabel('Active profile').selectOption('Ben');assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),benBytes);
 assert.match(await page.locator('[data-guide=single-leg-squat] image').getAttribute('href'),/\/single-leg-squat-isometric-v1.png$/);
 await nav.getByRole('button',{name:'Progress'}).click();await page.getByRole('button',{name:'All reports',exact:true}).click();await page.getByRole('heading',{name:'Your training review'}).waitFor();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`test-results/${name}-review.png`,fullPage:true});
 await page.getByRole('button',{name:'Record activity',exact:true}).click();
 await page.getByRole('dialog').locator('[name=category]').selectOption('Walking');await page.getByRole('dialog').locator('[name=minutes]').fill('25');
 await page.getByRole('button',{name:'Save activity',exact:true}).click();assert.match(await page.locator('#app').innerText(),/0 confirmed activities · 0 minutes/);
 await page.locator('[data-edit-activity]').click();await page.getByRole('dialog').locator('[name=confirmed]').check();await page.getByRole('button',{name:'Save activity',exact:true}).click();
 assert.match(await page.locator('#app').innerText(),/1 confirmed activities · 25 minutes/);
 await page.reload();await nav.getByRole('button',{name:'Progress'}).click();await page.getByRole('button',{name:'All reports',exact:true}).click();assert.match(await page.locator('#app').innerText(),/1 confirmed activities · 25 minutes/);
 await page.locator('[data-edit-activity]').click();await page.getByRole('dialog').locator('[name=minutes]').fill('20');await page.getByRole('button',{name:'Save activity',exact:true}).click();
 assert.match(await page.locator('#app').innerText(),/0 confirmed activities · 0 minutes/);
 await page.getByLabel('Active profile').selectOption('Georgie');await nav.getByRole('button',{name:'Progress'}).click();await page.getByRole('button',{name:'All reports',exact:true}).click();assert.equal(await page.locator('[data-edit-activity]').count(),0);
 await page.reload();assert.equal(await page.getByLabel('Active profile').inputValue(),'Georgie');await page.getByLabel('Active profile').selectOption('Ben');
 await nav.getByRole('button',{name:'Exercises'}).click();await page.getByRole('button',{name:'Import workout',exact:true}).click();
 const importer=page.getByRole('dialog');await importer.locator('[name=title]').fill('Reviewed test session');await importer.locator('[name=date]').fill('2026-10-23');
 await importer.locator('fieldset [name=name]').fill('Bench press');await importer.locator('[name=sets]').fill('2');await importer.locator('[name=reps]').fill('8');await importer.locator('[name=rest]').fill('90');await importer.locator('[name=instructions]').fill('Synthetic source instruction');await importer.locator('[name=reviewed]').check();
 assert(await importer.evaluate(e=>e.scrollWidth<=e.clientWidth));await page.screenshot({path:`test-results/${name}-import-editor.png`});const logsBeforeImport=await page.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('form-fitness-v02')).logs));
 await page.getByRole('button',{name:'Import reviewed workout'}).click();await page.getByRole('heading',{name:'Workout studio'}).waitFor();
 assert.match(await page.locator('#app').innerText(),/Reviewed test session/);assert.equal(await page.locator('#sessionCount').innerText(),'0 verified sets recorded');
 assert.equal(await page.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('form-fitness-v02')).logs)),logsBeforeImport);
 await page.locator('[data-guide]').first().click();assert.match(await page.getByRole('dialog').innerText(),/Synthetic source instruction/);await page.keyboard.press('Escape');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await nav.getByRole('button',{name:'Progress'}).click();await page.getByRole('button',{name:'All reports',exact:true}).click();await page.getByRole('button',{name:'Import Apple Health'}).click();
 const xml='<HealthData><Workout workoutActivityType="HKWorkoutActivityTypeWalking" sourceName="Synthetic Watch" startDate="2026-10-16 10:00:00 +1100" duration="30" durationUnit="min" totalDistance="2" totalDistanceUnit="km"/><Workout workoutActivityType="HKWorkoutActivityTypeWalking" startDate="bad" duration="1" durationUnit="min"/></HealthData>';
 await page.getByRole('dialog').locator('input[type=file]').setInputFiles({name:'export.xml',mimeType:'application/xml',buffer:Buffer.from(xml)});
 await page.getByRole('dialog').getByRole('status').filter({hasText:'1 new workouts'}).waitFor();
 const healthBefore=await page.evaluate(()=>localStorage.getItem('form-fitness-v02'));
 await page.getByRole('button',{name:'Import confirmed activities'}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('form-fitness-v02')),healthBefore);
 await page.getByRole('dialog').locator('[data-workouts] input').check();await page.getByRole('button',{name:'Import confirmed activities'}).click();
 assert.match(await page.locator('#app').innerText(),/1 confirmed activities · 30 minutes/);
 await page.getByRole('button',{name:'Import Apple Health'}).click();await page.getByRole('dialog').locator('input[type=file]').setInputFiles({name:'export.xml',mimeType:'application/xml',buffer:Buffer.from(xml)});
 await page.getByRole('dialog').getByRole('status').filter({hasText:'0 new workouts'}).waitFor();await page.getByRole('dialog').getByRole('button',{name:'Cancel'}).click();
 await page.locator('summary').filter({hasText:'Ask the local coach'}).click();await page.getByLabel('Your question').fill('Review my progress');await page.getByRole('button',{name:'Ask coach',exact:true}).click();assert.match(await page.locator('#coachAnswer').innerText(),/confirmed sets overall/);
 await nav.getByRole('button',{name:'Settings'}).click();const enrichedDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Backup JSON'}).click();
 const enriched=JSON.parse(fs.readFileSync(await (await enrichedDownload).path(),'utf8'));assert(enriched.activities.some(a=>a.source==='Apple Health'));assert(enriched.exercises.some(e=>e.imported));
 await page.locator('input[type=file]').setInputFiles({name:'enriched.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(enriched))});await page.waitForFunction(()=>document.querySelector('input[type=file]').value==='');
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02'))),enriched);
 await page.reload();assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('form-fitness-v02'))),enriched);
 console.log(`PASS ${name}: local Health XML preview, explicit confirmation, duplicate prevention, invalid workout exclusion and coach response`);
 console.log(`PASS ${name}: reviewed workout import, instructions preserved, history unchanged and no assumed completion`);
 console.log(`PASS ${name}: activity drafts, confirmation, correction, persistence, isolation and remembered profile`);
 console.log(`PASS ${name}: profile isolation, custom activity and instructions, cross-profile restore rejection, local review`);
 console.log(`PASS ${name}: draft persistence, blank confirmation rejection, invalid restores, failed saves and corrupt-data recovery`);
 assert.deepEqual(errors,[]);console.log(`PASS ${name}: all 16 guides, focus trap/restore, unconfirmed input preservation, custom fallback, existing v2 data byte-for-byte preservation`);
 await browser.close();
 }
 server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
