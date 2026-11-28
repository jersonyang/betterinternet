// Only public Firebase WEB configuration is written to the browser bundle.
import {mkdirSync,rmSync,copyFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('.',import.meta.url));
const dist=join(root,'dist');
const keys=['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId','databaseURL'];
const required=['apiKey','authDomain','projectId','appId'];
const raw=process.env.FIREBASE_WEB_CONFIG;
let config=Object.fromEntries(keys.slice(0,6).map(k=>[k,'']));
if(raw?.trim()){
  let parsed;
  try{parsed=JSON.parse(raw)}catch{throw Error('FIREBASE_WEB_CONFIG must be a JSON object (double-quoted keys and values).')}
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||Object.keys(parsed).some(k=>!keys.includes(k)))throw Error('Use only Firebase web app configuration fields, never service account credentials.');
  if(Object.values(parsed).some(v=>typeof v!=='string')||required.some(k=>!parsed[k]?.trim()))throw Error('Firebase web configuration is incomplete or invalid.');
  config=Object.fromEntries(keys.filter(k=>Object.hasOwn(parsed,k)).map(k=>[k,parsed[k]]));
}else if(process.env.VERCEL==='1')console.warn('FIREBASE_WEB_CONFIG not configured; deploying guest-only.');
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
for(const name of ['index.html','accounts.js','cloud-sdk.js','studio11.js','studio12.js','studio12.css','trace12.js','optimizer12.worker.js','auth-action.html','favicon.svg'])copyFileSync(join(root,name),join(dist,name));
writeFileSync(join(dist,'firebase-config.js'),'// Public Firebase web configuration, generated at build time.\nexport const firebaseConfig = '+JSON.stringify(config,null,2)+';\n');
console.log('BetterInternet static build ready. Firebase '+(raw?.trim()?'configured.':'disabled (guest mode).'));
