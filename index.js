const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#111;border:1px solid #a855f7;border-radius:20px;padding:28px;width:100%;max-width:420px;text-align:center;box-shadow:0 0 25px rgba(168,85,247,.3)}
.logo{width:70px;height:70px;background:linear-gradient(135deg,#a855f7,#7c3aed);border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:32px}
h1{color:#a855f7;font-size:23px;font-weight:900}.sub{color:#777;font-size:12px;margin:6px 0 18px}
input{width:100%;padding:14px;background:#000;border:1px solid #333;border-radius:10px;color:#fff;outline:none;margin-bottom:10px}
button{width:100%;padding:14px;background:linear-gradient(135deg,#a855f7,#7c3aed);border:none;border-radius:10px;color:#fff;font-weight:bold;cursor:pointer}
#res{margin-top:14px;background:#000;border:1px dashed #333;padding:14px;border-radius:10px;color:#aaa;min-height:50px;word-break:break-all}
.code{color:#a855f7;font-size:30px;font-weight:900;letter-spacing:3px}
</style></head>
<body>
<div class="box"><div class="logo">⚡</div><h1>SOLO POWER MD</h1><p class="sub">Vercel Pair - Active ✅</p>
<input id="num" placeholder="923716474176"><button id="btn" onclick="getCode()">⚡ GET PAIR CODE</button>
<div id="res">Number likho phir button dabao</div></div>
<script>
async function getCode(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let r=document.getElementById('res');let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ Sahi number likho';return}
b.innerText='⏳ Wait...';b.disabled=true;r.innerHTML='⏳ Generating 15s...';
try{let d=await fetch('/pair?number='+n).then(x=>x.json());
if(d.code){r.innerHTML='Code: <br><b class=code>'+d.code+'</b><br><br><button onclick=navigator.clipboard.writeText(\\''+d.code+'\\') style=width:auto;padding:6px 14px;font-size:12px>📋 Copy</button><br><br><small>WhatsApp > Linked Devices > Link with phone number</small>';b.innerText='✅ Done'}
else{r.innerHTML='❌ '+d.error;b.disabled=false;b.innerText='GET PAIR CODE'}}catch(e){r.innerHTML='❌ '+e.message;b.disabled=false;b.innerText='GET PAIR CODE'}}
</script></body></html>`);
});

app.get('/pair', async (req,res)=>{
  try{
    const num=(req.query.number||'').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:'number missing'});
    const {default:makeWASocket, useMultiFileAuthState} = await import('@whiskeysockets/baileys');
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    const dir = path.join('/tmp','auth_'+num);
    if(fs.existsSync(dir)) fs.rmSync(dir,{recursive:true,force:true});
    const {state,saveCreds}=await useMultiFileAuthState(dir);
    const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:['SOLO','Chrome','121']});
    sock.ev.on('creds.update',saveCreds);
    await new Promise(r=>setTimeout(r,1500));
    const code = await sock.requestPairingCode(num);
    res.json({code});
    setTimeout(()=>{try{sock.end()}catch{}},25000);
  }catch(e){res.json({error:e.message})}
});

module.exports = app;