const {chromium,webkit,devices}=require('playwright'),fs=require('fs'),http=require('http'),assert=require('node:assert/strict');
const server=http.createServer((req,res)=>{const file=new URL(req.url,'http://localhost').pathname.replace(/^\/personal-fitness-hq\//,'')||'index.html';if(!/^(index\.html|sw\.js|manifest\.webmanifest|assets\/(?:exercise-images\/)?[a-z0-9-]+\.(js|css|png|webp))$/.test(file)||!fs.existsSync(file)){res.statusCode=404;return res.end()}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file))});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/personal-fitness-hq/`;
for(const [name,engine,launch,device]of [['desktop',chromium,{channel:'chrome'},{viewport:{width:1440,height:1000}}],['iphone',webkit,{},devices['iPhone 13']],['small-iphone',webkit,{},devices['iPhone SE']]]){
 const browser=await engine.launch(launch),context=await browser.newContext({...device,serviceWorkers:name==='desktop'?'allow':'block',acceptDownloads:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto(url);
 await page.evaluate(async()=>{data.notes='Synthetic confidential record';data.profile={age:38,height:175,weight:80};await save();localStorage.setItem(KEY+'-before-restore',JSON.stringify({...data,notes:'Synthetic recovery'}))});
 const original=await page.evaluate(()=>JSON.stringify(data));
 const migrationFailures=await page.evaluate(async()=>{
  const initialRaw=localStorage.getItem(KEY),initialRecovery=localStorage.getItem(KEY+'-before-restore');let failures=0;
  for(const fault of ['write','cleanup']){
   const adapter={getItem:k=>localStorage.getItem(k),setItem:(k,v)=>{if(fault==='write'&&k===KEY)throw Error('Synthetic write failure');localStorage.setItem(k,v)},removeItem:k=>{if(fault==='cleanup')throw Error('Synthetic cleanup failure');localStorage.removeItem(k)}};
   try{await FormVault.enable(adapter,KEY,store,'543210')}catch{failures++}
   if(localStorage.getItem(KEY)!==initialRaw||localStorage.getItem(KEY+'-before-restore')!==initialRecovery)throw Error('Migration changed data on failure');
  }
  return failures;
 });assert.equal(migrationFailures,2);

 const nav=page.locator(device.isMobile?'#mobileNav':'#desktopNav');await nav.getByRole('button',{name:'Settings'}).click();
 await page.getByRole('button',{name:'Set up PIN lock'}).click();let dialog=page.getByRole('dialog');await dialog.locator('[name=pin]').fill('543210');await dialog.locator('[name=repeat]').fill('543210');await dialog.locator('[name=backup]').check();await dialog.getByRole('button',{name:'Enable encryption'}).click();await page.getByRole('button',{name:'Lock now'}).waitFor();
 assert.equal(await page.evaluate(()=>JSON.stringify(data)),original);
 assert.equal(await page.evaluate(()=>localStorage.getItem(KEY+'-before-restore')),null);
 assert.equal(await page.evaluate(()=>localStorage.getItem(KEY).includes('Synthetic')),false);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem(KEY)).iterations),310000);
 const first=await page.evaluate(()=>localStorage.getItem(KEY));
 const integrity=await page.evaluate(async()=>{
  const raw=localStorage.getItem(KEY);const changed=JSON.parse(raw);changed.ciphertext=(changed.ciphertext[0]==='A'?'B':'A')+changed.ciphertext.slice(1);
  let denied=0;for(const [id,value]of [[KEY,JSON.stringify(changed)],['other-profile',raw]])try{await FormVault.unlock({getItem:()=>value},id,'543210')}catch{denied++}return denied;
 });assert.equal(integrity,2);

 assert.equal(await page.evaluate(async()=>{data.notes='Edited confidential record';return await save()}),true);
 await page.waitForFunction(()=>!saving);assert.notEqual(await page.evaluate(()=>localStorage.getItem(KEY)),first);
 const saved=await page.evaluate(()=>localStorage.getItem(KEY));
 // Storage failure cannot replace the ciphertext or report a successful save.
 const failure=await page.evaluate(async()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===KEY)throw Error('Synthetic quota failure');return original.call(this,k,v)};data.notes='Must not persist';try{return await save()}finally{Storage.prototype.setItem=original}});
 assert.equal(failure,false);assert.equal(await page.evaluate(()=>localStorage.getItem(KEY)),saved);assert.equal(await page.evaluate(()=>data.notes),'Edited confidential record');
 if(name==='desktop'){await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await context.setOffline(true)}
 await page.reload();await page.getByRole('heading',{name:'Profile locked'}).waitFor();assert(!((await page.locator('body').innerText()).includes('Edited confidential')));
 await page.locator('#unlockForm [name=pin]').fill('111111');await page.getByRole('button',{name:'Unlock',exact:true}).click();await page.getByRole('alert').filter({hasText:'PIN incorrect'}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem(KEY)),saved);
 await page.locator('#unlockForm [name=pin]').fill('543210');await page.getByRole('button',{name:'Unlock',exact:true}).click();await page.getByRole('heading',{name:'Build what lasts.'}).waitFor();assert.equal(await page.evaluate(()=>data.notes),'Edited confidential record');if(name==='desktop')await context.setOffline(false);
 await nav.getByRole('button',{name:'Settings'}).click();const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Backup JSON'}).click();const download=await dl,backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(backup.notes,'Edited confidential record');
 await page.getByRole('button',{name:'Restore pre-restore copy',exact:true}).click();await page.waitForFunction(()=>data.notes==='Synthetic recovery');assert.equal(await page.evaluate(()=>FormVault.isEncrypted(localStorage.getItem(KEY))),true);
 await page.evaluate(()=>switchProfile('Georgie'));await nav.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:'Set up PIN lock'}).waitFor();await page.evaluate(()=>switchProfile('Ben'));await page.getByRole('heading',{name:'Profile locked'}).waitFor();
 await page.locator('#unlockForm [name=pin]').fill('543210');await page.getByRole('button',{name:'Unlock',exact:true}).click();await page.getByRole('heading',{name:'Build what lasts.'}).waitFor();
 await page.evaluate(()=>{hiddenAt=Date.now()-61000;document.dispatchEvent(new Event('visibilitychange'))});await page.getByRole('heading',{name:'Profile locked'}).waitFor();
 await page.screenshot({path:`test-results/privacy-${name}.png`,fullPage:true});

 await page.evaluate(()=>{
  window.cspViolations=[];document.addEventListener('securitypolicyviolation',e=>cspViolations.push(e.violatedDirective));
  const script=document.createElement('script');script.textContent='window.injectedScript=true';document.body.appendChild(script);
  const button=document.createElement('button');button.setAttribute('onclick','window.injectedHandler=true');document.body.appendChild(button);button.click();button.remove();
 });await page.waitForFunction(()=>cspViolations.length>=2);assert.equal(await page.evaluate(()=>Boolean(window.injectedScript||window.injectedHandler)),false);
 assert.deepEqual(errors,[]);console.log('PASS '+name+': encrypted migration/recovery, wrong PIN, reload, atomic saves/failure, plain backup, isolation and background expiry');await browser.close();
}server.close()})().catch(e=>{console.error(e);server.close();process.exit(1)});
