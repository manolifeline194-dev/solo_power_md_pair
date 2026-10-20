const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD - DANGEROUS WOLF</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Segoe UI,sans-serif}
body{background:radial-gradient(circle at top,#1a0a2e,#000);display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#0e0e12;border:2px solid #a855f7;border-radius:26px;padding:30px 25px;width:100%;max-width:430px;text-align:center;box-shadow:0 0 60px rgba(168,85,247,.6), inset 0 0 20px rgba(168,85,247,.15)}
.wolf-box{width:160px;height:160px;margin:0 auto 15px;border-radius:50%;background:radial-gradient(circle,#1a1a2e,#000);border:4px solid #a855f7;display:flex;align-items:center;justify-content:center;font-size:90px;box-shadow:0 0 40px #a855f7,0 0 80px #7c3aed;animation:howl 1.5s infinite alternate}
@keyframes howl{from{transform:scale(1);box-shadow:0 0 30px #a855f7}to{transform:scale(1.05);box-shadow:0 0 60px #a855f7,0 0 90px #7c3aed}}
h1{color:#a855f7;font-size:28px;font-weight:900;letter-spacing:2px;text-shadow:0 0 15px #a855f7}
.sub{color:#aaa;font-size:11px;margin:8px 0 22px;letter-spacing:2px}
input{width:100%;padding:15px;background:#000;border:1px solid #333;border-radius:12px;color:#fff;font-size:16px;outline:none;text-align:center;letter-spacing:1px}
input:focus{border-color:#a855f7;box-shadow:0 0 15px rgba(168,85,247,.5)}
button{margin-top:12px;width:100%;padding:15px;background:linear-gradient(90deg,#a855f7,#7c3aed,#a855f7);background-size:200%;border:none;border-radius:12px;color:#fff;font-weight:900;font-size:15px;cursor:pointer;letter-spacing:1px;animation:grad 3s infinite linear}
@keyframes grad{0%{background-position:0%}100%{background-position:200%}}
#res{margin-top:16px;background:#000;border:1px dashed #555;padding:16px;border-radius:12px;color:#999;min-height:60px;word-break:break-all}
.code{color:#a855f7!important;font-size:34px!important;font-weight:900;letter-spacing:5px;text-shadow:0 0 15px #a855f7}
</style></head>
<body>
<div class="box">
<div class="wolf-box">🐺</div>
<h1>SOLO POWER MD</h1>
<p class="sub">🐺 DANGEROUS WOLF • Vercel Active ✅</p>
<input id="num" placeholder="923716474176">
<button id="btn" onclick="getCode()">🐺 GET WOLF CODE</button>
<div id="res">Number likho: 923716474176</div>
<p style="color:#444;font-size:10px;margin-top:18px">SOLO KING • Wolf Power Never Ends 🔥</p>
</div>
<script>
async function getCode(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let r=document.getElementById('res');let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ Sahi number likho!';return}
b.innerText='🐺 Wolf Hunting Code...';b.disabled=true;r.innerHTML='⏳ 20 sec wait... Vercel thora slow hai';
try{let d=await fetch('/pair?number='+n).then(x=>x.json());
if(d.code){let c=d.code.toString().toUpperCase();if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);
r.innerHTML='🐺 Your Wolf Code:<br><b class=code>'+c+'</b><br><br><button onclick=navigator.clipboard.writeText(\\''+c.replace(/-/g,'')+'\\');this.innerText=\\'✅ Copied!\\' style=width:auto;padding:8px 18px;background:#111;border:1px solid #a855f7;color:#fff;border-radius:8px>📋 Copy</button><br><br><small>WhatsApp > Linked Devices > Link with phone number</small>';b.innerText='✅ Code Ready!';b.disabled=false}
else{r.innerHTML='❌ '+d.error+'<br><br><small>Dubara try karo</small>';b.innerText='🐺 GET WOLF CODE';b.disabled=false}}catch(e){r.innerHTML='❌ '+e.message+'<br>Dubara try karo';b.innerText='🐺 GET WOLF CODE';b.disabled=false}}
</script></body></html>`);
});

// 🔥 FIX FOR Connection Closed
app.get('/pair', async (req,res)=>{
  try{
    let num=(req.query.number||'').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:'number missing'});
    
    const baileys = require('@whiskeysockets/baileys');
    const makeWASocket = baileys.default || baileys.makeWASocket;
    const useMultiFileAuthState = baileys.useMultiFileAuthState;
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');

    const dir = path.join('/tmp','wolf_'+Date.now()+'_'+Math.random().toString(36).slice(2));
    const {state,saveCreds}=await useMultiFileAuthState(dir);
    
    // FIXED VERSION - Is se Connection Closed nahi ayega
    const sock=makeWASocket({
      auth: state,
      logger: pino({level:'silent'}),
      browser: ['Ubuntu','Chrome','20.0.04'],
      version: [2, 3000, 1023223821],
      printQRInTerminal: false,
      markOnlineOnConnect: false,
      syncFullHistory: false
    });
    
    sock.ev.on('creds.update',saveCreds);
    
    // 4 sec ka wait - Vercel ke liye zaruri
    await new Promise(r=>setTimeout(r,4000));
    
    if(!sock.authState.creds.registered){
        let code = await sock.requestPairingCode(num);
        code = code?.toUpperCase();
        res.json({code});
    } else {
        res.json({error:'Already registered, delete /tmp'});
    }

    setTimeout(()=>{try{fs.rmSync(dir,{recursive:true,force:true}); sock.end()}catch{}}, 45000);
  }catch(e){
    console.error("PAIR ERROR:", e.message);
    res.json({error: e.message + " | Try again after 10 sec"});
  }
});

module.exports = app;