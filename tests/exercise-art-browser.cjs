const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let browser;
(async()=>{
  const sandbox={window:{}};
  for(const file of ['assets/exercise-art.js','assets/exercise-guides.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),sandbox);
  const ids=Object.keys(sandbox.window.FormGuides);
  assert.equal(ids.length,16);
  let markup='';
  for(let copy=0;copy<2;copy++)for(const id of ids){
    markup+=`<section data-exercise="${id}">${sandbox.window.FormArt(id,id,true)}${sandbox.window.FormArt(id,id,false)}</section>`;
  }
  assert(!/NaN|undefined|Infinity/.test(markup));
  browser=await chromium.launch({channel:'chrome'});
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setContent('<style>svg[viewBox="0 0 440 240"]{width:440px;height:240px}svg[viewBox="0 0 210 200"]{width:210px;height:200px}</style>'+markup);
  const report=await page.evaluate(()=>{
    const allIds=[...document.querySelectorAll('[id]')].map(el=>el.id),broken=[];
    for(const svg of document.querySelectorAll('svg'))for(const el of svg.querySelectorAll('[fill]')){
      const ref=el.getAttribute('fill').match(/^url\(#(.+)\)$/);
      if(ref&&!svg.querySelector(`[id="${ref[1]}"]`))broken.push(ref[1]);
    }
    const contacts=[];
    for(const shoe of document.querySelectorAll('.athlete-shoe[data-support]:not([data-support="pose"])')){
      const kind=shoe.dataset.support;
      // These are visible sole contact points, measured in each panel's SVG coordinates.
      const p=new DOMPoint(kind==='heel-platform'?-4.7:11,kind==='heel-platform'?3.5:6).matrixTransform(shoe.getCTM());
      contacts.push({kind,y:p.y,x:p.x%230});
    }
    const palms=[...document.querySelectorAll('.athlete-palm')].map(palm=>palm.getCTM().a);
    return {duplicates:allIds.length-new Set(allIds).size,broken,contacts,palms,svgs:document.querySelectorAll('svg').length};
  });
  assert.equal(report.svgs,64);assert.equal(report.duplicates,0);assert.deepEqual(report.broken,[]);
  assert(report.contacts.length>0&&report.palms.length>0);
  for(const contact of report.contacts){
    const surface=contact.kind==='toe'?186:contact.kind==='rear-platform'?135:113;
    assert(Math.abs(contact.y-surface)<.01,`${contact.kind} misses surface: ${contact.y} vs ${surface}`);
    assert(contact.x>10&&contact.x<200,`${contact.kind} outside panel`);
  }
  assert(report.palms.every(scale=>scale<0),'Floor palms must point towards the head in the left-facing push-up/burpee poses');
  assert.deepEqual(errors,[]);
  console.log('PASS artwork: all 16 movements / 64 simultaneous SVGs, finite geometry, unique local shading, exact toe/platform contacts and forward-facing floor palms');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close()});
