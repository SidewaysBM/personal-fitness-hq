/* Network integration test: observe actual demonstration playback inside the app. */
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const server=http.createServer((req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 const file=path==='/personal-fitness-hq/'?'index.html':path.replace('/personal-fitness-hq/','');
 if(!/^(index.html|assets\/[a-z-]+\.(js|css))$/.test(file)){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url=process.env.LIVE_URL||`http://127.0.0.1:${server.address().port}/personal-fitness-hq/`;
 const browser=await chromium.launch({channel:'chrome'});
 const results=[];
 try{
 const ids=require('../docs/video-verification.json').map(s=>s.id).filter(id=>!process.env.VIDEO_ID||id===process.env.VIDEO_ID);
 async function worker(){for(let id; (id=ids.shift());){
 const page=await browser.newPage();
 try{
 await page.goto(url);await page.locator('#desktopNav').getByRole('button',{name:'Exercises'}).click();
 await page.locator(`[data-guide="${id}"]`).click();if(await page.locator('.video-pending').count()){results.push({id,status:'WITHHELD',reason:await page.locator('.video-pending').innerText()});continue;}if(await page.locator('.video-external').count()){results.push({id,status:'EXTERNAL_ONLY',reason:'Publisher blocks embedding; link and playback require separate publisher-page verification.'});continue;}await page.getByRole('button',{name:'Play demonstration',exact:true}).click();
 const iframe=page.locator('.video-player iframe');
 const video=await iframe.count()?page.frameLocator('.video-player iframe').locator('video').first():page.locator('.video-player video');
 await video.waitFor({timeout:25000});

 await video.evaluate(v=>{v.muted=true;v.play().catch(()=>{});});
 await page.waitForTimeout(3000);
 for(let n=0;n<35;n++){
 const state=await video.evaluate(v=>({time:v.currentTime,width:v.videoWidth,ad:!!document.querySelector('.ad-showing')}));
 if(state.time>1&&state.width>0&&!state.ad)break;
 await page.waitForTimeout(1000);
 }
 const state=await video.evaluate(v=>({time:v.currentTime,width:v.videoWidth,ad:!!document.querySelector('.ad-showing')}));
 assert(state.time>1&&state.width>0&&!state.ad,JSON.stringify(state)+' '+(await iframe.count()?await page.frameLocator('.video-player iframe').locator('body').innerText():''));assert.equal(page.url(),url);
 if(id==='back-squat')await page.screenshot({path:'test-results/embedded-video-playing.png',fullPage:true});
 results.push({id,status:'PASS',...state});console.log('PASS embedded playback',id);
 }catch(e){results.push({id,status:'UNVERIFIED',reason:e.message.split('\n')[0]});console.log('UNVERIFIED',id,e.message.split('\n')[0]);}
 finally{await page.close();}
 }}
 await Promise.all([worker(),worker(),worker()]);
 fs.writeFileSync('test-results/embedded-playback.json',JSON.stringify(results,null,2));
 if(results.some(r=>!['PASS','WITHHELD','EXTERNAL_ONLY'].includes(r.status)))process.exitCode=1;
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
