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
for(const file of ['assets/exercise-guides.js','assets/exercise-art.js','assets/exercise-videos.js'])new vm.Script(fs.readFileSync(file,'utf8'));
const server = http.createServer((req,res)=>{
 const relative=new URL(req.url,'http://localhost').pathname.replace(/^\/personal-fitness-hq\//,'');
 if(relative.startsWith('assets/')&&/^assets\/[a-z-]+\.(js|css)$/.test(relative)&&fs.existsSync(relative)){
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
 const browser=await engine.launch(launch);const context=await browser.newContext({...device,acceptDownloads:true});const page=await context.newPage();
 // Stub external media for deterministic interaction tests; live playback has a separate check.
 await context.route('https://**/*',r=>{if(r.request().resourceType()==='document')return r.fulfill({contentType:'text/html',body:'<title>Embedded player fixture</title>'});});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('dialog',d=>d.accept());
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
  assert.equal(await dialog.locator('svg g[transform]').count(),2,name);
  arts.add(await dialog.locator('svg').innerHTML());
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
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.locator('iframe,video').count(),0);
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
 assert.deepEqual(errors,[]);console.log(`PASS ${name}: all 16 guides, focus trap/restore, unconfirmed input preservation, custom fallback, existing v2 data byte-for-byte preservation`);
 await browser.close();
 }
 server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
