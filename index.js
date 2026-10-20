const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SOLO POWER MD</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:radial-gradient(circle at top,#1a0a2e,#000);display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}
.box{background:#0e0e12;border:2px solid #a855f7;border-radius:28px;padding:28px 24px;width:100%;max-width:440px;text-align:center;box-shadow:0 0 70px rgba(168,85,247,.7)}
.wolf-img{width:210px;height:210px;margin:0 auto 16px;border-radius:50%;border:4px solid #a855f7;box-shadow:0 0 40px #a855f7,0 0 80px #7c3aed;object-fit:cover}
h1{color:#a855f7;font-size:28px;font-weight:900}
.sub{color:#aaa;font-size:11px;margin:8px 0 22px;letter-spacing:2px}
input{width:100%;padding:14px;background:#000;border:1px solid #333;border-radius:12px;color:#fff;text-align:center}
button{margin-top:12px;width:100%;padding:14px;background:linear-gradient(90deg,#a855f7,#7c3aed);border:none;border-radius:12px;color:#fff;font-weight:900;cursor:pointer}
#res{margin-top:15px;background:#000;border:1px dashed #555;padding:14px;border-radius:12px;color:#999;min-height:55px;word-break:break-all}
.code{color:#a855f7!important;font-size:32px!important;font-weight:900;letter-spacing:4px}
</style></head>
<body>
<div class="box">
<img class="wolf-img" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFPQoNDRQUGhQeKC4pKSkpJSocGCAkKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKf/AABEASAKwAlgMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAMEBgcCAf/EADcQAAIBAwMCBQIGBwcLAAAAAAECAAMEEQQSIQUTMUEGEyJRYXGBkaGxwRQyQlJy0fAUYnLh8RVTorLxFhc0dJTCNEMkNP/EABoBAQACAwEAAAAAAAAAAAAAAAECAAMEBQb/xAArEQ