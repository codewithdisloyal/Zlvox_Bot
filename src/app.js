const bot = require('./bot');

// Start the bot
bot.launch().then(() => {
  console.log('🚀 ZLVOX Telegram Bot is running...');
}).catch((err) => {
  console.error('❌ Failed to start the bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('SIGINT received. Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('SIGTERM received. Stopping bot...');
  bot.stop('SIGTERM');
});
