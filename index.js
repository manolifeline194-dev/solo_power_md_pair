const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD - WOLF</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:radial-gradient(circle at top,#1a0a2e,#000);display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#0e0e12;border:2px solid #a855f7;border-radius:26px;padding:30px 25px;width:100%;max-width:430px;text-align:center;box-shadow:0 0 60px rgba(168,85,247,.6)}
.wolf-box{width:150px;height:150px;margin:0 auto 15px;border-radius:50%;background:radial-gradient(circle,#1e1e2f,#000);border:4px solid #a855f7;display:flex;align-items:center;justify-content:center;font-size:85px;box-shadow:0 0 40px #a855f7}
h1{color:#a855f7;font-size:27px;font-weight:900;text-shadow:0 0 12px #a855f7}
.sub{color:#888;font-size:11px;margin:8px 0 20px;letter-spacing:2px}
input{width:100%;padding:14px;background:#000;border:1px solid #333;border-radius:12px;color:#fff;text-align:center;font-size:16px;outline:none}
button{margin-top:12px;width:100%;padding:14px;background:linear-gradient(90deg,#a855f7,#7c3aed);border:none;border-radius:12px;color:#fff;font-weight:900;cursor:pointer}
#res{margin-top:15px;background:#000;border:1px dashed #555;padding:15px;border-radius:12px;color:#aaa;min-height:60px;word-break:break-all}
.code{color:#a855f7!important;font-size:32px!important;font-weight:900;letter-spacing:4px}
</style></head>
<body>
<div class="box"><div class="wolf-box">🐺</div><h1>SOLO POWER MD</h1><p class="sub">🐺 DANGEROUS WOLF • Fixed ✅</p>
<input id="num" placeholder="923716474176"><button id="btn" onclick="getCode()">🐺 GET WOLF CODE</button><div id="res">Number likho</div></div>
<script>
async function getCode(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let r=document.getElementById('res');let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ Sahi number likho';return}
b.innerText='🐺 Wolf Connecting...';b.disabled=true;r.innerHTML='⏳ 15 sec wait, 2 bar try kar sakte ho...';
try{let d=await fetch('/pair?number='+n+'&t='+Date.now()).then(x=>x.json());
if(d.code){let c=d.code.toString().toUpperCase();if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);
r.innerHTML='🐺 Wolf Code:<br><b class=code>'+c+'</b><br><br>Foran lagao! 20 sec me expire!';b.innerText='✅ Code Ready!';b.disabled=false}
else{r.innerHTML='❌ '+d.error+'<br><br>Dubara dabao - dusri bar chal jayega!';b.innerText='🐺 TRY AGAIN';b.disabled=false}}catch(e){r.innerHTML='❌ '+e.message+'<br>Dubara try karo';b.innerText='🐺 TRY AGAIN';b.disabled=false}}
</script></body></html>`);
});

app.get('/pair', async (req,res)=>{
  const fs = require('fs');
  const path = require('path');
  const pino = require('pino');
  const dir = path.join('/tmp','wolf_'+Date.now());
  try{
    let num=(req.query.number||'').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:'number missing'});
    
    const baileys = require('@whiskeysockets/baileys');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = baileys;
    
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    let { version } = await fetchLatestBaileysVersion().catch(()=>({version:[2,3000,1023223821]}));
    
    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))
      },
      logger: pino({level:'silent'}),
      browser: ['SOLO POWER WOLF','Chrome','121.0'],
      printQRInTerminal: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    // Wait for connection to stabilize
    await new Promise(r=>setTimeout(r,3500));
    
    let code = await sock.requestPairingCode(num);
    res.json({code: code.toUpperCase()});
    
    setTimeout(()=>{ try{ sock.end(); fs.rmSync(dir,{recursive:true,force:true}); }catch{} }, 30000);
    
  }catch(e){
    try{ fs.rmSync(dir,{recursive:true,force:true}); }catch{}
    console.log("PAIR ERROR:", e.message);
    res.json({error: e.message});
  }
});

module.exports = app;