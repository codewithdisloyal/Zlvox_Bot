const { Telegraf } = require('telegraf');
const config = require('../utils/env');
const logger = require('../utils/logger');
const { registerCommands } = require('../commands');

if (!config.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided! Check your .env file.');
}

const bot = new Telegraf(config.BOT_TOKEN);

// Global Error Handling
bot.catch((err, ctx) => {
  logger.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// Register all commands
registerCommands(bot);

module.exports = bot;
