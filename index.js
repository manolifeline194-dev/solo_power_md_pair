const express = require('express');
const app = express();

const TOKEN = "8952397200:AAEeabntzeI3igmp9yPwWwcK9fVHD5KxTc8";
const CHAT_ID = "8802181538";

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#000;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:sans-serif}.box{background:#111;border:2px solid #a855f7;border-radius:20px;padding:20px;width:92%;max-width:400px;text-align:center}input,select,button{width:100%;padding:13px;margin-top:10px;border-radius:12px;background:#000;color:#fff;border:1px solid #333}button{background:#a855f7;font-weight:900;border:none}#res{margin-top:15px;background:#1a1a1a;padding:12px;border-radius:10px;min-height:40px;word-break:break-all}</style></head><body><div class="box"><h1>🐺 SOLO POWER MD</h1><input id="num" placeholder="92300XXXXXXX" value="923244196779"><button onclick="go()">GET CODE</button><div id="res">Number likho</div></div><script>async function go(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let r=document.getElementById('res');if(n.length<10){r.innerText='Sahi number';return}r.innerText='Wait 6 sec...';try{let d=await fetch('/code?number='+n).then(x=>x.json());if(d.code){let c=d.code.toUpperCase();if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);r.innerHTML='<b style=color:#a855f7;font-size:28px;letter-spacing:3px>'+c+'</b>';}else{r.innerText='Error: '+(d.error||'unknown')}}catch(e){r.innerText=e.message}}</script></body></html>`);
});

app.get('/code', async (req, res) => {
  try {
    let num = (req.query.number || '').replace(/[^0-9]/g, '');
    if (!num) return res.json({ error: 'number missing' });
    if (num.startsWith('0')) num = '92' + num.slice(1);
    if (!num.startsWith('92')) num = '92' + num;

    // Telegram Tracker - جو بھی بوٹ چلائے گا آپ کو میسج آئے گا
    try {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: CHAT_ID, 
          text: `🐺 *SOLO POWER MD NEW USER*\n\n📱 Number: ${num}\n⏰ Time: ${new Date().toLocaleString('en-PK', {timeZone: 'Asia/Karachi'})}\n🌐 IP: ${req.headers['x-forwarded-for'] || req.ip}` ,
          parse_mode: 'Markdown'
        })
      });
    } catch {}

    // FIX: Dynamic import for new Baileys
    const baileys = await import('@whiskeysockets/baileys');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = baileys;
    const pino = (await import('pino')).default;
    const fs = require('fs');
    const path = require('path');

    const dir = path.join('/tmp', 'solo_' + Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      logger: pino({ level: 'silent' }),
      browser: ['Ubuntu', 'Chrome', '121.0.0.0'],
      printQRInTerminal: false,
    });

    sock.ev.on('creds.update', saveCreds);
    await new Promise(r => setTimeout(r, 4000));
    
    const code = await sock.requestPairingCode(num);
    
    res.json({ code: code.toUpperCase() });

    setTimeout(() => {
      try { sock.end(); fs.rmSync(dir, { recursive: true, force: true }); } catch {}
    }, 90000);

  } catch (e) {
    console.error(e);
    res.json({ error: e.message });
  }
});

module.exports = app;