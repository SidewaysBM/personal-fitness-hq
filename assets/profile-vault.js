/* Optional encryption boundary. Keys exist only in memory; saved envelopes stay at legacy keys. */
(function(root){
 'use strict';
 const encoder=new TextEncoder(),decoder=new TextDecoder(),iterations=310000;
 const b64=bytes=>btoa(String.fromCharCode(...bytes));
 const bytes=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
 const random=n=>crypto.getRandomValues(new Uint8Array(n));
 const isEnvelope=value=>value&&value.format==='form-encrypted-profile'&&value.version===1;
 function parse(raw){try{const v=JSON.parse(raw);return isEnvelope(v)?v:null}catch{return null}}
 async function derive(pin,salt){
  if(!/^\d{6}$/.test(pin))throw Error('Enter a six-digit PIN.');
  const material=await crypto.subtle.importKey('raw',encoder.encode(pin),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 }
 async function seal(key,id,salt,payload){
  const iv=random(12),data=encoder.encode(JSON.stringify(payload));
  const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(id)},key,data));
  // Chunking avoids argument limits on large histories.
  let binary='';for(let i=0;i<encrypted.length;i+=8192)binary+=String.fromCharCode(...encrypted.subarray(i,i+8192));
  return JSON.stringify({format:'form-encrypted-profile',version:1,kdf:'PBKDF2-SHA256',iterations,salt:b64(salt),iv:b64(iv),ciphertext:btoa(binary)});
 }
 async function unseal(raw,pin,id){
  const e=parse(raw);if(!e||e.kdf!=='PBKDF2-SHA256'||e.iterations!==iterations)throw Error('Unsupported encrypted profile.');
  const salt=bytes(e.salt),iv=bytes(e.iv);if(salt.length!==16||iv.length!==12)throw Error('Invalid encrypted profile.');
  const key=await derive(pin,salt);
  let payload;try{payload=JSON.parse(decoder.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode(id)},key,bytes(e.ciphertext))))}catch{throw Error('PIN incorrect or encrypted data damaged. Your saved data has not changed.')}
  root.FormStore.validate(JSON.parse(payload.raw));
  if(payload.recovery!==null&&typeof payload.recovery!=='string')throw Error('Invalid recovery copy.');
  return {key,salt,payload};
 }
 function session(storage,id,raw,key,salt,payload){
  let value=root.FormStore.validate(JSON.parse(payload.raw)),busy=false,closed=false;
  return {
   encrypted:true,get value(){return closed?null:value},get raw(){return closed?null:payload.raw},error:null,
   recovery(){if(closed)throw Error('Profile is locked.');return payload.recovery},
   close(){closed=true;value=null;payload=null;key=null},
   async write(next,restoring=false){
    if(closed)throw Error('Profile is locked.');if(busy)throw Error('A save is already in progress.');
    root.FormStore.validate(next);const snapshot=structuredClone(next);busy=true;
    try{
     const nextPayload={raw:JSON.stringify(snapshot),recovery:restoring?payload.raw:payload.recovery};
     const encoded=await seal(key,id,salt,nextPayload);
     if(closed)throw Error('Profile locked before saving.');
     if(storage.getItem(id)!==raw)throw Error('Your data changed in another tab. Reload before editing to avoid overwriting it.');
     storage.setItem(id,encoded);raw=encoded;payload=nextPayload;value=snapshot;return value;
    }finally{busy=false}
   }
  };
 }
 async function enable(storage,id,source,pin){
  if(!crypto.subtle)throw Error('Encryption requires HTTPS or localhost.');
  if(source.error||!source.value)throw Error('Recover saved data before enabling the lock.');
  const original=storage.getItem(id),recovery=storage.getItem(id+'-before-restore');
  if(original!==source.raw)throw Error('Your data changed in another tab. Reload first.');
  const payload={raw:JSON.stringify(source.value),recovery},salt=random(16),key=await derive(pin,salt);
  const encoded=await seal(key,id,salt,payload);
  // Verify the migration before changing persistent data.
  const check=await unseal(encoded,pin,id);if(check.payload.raw!==payload.raw||check.payload.recovery!==recovery)throw Error('Encryption verification failed.');
  if(storage.getItem(id)!==original||storage.getItem(id+'-before-restore')!==recovery)throw Error('Saved data changed. Reload first.');
  storage.setItem(id,encoded);
  try{storage.removeItem(id+'-before-restore')}catch(error){if(original===null)storage.removeItem(id);else storage.setItem(id,original);throw error}
  return session(storage,id,encoded,key,salt,payload);
 }
 async function unlock(storage,id,pin){const raw=storage.getItem(id),opened=await unseal(raw,pin,id);if(storage.getItem(id)!==raw)throw Error('Saved data changed. Unlock again.');return session(storage,id,raw,opened.key,opened.salt,opened.payload)}
 root.FormVault={isEncrypted:raw=>Boolean(parse(raw)),enable,unlock};
})(window);
