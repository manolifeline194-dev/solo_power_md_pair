const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.send(`
    <html><head><title>SOLO POWER MD - DANGEROUS</title><meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
      body{margin:0;background:#000;color:#fff;font-family:'Orbitron',sans-serif;text-align:center}
      .header{background: radial-gradient(circle at center, #1a0033 0%, #000 70%); padding:20px; border-bottom:2px solid #a855f7; box-shadow:0 0 20px #a855f7}
      .logo{width:280px;max-width:90%;filter:drop-shadow(0 0 15px #a855f7)}
      .box{background: linear-gradient(145deg, #111, #1a1a1a); padding:25px; border-radius:20px; max-width:400px; margin:20px auto; border:1px solid #a855f7; box-shadow:0 0 30px rgba(168,85,247,0.3)}
      h1{font-size:26px; color:#fff; text-shadow:0 0 10px #a855f7; letter-spacing:2px; margin:10px 0}
      .sub{color:#888; font-family:sans-serif; font-size:13px; margin-bottom:20px}
      input{padding:14px; width:90%; border-radius:10px; border:2px solid #333; background:#000; color:#fff; font-size:16px; text-align:center; outline:none}
      input:focus{border-color:#a855f7; box-shadow:0 0 10px #a855f7}
      button{padding:14px; width:95%; background: linear-gradient(90deg, #a855f7, #7e22ce); color:white; border:none; border-radius:10px; font-weight:bold; font-size:16px; margin-top:15px; cursor:pointer; box-shadow:0 0 15px #a855f7; font-family:'Orbitron'}
      button:active{transform:scale(0.98)}
      #result{margin-top:25px; font-size:28px; color:#a855f7; font-weight:bold; letter-spacing:3px; text-shadow:0 0 15px #a855f7; min-height:35px}
      .steps{text-align:left; background:#0a0a0a; padding:15px; border-radius:10px; margin-top:20px; border-left:3px solid #a855f7}
      .steps p{font-family:sans-serif; font-size:12px; color:#aaa; margin:5px 0}
    </style></head>
    <body>
      <div class="header">
        <img class="logo" src="https://i.ibb.co/7Jx9QZ0x/solo-logo.png" onerror="this.src='logo.png'" />
        <h1>SOLO POWER MD</h1>
        <div class="sub">DANGEROUS EDITION - WHATSAPP BOT</div>
      </div>
      <div class="box">
        <input id="num" placeholder="923001234567" />
        <button onclick="getCode()">⚡ GET PAIR CODE ⚡</button>
        <div id="result"></div>
        <div class="steps">
          <p>1. نمبر 92 کے ساتھ لکھو</p>
          <p>2. GET PAIR CODE دباؤ</p>
          <p>3. WhatsApp > Linked Devices > Link with phone number</p>
        </div>
      </div>
      <script>
        async function getCode(){
          let n=document.getElementById('num').value;
          if(!n) return alert('نمبر ڈالو!');
          document.getElementById('result').innerText='☠️ GENERATING...';
          let r=await fetch('/code?number='+n);
          let d=await r.json();
          document.getElementById('result').innerText=d.code;
        }
      </script>
    </body></html>
  `);
});
app.get('/code', (req,res)=>{
  let c=Math.random().toString(36).substring(2,8).toUpperCase();
  res.json({code:c});
});
module.exports=app;