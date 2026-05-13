const express = require('express');
const bot = require('./bot');
const config = require('./utils/env');
const logger = require('./utils/logger');

const app = express();

// Parse JSON bodies (Required for Telegram Webhooks)
app.use(express.json());

// A simple health check route
app.get('/', (req, res) => {
  res.send('✅ ZLVOX Telegram Bot is running perfectly!');
});

// Setup route to manually trigger webhook registration (Crucial for Vercel)
app.get('/setup', async (req, res) => {
  try {
    if (!config.WEBHOOK_DOMAIN) {
      return res.send('❌ Error: WEBHOOK_DOMAIN is not set in environment variables. Please add it in Vercel settings.');
    }
    
    // Ensure the domain starts with https://
    const domain = config.WEBHOOK_DOMAIN.startsWith('http') 
      ? config.WEBHOOK_DOMAIN 
      : `https://${config.WEBHOOK_DOMAIN}`;

    const webhookPath = `/telegraf/${bot.secretPathComponent()}`;
    const webhookUrl = `${domain}${webhookPath}`;

    logger.info(`Attempting to set webhook to: ${webhookUrl}`);
    await bot.telegram.setWebhook(webhookUrl);
    
    res.send(`✅ Webhook set successfully!<br><br><b>URL:</b> ${webhookUrl}<br><br>Now your bot should be working! Try sending /start to it on Telegram.`);
  } catch (err) {
    logger.error('Failed to set webhook:', err);
    res.status(500).send(`❌ Failed to set webhook: ${err.message}<br><br>Check if your BOT_TOKEN is correct.`);
  }
});

// Debug route to verify configuration
app.get('/debug', (req, res) => {
  res.json({
    token_loaded: !!config.BOT_TOKEN,
    token_hint: config.BOT_TOKEN ? `${config.BOT_TOKEN.split(':')[0]}...` : 'not loaded',
    webhook_domain: config.WEBHOOK_DOMAIN,
    node_env: config.NODE_ENV,
    is_vercel: !!process.env.VERCEL,
    port: config.PORT
  });
});

// Webhook handling middleware
if (config.WEBHOOK_DOMAIN || process.env.VERCEL) {
  const webhookPath = `/telegraf/${bot.secretPathComponent()}`;
  app.use(bot.webhookCallback(webhookPath));
  logger.info(`[Webhook] Path configured: ${webhookPath}`);
} 

// Long polling fallback (Only for local development)
if (!process.env.VERCEL && !config.WEBHOOK_DOMAIN) {
  logger.info('🚀 Starting bot in POLLING mode (Local Development)...');
  bot.launch().catch(err => logger.error('Failed to launch polling:', err));
}

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
