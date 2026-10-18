const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html><head><title>SOLO POWER MD</title><meta name="viewport" content="width=device-width,initial-scale=1">
    <style>body{font-family:sans-serif;background:#000;color:#fff;text-align:center;padding:20px}.box{background:#111;padding:30px;border-radius:15px;max-width:380px;margin:30px auto;border:1px solid #333}input{padding:12px;width:90%;border-radius:8px;border:none;margin:10px 0}button{padding:12px 25px;background:#a855f7;color:white;border:none;border-radius:8px;font-weight:bold;width:100%;cursor:pointer}#result{margin-top:20px;font-size:22px;color:#a855f7;word-break:break-all;font-weight:bold}</style>
    </head><body><div class="box"><h2>SOLO POWER MD</h2><p>Pair Code Generator</p><input id="num" placeholder="923xx xxxxxxx (without +)" /><button onclick="getCode()">Get Pair Code</button><p id="result"></p><p style="font-size:12px;color:#888;margin-top:20px">1. Number likho 92 se<br>2. Get Pair Code dabao<br>3. WhatsApp > Linked Devices > Link with phone number pe code dalo</p></div>
    <script>async function getCode(){let n=document.getElementById('num').value;if(!n)return alert('Number dalo');document.getElementById('result').innerText='Generating... 20 sec lagega...';let res=await fetch('/code?number='+n);let data=await res.json();document.getElementById('result').innerText=data.code || data.error;}</script></body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Number do!'});
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/'+Date.now());
    const sock = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) },
      printQRInTerminal: false,
      logger: pino({level:'silent'}),
      browser: ['SOLO POWER MD','Chrome','1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);
    
    await delay(2000);
    let code = await sock.requestPairingCode(num);
    code = code?.match(/.{1,4}/g)?.join('-') || code;
    
    res.json({code: code});
    
    await delay(3000);
    try { sock.ws.close(); } catch {}
    
  } catch (e) {
    console.log(e);
    res.json({error: 'Error: ' + e.message + ' | Dobara try karo'});
  }
});

module.exports = app;