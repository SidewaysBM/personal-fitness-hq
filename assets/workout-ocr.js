/* Local, review-only extraction. No image or recognised text is sent to a provider. */
(function(root){
 'use strict';
 let loading;
 async function cacheReader(signal){
  if(!root.caches)return;
  const cache=await caches.open('form-ocr-7-eng1');
  for(const name of ['tesseract.min.js','worker.min.js','tesseract-core-lstm.wasm.js','tesseract-core-simd-lstm.wasm.js','tesseract-core-relaxedsimd-lstm.wasm.js','eng.traineddata.gz']){
   if(signal?.aborted)throw new DOMException('Text reading cancelled.','AbortError');
   const url=new URL('assets/ocr/'+name,document.baseURI).href;
   if(!await cache.match(url)){const response=await fetch(url,{signal});if(!response.ok)throw Error('Local text reader download failed.');await cache.put(url,response)}
  }
 }

 function engine(){
  if(root.Tesseract)return Promise.resolve(root.Tesseract);
  if(!loading)loading=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('assets/ocr/tesseract.min.js',document.baseURI).href;script.onload=()=>resolve(root.Tesseract);script.onerror=()=>{loading=null;script.remove();reject(Error('Text reader unavailable. Connect once to download it, or enter the source manually.'))};document.head.append(script)});
  return loading;
 }
 async function recognise(file,{signal,onProgress=()=>{}}={}){
  if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>15*1024*1024)throw Error('Choose a PNG, JPEG or WebP image smaller than 15 MB.');
  const cancelled=()=>{if(signal?.aborted)throw new DOMException('Text reading cancelled.','AbortError')};
  cancelled();let worker,url;
  let rejectCancel;const abort=new Promise((_,reject)=>{rejectCancel=reject});
  const cancel=()=>{worker?.terminate();rejectCancel(new DOMException('Text reading cancelled.','AbortError'))};
  signal?.addEventListener('abort',cancel,{once:true});
  const task=(async()=>{
   url=URL.createObjectURL(file);const img=new Image();img.src=url;await img.decode();cancelled();
   if(img.naturalWidth*img.naturalHeight>12000000)throw Error('Crop this image to the workout first (maximum 12 million pixels).');
   await cacheReader(signal);cancelled();const api=await engine();cancelled();const base=new URL('assets/ocr/',document.baseURI).href;
   worker=await api.createWorker('eng',1,{workerPath:base+'worker.min.js',corePath:base,langPath:base.slice(0,-1),workerBlobURL:false,cacheMethod:'none',logger:m=>{if(!signal?.aborted)onProgress(m.status==='recognizing text'?'Reading text '+Math.round(m.progress*100)+'%':'Preparing local text reader…')}});
   cancelled();await worker.setParameters({tessedit_pageseg_mode:'3',user_defined_dpi:'150'});
   const result=await worker.recognize(file);cancelled();
   if(result.data.text.length>50000)throw Error('Too much text. Crop the image to one workout.');
   return {text:result.data.text,confidence:result.data.confidence};
  })();
  // A late worker initialisation is terminated even after the caller has cancelled.
  task.finally(()=>{worker?.terminate();if(url)URL.revokeObjectURL(url)}).catch(()=>{});
  try{return await Promise.race([task,abort])}finally{signal?.removeEventListener('abort',cancel)}
 }
 function draft(text,library){
  if(typeof text!=='string'||!text.trim()||text.length>50000)throw Error('Read or paste up to 50,000 characters first.');
  const rows=[];let current;
  const normal=s=>s.trim().replace(/\s+/g,' ').toLowerCase();
  for(const line of text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)){
   const explicit=line.match(/^exercise\s*:\s*(.+)$/i),match=library.find(e=>normal(e.name)===normal(line));
   if(explicit||match){current={name:match?.name||explicit[1],sets:'',reps:'',unit:'',weight:'',rest:'',instructions:'',values:{}};rows.push(current);continue}
   if(!current)continue;
   current.instructions+=(current.instructions?'\n':'')+line;
   // Only whole, explicitly labelled lines are mapped. Ranges, shorthand and ambiguous units stay unresolved.
   const patterns=[['sets',/^sets\s*:\s*(\d+)$/i],['reps',/^(?:reps|repetitions)\s*:\s*(\d+)$/i],['seconds',/^(?:duration|hold)\s*:\s*(\d+)\s*(?:s|sec|seconds)$/i],['weight',/^(?:weight|load)\s*:\s*(\d+(?:\.\d+)?)\s*kg$/i],['rest',/^rest\s*:\s*(\d+(?:\.\d+)?)\s*(?:s|sec|seconds)$/i]];
   for(const [key,re] of patterns){const m=line.match(re);if(m)(current.values[key]??=[]).push(m[1])}
  }
  if(!rows.length)throw Error('No exact exercise headings found. Add “Exercise: name” before each exercise, or enter rows manually. Keep the complete source below for reference.');
  if(rows.length>100)throw Error('Review at most 100 exercises at a time.');
  return rows.map(({values,...row})=>{
   for(const key of ['sets','rest','weight'])if(values[key]?.length===1)row[key]=values[key][0];
   if(values.reps?.length===1&&!values.seconds){row.reps=values.reps[0];row.unit='reps'}
   if(values.seconds?.length===1&&!values.reps){row.reps=values.seconds[0];row.unit='seconds'}
   return row;
  });
 }
 root.FormOCR={recognise,draft};
})(typeof window==='undefined'?globalThis:window);
