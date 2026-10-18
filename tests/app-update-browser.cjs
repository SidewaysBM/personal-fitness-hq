const {chromium,webkit,devices}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
let revision=0;
const workerSource=fs.readFileSync('sw.js','utf8');
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(!pathname.startsWith('/personal-fitness-hq/')){res.statusCode=404;return res.end()}
  const file=pathname.slice('/personal-fitness-hq/'.length)||'index.html';
  if(!/^(index\.html|update\.html|sw\.js|manifest\.webmanifest|assets\/(?:exercise-images\/)?[a-z0-9-]+\.(js|css|png|webp))$/.test(file)||!fs.existsSync(file)){res.statusCode=404;return res.end()}
  let body=fs.readFileSync(file);
  if(file==='sw.js'){
    body=workerSource.replace(/const CACHE='[^']+'/,`const CACHE='form-shell-update-fixture-${revision}'`);
    if(!revision)body=body.replace(/^self\.addEventListener\('message'.*$/m,'');
  }
  if(file==='assets/exercise-art.js'&&!revision)body=body.toString().replace('Lower over front leg','Old pose fixture');
  if(file==='assets/offline.js'&&!revision)body="function offlineStatus(){};window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'))";
  // Reproduce stale artwork in the browser's HTTP cache as well as the old worker.
  res.setHeader('Cache-Control',file.startsWith('assets/')&&file!=='assets/app-update.js'?'public, max-age=31536000, immutable':'no-store');
  res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.webp':'image/webp','.webmanifest':'application/manifest+json'})[path.extname(file)]);
  res.end(body);
});
let browser;
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${server.address().port}/personal-fitness-hq/`;
  for(const [name,engine,options,device] of [
    ['desktop',chromium,{channel:'chrome'},{viewport:{width:1440,height:1000}}],
    ['iphone',webkit,{},devices['iPhone 13']],
    ['small-iphone',webkit,{},devices['iPhone SE']]
  ]){
    revision=0;
    browser=await engine.launch(options);
    const context=await browser.newContext(device),old=await context.newPage(),errors=[];
    context.on('page',page=>page.on('pageerror',e=>errors.push(e.message)));
    old.on('pageerror',e=>errors.push(e.message));
    await old.goto(url);await old.evaluate(()=>navigator.serviceWorker.ready);await old.reload();
    await old.waitForFunction(()=>navigator.serviceWorker.controller);
    const nav=old.locator(device.isMobile?'#mobileNav':'#desktopNav');
    await nav.getByRole('button',{name:'Workout'}).click();
    await old.getByLabel('Workout date').fill('2026-10-19');await old.getByLabel('Workout date').blur();
    await old.locator('#rep-back-squat-0').fill('4');await old.locator('#wt-back-squat-0').fill('35');await old.locator('#check-back-squat-0').click();
    await old.evaluate(()=>{switchProfile('Georgie');data.notes='Independent profile fixture';save();switchProfile('Ben');localStorage.setItem('unrelated-fixture','preserve me')});
    const storage=page=>page.evaluate(()=>JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
    const saved=await storage(old);
    await nav.getByRole('button',{name:'Settings'}).click();
    await old.locator('#height').fill('192'); // Deliberately unsaved form in an older tab.
    const other=await context.newPage();await other.goto(url);
    assert(await other.getByRole('img',{name:'Barbell single-leg squat: Old pose fixture',exact:true}).count());
    revision=1;
    const updater=await context.newPage();await updater.goto(url+'update.html');
    const apply=updater.getByRole('button',{name:'Apply update and open FORM',exact:true});await apply.waitFor();
    assert.equal(await old.locator('#height').inputValue(),'192');
    assert(await other.getByRole('img',{name:'Barbell single-leg squat: Old pose fixture',exact:true}).count());
    assert.equal(await updater.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await apply.click();await updater.waitForURL(url);
    await updater.getByRole('img',{name:'Barbell single-leg squat: Lower over front leg',exact:true}).waitFor();
    assert.equal(await storage(updater),saved);
    assert.equal(await old.locator('#height').inputValue(),'192');
    assert.equal(await other.getByRole('img',{name:'Barbell single-leg squat: Old pose fixture',exact:true}).count(),1);
    // Further releases: show an update immediately when one was already waiting,
    // and retain the update notice when the app replaces its main view.
    revision=2;
    await updater.evaluate(async()=>{const reg=await navigator.serviceWorker.getRegistration();await reg.update()});
    await updater.getByRole('link',{name:'Update in a new tab',exact:true}).waitFor();
    await updater.locator(device.isMobile?'#mobileNav':'#desktopNav').getByRole('button',{name:'Exercises'}).click();
    assert(await updater.getByRole('link',{name:'Update in a new tab',exact:true}).isVisible());
    await updater.reload();await updater.getByRole('link',{name:'Update in a new tab',exact:true}).waitFor();
    const pending=context.waitForEvent('page');await updater.getByRole('link',{name:'Update in a new tab',exact:true}).click();const next=await pending;
    await next.getByRole('button',{name:'Apply update and open FORM',exact:true}).click();await next.waitForURL(url);
    assert.equal(await storage(next),saved);
    assert.equal(await old.locator('#height').inputValue(),'192');
    await context.setOffline(true);await next.reload();
    await next.getByRole('img',{name:'Barbell single-leg squat: Lower over front leg',exact:true}).waitFor();
    assert.equal(await storage(next),saved);
    // Decode the actual local illustration while offline, not only its SVG label.
    await next.evaluate(async()=>{for(const asset of ["back-squat-cast-v1.webp", "push-press-cast-v1.webp", "box-jumps-cast-v1.webp", "tricep-extension-cast-v1.webp", "leg-raise-cast-v1.webp", "bench-cast-v1.webp", "ring-row-cast-v1.webp", "sit-up-cast-v1.webp", "side-plank-cast-v1.webp", "deadbug-cast-v1.webp", "thruster-cast-v1.webp", "neutral-push-cast-v1.webp", "lunge-cast-v1.webp", "pushup-cast-v1.webp", "burpee-cast-v1.webp", "single-leg-squat-isometric-v2.webp"]){const image=new Image();image.src='assets/exercise-images/'+asset;await image.decode();if(image.naturalWidth<1000)throw Error('Offline illustration missing')}});
    assert.deepEqual(errors,[]);
    console.log(`PASS ${name}: legacy multi-tab update, corrected artwork, independent profiles byte-identical, unsaved older tab retained, waiting-update notice after reload/navigation, offline reopen and GitHub Pages subpath`);
    await browser.close();browser=null;
  }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
