/* Allowlisted static deployment: never upload the repository root. */
const fs=require('node:fs'),path=require('node:path');
const {inspect,checkPrivatePaths,checkPrivateContent}=require('./release-check.cjs');
const root=path.resolve(__dirname,'..');inspect(root);checkPrivatePaths(root);checkPrivateContent(root);
const out=path.join(root,'dist');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const assets=JSON.parse(sw.match(/const FILES=(\[[^;]+\]);/)[1]);
const files=new Set([...assets.map(file=>file==='./'?'index.html':file),'update.html','sw.js']);
for(const entry of fs.readdirSync(path.join(root,'assets/ocr')))if(fs.statSync(path.join(root,'assets/ocr',entry)).isFile())files.add('assets/ocr/'+entry);
for(const file of files){const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target)}
fs.writeFileSync(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n');
console.log('Static site built in dist: '+files.size+' allowlisted files. No project instructions, private context, tests or backups included.');
