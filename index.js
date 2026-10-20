const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#111;border:2px solid #a855f7;border-radius:20px;padding:25px;width:100%;max-width:400px;text-align:center;box-shadow:0 0 30px #a855f7}
.wolf{width:150px;height:150px;margin:0 auto 15px;border-radius:50%;background:#000;border:3px solid #a855f7;display:flex;align-items:center;justify-content:center;font-size:80px}
h1{color:#a855f7;font-size:26px}
.sub{color:#888;font-size:11px;margin:10px 0 20px}
input{width:100%;padding:13px;background:#000;border:1px solid #444;border-radius:10px;color:#fff;text-align:center}
button{margin-top:12px;width:100%;padding:13px;background:#a855f7;border:none;border-radius:10px;color:#fff;font-weight:bold;cursor:pointer}
#res{margin-top:15px;background:#000;border:1px dashed #555;padding:12px;border-radius:10px;color:#aaa;min-height:50px;word-break:break-all}
.code{color:#a855f7;font-size:30px;font-weight:900;letter-spacing:4px}
</style>
</head>
<body>
<div class="box">
<div class="wolf">🐺</div>
<h1>SOLO POWER MD</h1>
<p class="sub">REAL WOLF - FINAL FIX</p>
<input id="num" placeholder="923716474176">
<button id="btn" onclick="getCode()">GET WOLF CODE</button>
<div id="res">Number likho</div>
</div>
<script>
async function getCode(){
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
let r=document.getElementById('res');
let b=document.getElementById('btn');
if(n.length<10){r.innerHTML='Sahi number likho';return}
b.innerText='Wait...';
r.innerHTML='Wait 15 sec...';
try{
let res=await fetch('/pair?number='+n);
let data=await res.json();
if(data.code){
let c=data.code.toUpperCase();
if(c.length==8){c=c.slice(0,4)+'-'+c.slice(4)}
r.innerHTML='Your Code:<br><b class=code>'+c+'</b><br><br>WhatsApp > Linked Devices > Link with phone number';
b.innerText='Code Ready';
}else{
r.innerHTML=data.error;
b.innerText='Try Again';
}
}catch(e){
r.innerHTML=e.message;
b.innerText='Try Again';
}
}
</script>
</body>
</html>
`);
});

app.get('/pair', async (req,res)=>{
  const fs=require('fs');
  const pino=require('pino');
  const dir=path.join('/tmp','wolf_'+Date.now());
  try{
    let num=(req.query.number||'').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:'number missing'});
    const baileys=require('@whiskeysockets/baileys');
    const {default:makeWASocket,useMultiFileAuthState,makeCacheableSignalKeyStore}=baileys;
    const {state,saveCreds}=await useMultiFileAuthState(dir);
    const sock=makeWASocket({
      version:[2,3000,1023223821],
      auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},
      logger:pino({level:'silent'}),
      browser:['SOLO WOLF','Chrome','121.0'],
      printQRInTerminal:false
    });
    sock.ev.on('creds.update',saveCreds);
    await new Promise(r=>setTimeout(r,3000));
    let code=await sock.requestPairingCode(num);
    res.json({code:code});
    setTimeout(()=>{try{sock.end();fs.rmSync(dir,{recursive:true,force:true})}catch{}},20000);
  }catch(e){
    try{fs.rmSync(dir,{recursive:true,force:true})}catch{}
    res.json({error:e.message});
  }
});

module.exports=app;