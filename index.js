const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD - WOLF</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#0e0e0e;border:2px solid #a855f7;border-radius:20px;padding:25px;width:100%;max-width:430px;text-align:center;box-shadow:0 0 40px rgba(168,85,247,.6)}
.wolf-img{width:180px;height:180px;margin:0 auto 10px;border-radius:50%;border:3px solid #a855f7;box-shadow:0 0 30px #a855f7;object-fit:cover}
h1{color:#a855f7;font-size:28px;font-weight:900;text-shadow:0 0 10px #a855f7;letter-spacing:2px}
.sub{color:#888;font-size:12px;margin:8px 0 20px}
input{width:100%;padding:14px;background:#000;border:1px solid #333;border-radius:10px;color:#fff;outline:none;margin-bottom:12px}
button{width:100%;padding:14px;background:linear-gradient(90deg,#a855f7,#7c3aed);border:none;border-radius:10px;color:#fff;font-weight:900;cursor:pointer;box-shadow:0 0 20px rgba(168,85,247,.5)}
#res{margin-top:15px;background:#000;border:1px dashed #333;padding:15px;border-radius:10px;color:#aaa;min-height:50px}
.code{color:#a855f7!important;font-size:32px!important;font-weight:900;letter-spacing:4px}
</style></head>
<body>
<div class="box">
<img class="wolf-img" src="https://i.imgur.com/8Km9tLL.png" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1998/1998610.png'" alt="wolf">
<h1>SOLO POWER MD</h1>
<p class="sub">🐺 DANGEROUS WOLF EDITION ✅</p>
<input id="num" placeholder="923716474176">
<button id="btn" onclick="getCode()">🐺 GET PAIR CODE</button>
<div id="res">نمبر لکھو اور بٹن دباؤ</div>
</div>
<script>
async function getCode(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let r=document.getElementById('res');let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ نمبر غلط ہے';return}
b.innerText='⏳ Generating...';b.disabled=true;r.innerHTML='⏳ 20 سیکنڈ انتظار... جلدی کوڈ لگانا';
try{let d=await fetch('/pair?number='+n).then(x=>x.json());
if(d.code){r.innerHTML='آپ کا کوڈ:<br><b class=code>'+d.code+'</b><br><br>WhatsApp > Linked Devices > Link with phone number';b.innerText='✅ Done';b.disabled=false}
else{r.innerHTML='❌ '+d.error;b.innerText='GET PAIR CODE';b.disabled=false}}catch(e){r.innerHTML='❌ '+e.message;b.innerText='GET PAIR CODE';b.disabled=false}
}
</script></body></html>`);
});

app.get('/pair', async (req,res)=>{
  try{
    const num=(req.query.number||'').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:'number missing'});
    const baileys = require('@whiskeysockets/baileys');
    const makeWASocket = baileys.default || baileys.makeWASocket;
    const useMultiFileAuthState = baileys.useMultiFileAuthState;
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    const dir = path.join('/tmp','solo_'+Date.now());
    const {state,saveCreds}=await useMultiFileAuthState(dir);
    const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:['Ubuntu','Chrome','20.0.04'],printQRInTerminal:false});
    sock.ev.on('creds.update',saveCreds);
    await new Promise(r=>setTimeout(r,4000));
    let code = await sock.requestPairingCode(num);
    code = code?.match(/.{1,4}/g)?.join('-') || code;
    res.json({code});
  }catch(e){res.json({error:e.message})}
});
module.exports = app;