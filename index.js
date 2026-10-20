const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD - DANGEROUS WOLF</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:radial-gradient(circle at top,#1a0a2e,#000);display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#0e0e12;border:2px solid #a855f7;border-radius:28px;padding:28px 24px;width:100%;max-width:440px;text-align:center;box-shadow:0 0 70px rgba(168,85,247,.6)}
.wolf-img{width:210px;height:210px;margin:0 auto 15px;border-radius:50%;border:4px solid #a855f7;box-shadow:0 0 40px #a855f7,0 0 80px #7c3aed;object-fit:cover}
h1{color:#a855f7;font-size:28px;font-weight:900;text-shadow:0 0 15px #a855f7}
.sub{color:#aaa;font-size:11px;margin:8px 0 20px;letter-spacing:2px}
input{width:100%;padding:14px;background:#000;border:1px solid #333;border-radius:12px;color:#fff;font-size:16px;text-align:center;outline:none}
button{margin-top:12px;width:100%;padding:14px;background:linear-gradient(90deg,#a855f7,#7c3aed);border:none;border-radius:12px;color:#fff;font-weight:900;cursor:pointer;font-size:16px}
#res{margin-top:15px;background:#000;border:1px dashed #555;padding:14px;border-radius:12px;color:#999;min-height:55px;word-break:break-all}
.code{color:#a855f7;font-size:32px;font-weight:900;letter-spacing:4px}
</style>
</head>
<body>
<div class="box">
<img class="wolf-img" src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=400" alt="wolf">
<h1>SOLO POWER MD</h1>
<p class="sub">🐺 DANGEROUS CYBER WOLF • FINAL 🔥</p>
<input id="num" placeholder="923716474176">
<button id="btn" onclick="getCode()">🐺 GET WOLF CODE</button>
<div id="res">Number likho: 923716474176</div>
<p style="color:#444;font-size:10px;margin-top:16px">SOLO KING • Wolf Power Never Ends 🔥</p>
</div>
<script>
async function getCode(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
let r=document.getElementById('res');
let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ Sahi number likho';return}
b.innerText='🐺 Wolf Hunting...';
b.disabled=true;
r.innerHTML='⏳ 15 sec wait karo...';
try{
let d=await fetch('/pair?number='+n+'&t='+Date.now()).then(x=>x.json());
if(d.code){
let c=d.code.toString().toUpperCase();
if(c.length==8){c=c.slice(0,4)+'-'+c.slice(4)}
r.innerHTML='🐺 Your Wolf Code:<br><b class=code>'+c+'</b><br><br>WhatsApp > Linked Devices > Link with phone number pe lagao';
b.innerText='✅ Code Ready';
b.disabled=false;
}else{
r.innerHTML='❌ '+d.error;
b.innerText='🐺 TRY AGAIN';
b.disabled=false;
}
}catch(e){
r.innerHTML='❌ '+e.message;
b.innerText='🐺 TRY AGAIN';
b.disabled=false;
}
}
</script>
</body>
</html>
  `);
});

app.get('/pair', async (req, res) => {
  try {
    let num = (req.query.number || '').replace(/[^0-9]/g, '');
    if (!num) return res.json({ error: 'number missing' });

    const baileys = require('@whiskeysockets/baileys');
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = baileys;

    const dir = path.join('/tmp', 'w_' + Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);

    const sock = makeWASocket({
      version: [2, 3000, 1023223821],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
      },
      logger: pino({ level: 'silent' }),
      browser: ['SOLO WOLF', 'Chrome', '121.0'],
      printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);
    await new Promise(r => setTimeout(r, 3500));
    
    let code = await sock.requestPairingCode(num);
    res.json({ code: code.toUpperCase() });

    setTimeout(() => {
      try { sock.end(); fs.rmSync(dir, { recursive: true, force: true }); } catch {}
    }, 30000);

  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = app;