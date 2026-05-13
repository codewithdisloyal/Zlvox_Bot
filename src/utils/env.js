require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  GROQ_API_KEYS: (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean),
  PORT: process.env.PORT || 3000,
  WEBHOOK_DOMAIN: process.env.WEBHOOK_DOMAIN || '',
  CHANNEL_ID: process.env.CHANNEL_ID || '@zlvoxai',
  CHANNEL_LINK: process.env.CHANNEL_LINK || 'https://t.me/zlvoxai',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
