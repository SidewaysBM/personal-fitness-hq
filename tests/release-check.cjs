const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {inspect,compare,checkPrivatePaths}=require('../scripts/release-check.cjs');
const root=path.resolve(__dirname,'..'),initial=inspect(root);assert(checkPrivatePaths(root)>0);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'form-release-fixture-'));
try{
 for(const file of Object.keys(initial.hashes)){fs.mkdirSync(path.dirname(path.join(temp,file)),{recursive:true});fs.copyFileSync(path.join(root,file),path.join(temp,file))}
 const baseline=inspect(temp);assert.equal(baseline.fingerprint,initial.fingerprint);
 cp.execFileSync('git',['init','-q',temp]);fs.writeFileSync(path.join(temp,'export.xml'),'<synthetic/>');
 assert(checkPrivatePaths(temp)>0); // Ignored exports are not release candidates.
 cp.execFileSync('git',['-C',temp,'add','-f','export.xml']);assert.throws(()=>checkPrivatePaths(temp),/Private\/export paths/);
 cp.execFileSync('git',['-C',temp,'rm','--cached','export.xml']);
 const target=path.join(temp,'assets/exercise-preferences.js');fs.appendFileSync(target,'\n// synthetic concurrent change\n');
 assert.deepEqual(compare(baseline,inspect(temp)),['assets/exercise-preferences.js']);fs.copyFileSync(path.join(root,'assets/exercise-preferences.js'),target);
 fs.unlinkSync(target);assert.throws(()=>inspect(temp),/Missing.*exercise-preferences/);fs.copyFileSync(path.join(root,'assets/exercise-preferences.js'),target);
 const sw=fs.readFileSync(path.join(temp,'sw.js'),'utf8');fs.writeFileSync(path.join(temp,'sw.js'),sw.replace('"assets/exercise-preferences.js", ',''));assert.throws(()=>inspect(temp),/Startup asset missing/);fs.writeFileSync(path.join(temp,'sw.js'),sw);
 const pkg=JSON.parse(fs.readFileSync(path.join(temp,'package.json')));pkg.version='999.0.0';fs.writeFileSync(path.join(temp,'package.json'),JSON.stringify(pkg));assert.throws(()=>inspect(temp),/versions disagree/);fs.copyFileSync(path.join(root,'package.json'),path.join(temp,'package.json'));
 fs.unlinkSync(path.join(temp,'assets/ocr/worker.min.js'));assert.throws(()=>inspect(temp),/Missing.*worker/);
 console.log('PASS release gate: missing startup/OCR assets, stale versions, force-added private exports and concurrent changes are rejected.');
}finally{fs.rmSync(temp,{recursive:true,force:true})}
