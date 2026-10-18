const {HtmlValidate}=require(process.env.HTML_VALIDATE_PATH||'html-validate');
const fs=require('node:fs');
(async()=>{
 const validator=new HtmlValidate({rules:{'close-order':'error','element-permitted-content':'error','no-dup-id':'error','no-dup-attr':'error','attr-quotes':['error',{style:'double'}]}});
 for(const file of ['index.html','update.html']){
  const report=await validator.validateString(fs.readFileSync(file,'utf8'));
  if(!report.valid){console.error(file,JSON.stringify(report.results,null,2));process.exitCode=1}else console.log('PASS HTML structural validation: '+file);
 }
})();
