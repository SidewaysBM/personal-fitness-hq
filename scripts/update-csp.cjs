// Recompute the allowlisted inline startup hash after an intentional app edit.
const fs=require('node:fs'),crypto=require('node:crypto');
const file='index.html',html=fs.readFileSync(file,'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const hash=crypto.createHash('sha256').update(script).digest('base64');
fs.writeFileSync(file,html.replace(/'sha256-[^']+'/g,"'sha256-"+hash+"'"));
