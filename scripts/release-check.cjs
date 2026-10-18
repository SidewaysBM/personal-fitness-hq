/* Read-only release checks. Reports contain file hashes, never workout records. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
function inspect(root){
 const read=file=>fs.readFileSync(path.join(root,file),'utf8');
 const pkg=JSON.parse(read('package.json')),lock=JSON.parse(read('package-lock.json')),html=read('index.html'),sw=read('sw.js');
 const fail=message=>{throw Error(message)};
 const inline=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
 const csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
 if(!inline||!csp||!csp.includes("'sha256-"+crypto.createHash('sha256').update(inline).digest('base64')+"'"))fail('CSP startup hash is stale; run node scripts/update-csp.cjs.');
 if(!csp.includes("script-src-attr 'none'")||!csp.includes("object-src 'none'"))fail('CSP must block inline event code and objects.');

 if(lock.version!==pkg.version||lock.packages[''].version!==pkg.version)fail('Package versions disagree.');
 const versions=[...html.matchAll(/Version (\d+\.\d+\.\d+)/g)].map(m=>m[1]);
 if(!versions.length||versions.some(v=>v!==pkg.version))fail('Displayed version does not match the package.');
 const cache=sw.match(/const CACHE='([^']+)'/)?.[1];
 if(!cache?.startsWith('form-shell-'+pkg.version+'-')&&cache!=='form-shell-'+pkg.version)fail('Offline cache version does not match the package.');
 const raw=sw.match(/const FILES=(\[[^;]+\]);/)?.[1];if(!raw)fail('Offline asset list could not be read.');
 const cached=JSON.parse(raw),files=new Set(['index.html','update.html','sw.js','manifest.webmanifest','package.json','package-lock.json','.gitignore']);
 const safe=file=>{if(file.startsWith('/')||file.includes('\\')||file.split('/').includes('..')||/^[a-z]+:/i.test(file))fail('Release asset must have a relative local path: '+file);return file==='./'?'index.html':file};
 const add=file=>{file=safe(file);files.add(file);const absolute=path.join(root,file);if(!fs.existsSync(absolute)||!fs.lstatSync(absolute).isFile())fail('Missing or non-regular release file: '+file)};
 cached.forEach(add);
 const references=source=>[...source.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi,'$1</script>').matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(v=>!v.startsWith('data:')&&!v.startsWith('#')&&!/^https?:/.test(v));
 for(const page of ['index.html','update.html'])for(const file of references(read(page))){add(file);if(page==='index.html'&&!cached.includes(file))fail('Startup asset missing from offline cache: '+file)}
 const manifest=JSON.parse(read('manifest.webmanifest'));
 if(manifest.start_url!=='./'||manifest.scope!=='./')fail('Manifest must support the GitHub Pages subdirectory.');
 for(const icon of manifest.icons){add(icon.src);if(!cached.includes(icon.src))fail('Icon missing from offline cache: '+icon.src)}
 const walk=dir=>{for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isSymbolicLink())fail('Symlink in release files: '+file);if(entry.isDirectory())walk(file);else add(file)}};
 walk('assets');walk('tests');walk('scripts');
 // The reader builds these URLs dynamically; HTML link checks alone cannot cover them.
 for(const name of ['tesseract.min.js','worker.min.js','tesseract-core-lstm.wasm.js','tesseract-core-simd-lstm.wasm.js','tesseract-core-relaxedsimd-lstm.wasm.js','eng.traineddata.gz'])add('assets/ocr/'+name);
 const hashes=Object.fromEntries([...files].sort().map(file=>[file,digest(fs.readFileSync(path.join(root,file)))]));
 return {version:pkg.version,cache,hashes,fingerprint:digest(JSON.stringify(hashes))};
}
function checkPrivatePaths(root){
 const files=cp.execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 const privatePath=/(^|\/)(?:\.env(?:\..*)?|export\.xml|export\.zip|private(?:-data)?|backups?|sources)(?:\/|$)|(^|\/)form-(?:ben|georgie)[^/]*\.(?:json|csv)$|\.(?:p12|pfx|pem|key)$/i;
 const blocked=files.filter(file=>privatePath.test(file)&&!file.endsWith('.env.example'));
 if(blocked.length)throw Error('Private/export paths are included in Git candidates: '+blocked.join(', '));
 return files.length;
}
// Scan tracked/unignored text and staged bytes. Never print matching private text.
function checkPrivateContent(root){
 const files=cp.execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 const rules=[
  /(?:user|patient)\s+(?:has|has\s+a|has\s+an)\s+[^.\n]{0,100}(?:condition|diagnosis)/i,
  /(?:height\s*:\s*\d+(?:\.\d+)?\s*cm|starting\s+weight\s*:\s*(?:approximately\s*)?\d+(?:\.\d+)?\s*kg|(?:male|female),\s*\d+\s+years\s+old)/i,
  /["']?profile["']?\s*:\s*\{\s*["']?age["']?\s*:\s*[1-9]\d*\s*,\s*["']?height["']?\s*:\s*\d+\s*,\s*["']?weight["']?\s*:\s*\d+/i
 ];
 const blocked=[];
 function scan(file,bytes,label){if(bytes.includes(0))return;const text=bytes.toString('utf8');if(rules.some(rule=>rule.test(text)))blocked.push(file+' ('+label+')')}
 for(const file of files){const location=path.join(root,file);if(fs.existsSync(location)&&fs.lstatSync(location).isFile())scan(file,fs.readFileSync(location),'working tree')}
 // Only staged changes: unchanged index versions may still contain the old profile while it is being removed.
 const staged=cp.execFileSync('git',['diff','--cached','--name-only','--diff-filter=ACM','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 for(const file of staged)scan(file,cp.execFileSync('git',['show',':'+file],{cwd:root}),'staged');
 if(blocked.length)throw Error('Personal profile content in release candidates: '+blocked.join(', '));
 return files.length;
}
function compare(before,after){return [...new Set([...Object.keys(before.hashes),...Object.keys(after.hashes)])].filter(file=>before.hashes[file]!==after.hashes[file])}
module.exports={inspect,checkPrivatePaths,checkPrivateContent,compare};
if(require.main===module){
 const root=path.resolve(__dirname,'..'),report=path.join(root,'test-results/release-candidate.json'),mode=process.argv[2]||'check';
 try{
  const state=inspect(root),count=checkPrivatePaths(root);checkPrivateContent(root);
  if(mode==='snapshot'){fs.mkdirSync(path.dirname(report),{recursive:true});fs.writeFileSync(report,JSON.stringify({...state,createdAt:new Date().toISOString()},null,2)+'\n');console.log('PASS release snapshot: '+state.version+'; '+Object.keys(state.hashes).length+' application/test files; '+count+' Git candidates checked.');}
  else if(mode==='verify'){const previous=JSON.parse(fs.readFileSync(report,'utf8')),changed=compare(previous,state);if(changed.length)throw Error('Candidate changed since snapshot; recheck affected features: '+changed.join(', '));console.log('PASS candidate unchanged: '+state.fingerprint);}
  else if(mode==='check')console.log('PASS release packaging: versions, offline startup assets, OCR files, subdirectory manifest and private-path exclusions.');
  else throw Error('Use check, snapshot or verify.');
 }catch(error){console.error(error.message);process.exitCode=1}
}
