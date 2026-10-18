const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let browser;
(async()=>{
  const sandbox={window:{}};
  for(const file of ['assets/exercise-art.js','assets/exercise-guides.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),sandbox);
  const ids=Object.keys(sandbox.window.FormGuides);
  assert.equal(ids.length,16);
  const assets=new Set();
  for(const id of ids){
    const href=sandbox.window.FormArt(id,id,true).match(/href="([^"]+)"/)[1];
    assets.add(href);
    const bytes=fs.readFileSync(href);
    assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert(bytes.length<=250000);
    for(const profile of ['male','female'])assert.equal(sandbox.window.FormArt(id,id,true,profile).match(/href="([^"]+)"/)[1],href);
  }
  assert.equal(assets.size,16,'Each exercise has its own fixed model asset');
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
    for(const image of document.querySelectorAll('svg image')){
      const ref=image.getAttribute('clip-path').match(/^url\(#(.+)\)$/);
      if(!ref||!image.closest('svg').querySelector(`[id="${ref[1]}"]`))broken.push('missing image clip');
    }
    return {duplicates:allIds.length-new Set(allIds).size,broken,svgs:document.querySelectorAll('svg').length,images:document.querySelectorAll('svg image').length,labels:[...document.querySelectorAll('svg')].every(s=>s.getAttribute('aria-label'))};
  });
  assert.equal(report.svgs,64);assert.equal(report.images,96);assert.equal(report.duplicates,0);assert.deepEqual(report.broken,[]);assert(report.labels);
  assert.deepEqual(errors,[]);
  console.log('PASS artwork: 16 distinct local WebPs, profile-independent assignments, 64 simultaneous SVGs / 96 frames, unique valid clips and accessible labels; anatomical review is visual');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close()});
