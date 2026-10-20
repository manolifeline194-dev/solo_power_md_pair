const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD - WOLF</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Segoe UI,sans-serif}
body{background:#000 url('https://i.ibb.co/0jZ3s0p/wolf-bg.jpg');background-size:cover;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:rgba(15,15,15,0.9);backdrop-filter:blur(10px);border:1px solid #a855f7;border-radius:22px;padding:28px;width:100%;max-width:430px;text-align:center;box-shadow:0 0 40px rgba(168,85,247,.5), inset 0 0 20px rgba(168,85,247,.1)}
.wolf-wrap{width:110px;height:110px;margin:0 auto 12px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#7c3aed);padding:3px;box-shadow:0 0 25px #a855f7;animation:wolfGlow 2s infinite alternate}
.wolf-wrap img{width:100%;height:100%;border-radius:50%;object-fit:cover;background:#000}
@keyframes wolfGlow{from{box-shadow:0 0 15px #a855f7}to{box-shadow:0 0 35px #a855f7,0 0 50px #7c3aed}}
h1{background:linear-gradient(90deg,#a855f7,#e879f9,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:26px;font-weight:900;letter-spacing:1px}
.sub{color:#aaa;font-size:12px;margin:6px 0 18px;letter-spacing:1px}
input{width:100%;padding:15px 15px 15px 45px;background:#0a0a0a;border:1px solid #333;border-radius:12px;color:#fff;font-size:16px;outline:none}
input:focus{border-color:#a855f7;box-shadow:0 0 12px rgba(168,85,247,.5)}
.ib{position:relative;margin-bottom:12px}.ic{position:absolute;left:15px;top:50%;transform:translateY(-50%);font-size:18px}
button{width:100%;padding:15px;background:linear-gradient(135deg,#a855f7,#7c3aed);border:none;border-radius:12px;color:#fff;font-weight:900;font-size:15px;cursor:pointer;letter-spacing:1px;box-shadow:0 5px 20px rgba(168,85,247,.5);transition:.2s}
button:active{transform:scale(.97)}
#res{margin-top:15px;background:#080808;border:1px dashed #333;padding:16px;border-radius:12px;color:#888;min-height:55px;word-break:break-all;font-size:14px}
.code{color:#a855f7!important;font-size:34px!important;font-weight:900;letter-spacing:5px;text-shadow:0 0 10px #a855f7}
.footer{margin-top:18px;color:#555;font-size:10px}
</style></head>
<body>
<div class="box">
<div class="wolf-wrap"><img src="https://cdn-icons-png.flaticon.com/512/1998/1998610.png" style="filter:invert(1) hue-rotate(240deg) brightness(1.5)"></div>
<h1>SOLO POWER MD</h1>
<p class="sub">🐺 WOLF EDITION • Vercel Active ✅</p>
<div class="ib"><span class="ic">🐺</span><input id="num" placeholder="923716474176"></div>
<button id="btn" onclick="getCode()">⚡ GET PAIR CODE</button>
<div id="res">Apna number likho: 9230...</div>
<div class="footer">Powered by SOLO KING • Wolf Power 🔥</div>
</div>
<script>
async function getCode(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let r=document.getElementById('res');let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ Sahi number likho!';return}
b.innerText='🐺 Wolf Generating...';b.disabled=true;r.innerHTML='⏳ Wolf is hunting your code... 15 sec 🐺';
try{
let res=await fetch('/pair?number='+n);let d=await res.json();
if(d.code){r.innerHTML='🐺 Your Wolf Code:<br><b class=code>'+d.code+'</b><br><br><button onclick=navigator.clipboard.writeText(\\''+d.code+'\\');this.innerText=\\'✅ Copied!\\' style=width:auto;padding:8px 18px;font-size:12px;background:#111;border:1px solid #a855f7;border-radius:8px;color:#fff>📋 Copy Code</button><br><br><small style=color:#666>WhatsApp > Linked Devices > Link with phone number</small>';b.innerText='✅ Code Ready!';b.disabled=false}
else{r.innerHTML='❌ '+d.error;b.innerText='⚡ GET PAIR CODE';b.disabled=false}
}catch(e){r.innerHTML='❌ '+e.message;b.innerText='⚡ GET PAIR CODE';b.disabled=false}
}
</script></body></html>`);
});

app.get('/pair', async (req,res)=>{
  try{
    const num=(req.query.number||'').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:'number ?number=9230...'});
    const baileys = require('@whiskeysockets/baileys');
    const makeWASocket = baileys.default || baileys.makeWASocket;
    const useMultiFileAuthState = baileys.useMultiFileAuthState;
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    const dir = path.join('/tmp','auth_'+num);
    if(fs.existsSync(dir)) fs.rmSync(dir,{recursive:true,force:true});
    const {state,saveCreds}=await useMultiFileAuthState(dir);
    const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:['SOLO WOLF','Chrome','121']});
    sock.ev.on('creds.update',saveCreds);
    await new Promise(r=>setTimeout(r,1500));
    const code = await sock.requestPairingCode(num);
    res.json({code});
    setTimeout(()=>{try{sock.end()}catch{}},30000);
  }catch(e){
    console.log(e);
    res.json({error:e.message});
  }
});

module.exports = app;