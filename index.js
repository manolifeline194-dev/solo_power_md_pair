const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html><head><title>SOLO POWER MD</title><meta name="viewport" content="width=device-width,initial-scale=1">
    <style>body{font-family:sans-serif;background:#000;color:#fff;text-align:center;padding:20px}.box{background:#111;padding:30px;border-radius:15px;max-width:380px;margin:30px auto;border:1px solid #333}input{padding:12px;width:90%;border-radius:8px;border:none;margin:10px 0}button{padding:12px 25px;background:#a855f7;color:white;border:none;border-radius:8px;font-weight:bold;width:100%}#result{margin-top:20px;font-size:22px;color:#a855f7}</style>
    </head><body><div class="box"><h2>SOLO POWER MD</h2><p>Pair Code Generator</p><input id="num" placeholder="923001234567" /><button onclick="getCode()">Get Pair Code</button><p id="result"></p></div>
    <script>async function getCode(){let n=document.getElementById('num').value;if(!n)return alert('Number dalo');document.getElementById('result').innerText='Generating...';let r=await fetch('/code?number='+n);let d=await r.json();document.getElementById('result').innerText=d.code;}</script></body></html>
  `);
});
app.get('/code', (req, res) => {
  let code = Math.random().toString(36).substring(2,8).toUpperCase();
  res.json({code: code});
});
module.exports = app;