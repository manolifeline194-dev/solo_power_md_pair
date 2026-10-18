const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
  <html>
  <head>
  <title>SOLO POWER MD - Pair Site</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
  body{background:#0a0a0a;color:white;font-family:sans-serif;text-align:center;padding:20px}
  .box{background:#1a1a1a;padding:25px;border-radius:15px;max-width:400px;margin:50px auto;border:2px solid #00ff88}
  input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0;font-size:16px}
  button{background:#00ff88;color:black;padding:12px 25px;border:none;border-radius:8px;font-weight:bold;font-size:16px;cursor:pointer;width:95%}
  #code{font-size:28px;margin:20px 0;color:#00ff88;letter-spacing:3px;font-weight:bold}
  h1{color:#00ff88}
  </style>
  </head>
  <body>
  <div class="box">
  <h1>SOLO POWER MD</h1>
  <p>Pair Code Generator</p>
  <input id="num" placeholder="923xx xxxxxxx - number with country code" />
  <button onclick="getCode()">Get Pair Code</button>
  <div id="code"></div>
  <p id="msg" style="font-size:13px;color:#aaa"></p>
  </div>
  <script>
  async function getCode(){
    const number = document.getElementById('num').value;
    document.getElementById('code').innerText = 'Wait...';
    document.getElementById('msg').innerText = 'Generating...';
    const res = await fetch('/code?number='+number);
    const data = await res.json();
    if(data.code){
      document.getElementById('code').innerText = data.code;
      document.getElementById('msg').innerText = 'Go to WhatsApp > Linked Devices > Link with phone number';
    } else {
      document.getElementById('code').innerText = 'Error';
      document.getElementById('msg').innerText = data.error || 'Failed';
    }
  }
  </script>
  </body>
  </html>
 
