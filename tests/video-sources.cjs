/* Optional network test. Runs only on explicit request, never inside the app. */
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const sources=require('../docs/video-verification.json');
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 let failed=0;
 try{
  for(const source of sources){
   const page=await browser.newPage();page.setDefaultTimeout(15000);
   try{
    await page.goto(source.target,{waitUntil:'domcontentloaded',timeout:30000});
    const video=page.locator('video').first();await video.waitFor();
    await video.evaluate(v=>{v.muted=true;v.play().catch(()=>{})});
    // Advertisements are not evidence that the actual demonstration plays.
    for(let attempt=0;attempt<50;attempt++){
     if(await page.locator('.ad-showing').count()){
      const skip=page.locator('.ytp-skip-ad-button,.ytp-ad-skip-button-modern,.ytp-ad-skip-button').first();
      if(await skip.isVisible())await skip.click();
     }else if(await video.evaluate(v=>v.currentTime>1&&v.videoWidth>0))break;
     await page.waitForTimeout(1000);
    }
    await page.waitForFunction(()=>{const v=document.querySelector('video');return !document.querySelector('.ad-showing')&&v?.currentTime>1&&v.videoWidth>0});
    console.log('PASS',source.id,await video.evaluate(v=>({seconds:v.duration,width:v.videoWidth})));
   }catch(e){failed++;console.error('UNVERIFIED',source.id,e.message.split('\n')[0])}
   finally{await page.close()}
  }
 }finally{await browser.close()}
 if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
