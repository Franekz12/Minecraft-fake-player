// index.js
const mineflayer = require('mineflayer');

const HOST = process.env.MC_HOST || '91.244.71.78'; // lub 'surviworld.run.place'
const PORT = parseInt(process.env.MC_PORT || '30412', 10);
const USERNAME = process.env.MC_USER || 'AFK_Bot';
const PASSWORD = process.env.MC_PASS || null; // tu wpisz hasło dla /register i /login jeśli potrzebujesz

let reconnectTimeout = 5000;
let jumpIntervalMs = 10_000; // 10 sekund

function createBot() {
  console.log(`[bot] starting ${USERNAME} -> ${HOST}:${PORT}`);
  const options = {
    host: HOST,
    port: PORT,
    username: USERNAME,
    // password: ... (only if you want auth; typically for online-mode you need Microsoft auth)
    version: false
  };
  if (process.env.MC_AUTH === 'microsoft') {
    // If you integrate Microsoft auth tokens, set them here — out of scope for this simple script.
    console.log('[bot] note: Microsoft auth requested but not implemented in this script.');
  }
  const bot = mineflayer.createBot(options);

  let jumpIntervalHandle = null;
  let didTryAuth = false;

  bot.on('login', () => {
    console.log('[bot] logged in');
  });

  bot.on('spawn', () => {
    console.log('[bot] spawned in world');

    // Jeśli podano hasło, spróbuj zarejestrować i zalogować.
    // Wysyłamy komendę register, potem login (opóźnienie), bez względu czy serwer wymaga czy nie — bezpieczne.
    if (PASSWORD && !didTryAuth) {
      didTryAuth = true;
      setTimeout(() => {
        console.log('[bot] sending register command...');
        bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
      }, 1500);

      setTimeout(() => {
        console.log('[bot] sending login command...');
        bot.chat(`/login ${PASSWORD}`);
      }, 3500);
    }

    // Anti-AFK: skok co 10 sekund
    if (jumpIntervalHandle) clearInterval(jumpIntervalHandle);
    jumpIntervalHandle = setInterval(() => {
      try {
        bot.setControlState('jump', true);
        setTimeout(() => {
          try { bot.setControlState('jump', false); } catch(e) {}
        }, 250); // krótki skok
      } catch (e) {
        // ignore
      }
    }, jumpIntervalMs);
  });

  bot.on('end', (reason) => {
    console.log('[bot] disconnected:', reason, '-> reconnect in', reconnectTimeout, 'ms');
    if (jumpIntervalHandle) clearInterval(jumpIntervalHandle);
    setTimeout(createBot, reconnectTimeout);
  });

  bot.on('kicked', (reason) => {
    console.log('[bot] kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log('[bot] error:', err && (err.message || err));
  });

  // opcjonalnie: reaguj na wiadomości z serwera (debug)
  bot.on('message', (msg) => {
    // console.log('[server]', msg.toString());
  });

  return bot;
}

createBot();
