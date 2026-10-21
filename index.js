const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

const TOKEN = "8952397200:AAEeabntzeI3igmp9yPwWwcK9fVHD5KxTc8";
const CHAT_ID = "8802181538";

app.get('/', (req, res) => {
  res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#000;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:sans-serif}.box{background:#111;border:2px solid #a855f7;border-radius:20px;padding:20px;width:90%;max-width:400px;text-align:center}input,select,button{width:100%;padding:12px;margin-top:10px;border-radius:10px;background:#000;color:#fff;border:1px solid #333}button{background:#a855f7;font-weight:900}</style></head><body><div class="box"><h1>🐺 SOLO POWER MD</h1><input id="num" placeholder="92300XXXXXXX"><button onclick="go()">GET CODE</button><div id="res" style="margin-top:15px"></div></div><script>async function go(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let r=document.getElementById('res');r.innerText='Wait...';let d=await fetch('/code?number='+n).then(x=>x.json());if(d.code){let c=d.code;if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);r.innerHTML='<b style=color:#a855f7;font-size:28px>'+c+'</b>'}else{r.innerText=d.error}}</script></body></html>`);
});

app.get('/code', async (req,res)=>{
  let num=(req.query.number||'').replace(/[^0-9]/g,'');
  if(num.startsWith('0')) num='92'+num.slice(1);
  if(!num.startsWith('92')) num='92'+num;
  
  // Tracker
  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:CHAT_ID,text:`🐺 NEW USER\nNum: ${num}\nTime: ${new Date().toLocaleString()}`})}).catch(()=>{});
  
  try{
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
    const pino=require('pino'), fs=require('fs'), path=require('path');
    const dir=path.join('/tmp',Date.now().toString());
    const { state, saveCreds }=await useMultiFileAuthState(dir);
    const { version }=await fetchLatestBaileysVersion();
    const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},logger:pino({level:'silent'}),browser:['Chrome','Chrome','121']});
    sock.ev.on('creds.update',saveCreds);
    await new Promise(r=>setTimeout(r,5000));
    const code=await sock.requestPairingCode(num);
    res.json({code});
    setTimeout(()=>{try{sock.end();fs.rmSync(dir,{recursive:true,force:true})}catch{}},120000);
  }catch(e){res.json({error:e.message})}
});

app.listen(PORT, ()=>console.log('Running on '+PORT));