const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD - OFFICIAL</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:radial-gradient(circle at top,#1a0a2e,#000);display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#111;border:2px solid #a855f7;border-radius:28px;padding:26px 20px;width:100%;max-width:430px;text-align:center;box-shadow:0 0 60px rgba(168,85,247,.6)}
.wolf{width:180px;height:180px;margin:0 auto 15px;border-radius:50%;border:3px solid #a855f7;box-shadow:0 0 25px #a855f7;object-fit:cover}
h1{color:#a855f7;font-size:32px;font-weight:900}
.sub{color:#666;font-size:11px;margin:8px 0 18px;letter-spacing:2px}
input,select{width:100%;padding:13px;background:#000;border:1px solid #333;border-radius:12px;color:#fff;font-size:15px;text-align:center;margin-top:8px;outline:none}
select{border-color:#a855f7;color:#a855f7;font-weight:700}
button{margin-top:12px;width:100%;padding:14px;background:linear-gradient(90deg,#a855f7,#6d28d9);border:none;border-radius:12px;color:#fff;font-weight:900;cursor:pointer;font-size:16px}
#res{margin-top:14px;background:#000;border:1px dashed #555;padding:12px;border-radius:12px;color:#999;min-height:50px;word-break:break-all}
.code{color:#a855f7;font-size:30px;font-weight:900;letter-spacing:4px}
</style>
</head>
<body>
<div class="box">
<img class="wolf" src="https://i.ibb.co/your-solo-power-logo-link.png" alt="solo power">
<h1>🐺 SOLO POWER MD</h1>
<p class="sub">THE BEAST • BY SOLO KING</p>

<input id="num" placeholder="92300XXXXXXX">

<select id="server">
  <option value="1">🐺 SERVER 1 - Normal</option>
  <option value="5">🔥 SERVER 5 - Fast</option>
  <option value="10">⚡ SERVER 10 - Ultra</option>
  <option value="12" selected>💜 SERVER 12 - Heavy (Best)</option>
  <option value="15">👹 SERVER 15 - Beast Mode</option>
</select>

<button id="btn" onclick="activate()">⚡ GET SOLO CODE</button>
<div id="res">اپنا نمبر لکھیں اور سرور سلیکٹ کریں</div>
<p style="color:#333;font-size:9px;margin-top:15px">SOLO POWER MD - OFFICIAL PAIR</p>
</div>
<script>
async function activate(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
let s=document.getElementById('server').value;
let r=document.getElementById('res');
let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ صحیح نمبر لکھیں';return}
b.innerText='⏳ SERVER '+s+' CONNECTING...';
b.disabled=true;
r.innerHTML='⏳ SERVER '+s+' پر انتظار کریں...';
try{
let d=await fetch('/code?number='+n+'&server='+s).then(x=>x.json());
if(d.code){
let c=d.code.toUpperCase();
if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);
r.innerHTML='✅ SERVER '+s+' پر READY!<br><b class=code>'+c+'</b><br><br>WhatsApp > Linked Devices میں لگائیں';
b.innerText='✅ SERVER '+s+' DONE';
b.disabled=false;
}else{r.innerHTML='❌ '+d.error;b.innerText='⚡ TRY AGAIN';b.disabled=false;}
}catch(e){r.innerHTML='❌ '+e.message;b.innerText='⚡ TRY AGAIN';b.disabled=false;}
}
</script>
</body>
</html>
  `);
});

app.get('/code', async (req, res) => {
  try {
    let num = (req.query.number || '').replace(/[^0-9]/g, '');
    let serverCount = req.query.server || '12';
    if (!num) return res.json({ error: 'number missing' });

    console.log('SOLO POWER MD - Server '+serverCount+' Request: '+num);

    const baileys = require('@whiskeysockets/baileys');
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = baileys;
    const dir = path.join('/tmp', 'solo_s'+serverCount+'_' + Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const sock = makeWASocket({
      version: [2, 3000, 1023223821],
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      logger: pino({ level: 'silent' }),
      browser: ['SOLO POWER MD - SERVER '+serverCount, 'Chrome', '121'],
      printQRInTerminal: false
    });
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r => setTimeout(r, 3500));
    let code = await sock.requestPairingCode(num);
    res.json({ code: code.toUpperCase(), server: serverCount });
    setTimeout(() => { try { sock.end(); fs.rmSync(dir, { recursive: true, force: true }); } catch {} }, 30000);
  } catch (e) { res.json({ error: e.message }); }
});

module.exports = app;