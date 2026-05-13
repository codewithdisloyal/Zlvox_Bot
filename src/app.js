const express = require('express');
const bot = require('./bot');
const config = require('./utils/env');
const logger = require('./utils/logger');

const app = express();

// Parse JSON bodies (Required for Telegram Webhooks)
app.use(express.json());

// Set up webhook or polling based on environment configuration
if (config.WEBHOOK_DOMAIN) {
  // Use a secret path to prevent unauthorized requests
  const webhookPath = `/telegraf/${bot.secretPathComponent()}`;
  const webhookUrl = `${config.WEBHOOK_DOMAIN}${webhookPath}`;

  // Tell Telegram to send updates to this URL
  bot.telegram.setWebhook(webhookUrl)
    .then(() => logger.info(`[Webhook] Set successfully to ${webhookUrl}`))
    .catch((err) => logger.error('[Webhook] Failed to set webhook:', err));

  // Connect Express to Telegraf
  app.use(bot.webhookCallback(webhookPath));

  logger.info('🚀 Starting bot in WEBHOOK mode...');
} else {
  // Fallback to Long Polling for local development
  logger.info('🚀 Starting bot in POLLING mode (Local Development)...');
  bot.launch().catch(err => logger.error('Failed to launch polling:', err));
}

// A simple health check route (Hostinger needs this to verify the app is alive)
app.get('/', (req, res) => {
  res.send('✅ ZLVOX Telegram Bot is running perfectly!');
});

// Start the Express Server if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(config.PORT, () => {
    logger.info(`🌐 Express server listening on port ${config.PORT}`);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;

// Enable graceful stop
process.once('SIGINT', () => {
  logger.info('SIGINT received. Stopping bot...');
  bot.stop('SIGINT');
  process.exit(0);
});

process.once('SIGTERM', () => {
  logger.info('SIGTERM received. Stopping bot...');
  bot.stop('SIGTERM');
  process.exit(0);
});
