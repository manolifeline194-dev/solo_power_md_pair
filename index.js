app.get('/code', async (req, res) => {
  try {
    let rawNum = (req.query.number || '').replace(/[^0-9]/g, '');
    let serverCount = req.query.server || '12';
    if (!rawNum) return res.json({ error: 'number missing' });
    
    // نمبر فکس - 0 ہٹاؤ، 92 لگاؤ
    let num = rawNum;
    if (num.startsWith('0')) num = '92' + num.slice(1);
    if (!num.startsWith('92')) num = '92' + num; // اگر کسی نے 300... لکھا تو
    // آخری چیک
    if (num.startsWith('920')) num = num.replace('920','92');

    let ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
    sendToTelegram(`🐺 NEW TRY\\n📱 ${num} (raw: ${rawNum})\\n🖥️ Server ${serverCount}\\n🌍 ${ip}`);

    const baileys = require('@whiskeysockets/baileys');
    const pino = require('pino');
    const fs = require('fs');
    const path = require('path');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = baileys;
    
    const dir = path.join('/tmp', 'solo_' + Date.now() + '_' + Math.random());
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    
    // لیٹسٹ ورژن لو
    let { version } = await fetchLatestBaileysVersion();
    console.log('Using WA Version:', version);

    const sock = makeWASocket({
      version: version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      logger: pino({ level: 'silent' }),
      browser: ['Chrome', 'Chrome', '121.0.0.0'],
      printQRInTerminal: false,
      syncFullHistory: false
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    // Vercel پر 6 سیکنڈ ویٹ لازمی ہے
    await new Promise(r => setTimeout(r, 6000));
    
    let code = await sock.requestPairingCode(num);
    console.log('CODE for', num, ':', code);
    
    res.json({ code: code.toUpperCase(), server: serverCount });
    
    // 2 منٹ تک سیشن کو زندہ رکھو تاکہ یوزر لنک کر سکے
    setTimeout(() => { 
      try { 
        sock.end(); 
        fs.rmSync(dir, { recursive: true, force: true }); 
      } catch {} 
    }, 120000); // 120 sec = 2 min

  } catch (e) {
    console.log('Pair Error:', e);
    res.json({ error: e.message });
  }
});