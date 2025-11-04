// index.js
const mineflayer = require('mineflayer');

// USTAWIENIA BOTA
const bot = mineflayer.createBot({
  host: '91.244.71.78', // <-- IP Twojego serwera
  port: 30412, // <-- port serwera
  username: 'BotFranek', // nazwa bota (może być dowolna)
  version: false // automatyczne wykrywanie wersji
});

// Kiedy bot się połączy
bot.once('spawn', () => {
  console.log('✅ Bot połączony!');

  // Rejestracja i logowanie
  setTimeout(() => {
    bot.chat('/register haslo123 haslo123');
  }, 3000);

  setTimeout(() => {
    bot.chat('/login haslo123');
  }, 7000);

  // Skakanie co 10 sekund
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 10000);
});

// Jeśli bot się rozłączy – łączy się ponownie
bot.on('end', () => {
  console.log('❌ Bot rozłączony, łączenie ponownie...');
  setTimeout(() => process.exit(1), 5000);
});
