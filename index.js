const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
  <html><head><title>SOLO POWER MD</title><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body{margin:0;background:#000;color:#fff;font-family:sans-serif;text-align:center}
    .box{background:#111;padding:30px;border-radius:20px;max-width:400px;margin:40px auto;border:1px solid #a855f7;box-shadow:0 0 30px rgba(168,85,247,0.3)}
    h1{color:#a855f7;text-shadow:0 0 10px #a855f7}
    input{padding:14px;width:90%;border-radius:10px;border:2px solid #333;background:#000;color:#fff;text-align:center;font-size:16px}
    button{padding:14px;width:95%;background:linear-gradient(90deg,#a855f7,#7e22ce);color:#fff;border:none;border-radius:10px;font-weight:bold;margin-top:15px;cursor:pointer;font-size:16px}
    #result{margin-top:25px;font-size:26px;color:#a855f7;font-weight:bold;letter-spacing:4px;min-height:40px}
    .info{font-size:12px;color:#888;margin-top:20px;text-align:left;background:#0a0a0a;padding:15px;border-radius:10px}
  </style></head>
  <body>
    <div class="box">
      <h1>SOLO POWER MD</h1>
      <p>Real Pair Code Generator</p>
      <input id="num" placeholder="923001234567 (without +)" />
      <button onclick="getCode()">⚡ GET REAL PAIR CODE ⚡</button>
      <div id="result"></div>
      <div class="info">
        <b>Method:</b><br>
        1. 92 se number likho<br>
        2. Button dabao<br>
        3. Code ayega jaise <b>ABCD-EFGH</b><br>
        4. WhatsApp > Linked Devices > Link with phone number > Code paste karo
      </div>
    </div>
    <script>
      async function getCode(){
        let n=document.getElementById('num').value;
        if(!n) return alert('Number dalo!');
        document.getElementById('result').innerText='Generating... 20-30 sec lagega...';
        try{
          let r=await fetch('/code?number='+n);
          let d=await r.json();
          document.getElementById('result').innerText=d.code || d.error;
        }catch(e){document.getElementById('result').innerText='Error, dobara try karo';}
      }
    </script>
  </body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Number do!'});
  
  let tempDir = path.join('/tmp', 'auth_'+Date.now());
  try{
    if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir,{recursive:true});
    
    const { state, saveCreds } = await useMultiFileAuthState(tempDir);
    const sock = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) },
      printQRInTerminal: false,
      logger: pino({level:'silent'}),
      browser: ['SOLO POWER MD','Chrome','1.0.0'],
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);
    
    await delay(3000);
    
    if(!sock.authState.creds.registered){
      let code = await sock.requestPairingCode(num);
      code = code?.match(/.{1,4}/g)?.join('-') || code;
      res.json({code: code});
    } else {
      res.json({error:'Already registered'});
    }

    setTimeout(()=>{
      try{ sock.ws.close(); }catch{}
      try{ fs.rmSync(tempDir,{recursive:true,force:true}); }catch{}
    }, 8000);

  }catch(e){
    console.log('Pair Error:', e);
    try{ fs.rmSync(tempDir,{recursive:true,force:true}); }catch{}
    res.json({error: 'Failed: '+e.message+'. Dobara try karo ya number check karo'});
  }
});

app.listen(PORT, ()=> console.log('SOLO POWER MD Running on '+PORT));