const setupStart = require('./start');
const setupHelp = require('./help');
const setupIdea = require('./idea');
const setupTools = require('./tools');
const logger = require('../utils/logger');
const groqService = require('../services/groq.service');

const registerCommands = (bot) => {
  setupStart(bot);
  setupHelp(bot);
  setupIdea(bot);
  setupTools(bot);
  
  // Generic text handler (Fallback) connected to AI Service
  bot.on('text', async (ctx) => {
    try {
      const userText = ctx.message.text;
      const userId = ctx.from.id;
      
      await ctx.sendChatAction('typing');
      
      const response = await groqService.generateChatResponse(userText, userId);
      await ctx.reply(response, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('Error handling text message:', error);
      ctx.reply('Sorry, I encountered an error while processing your message.');
    }
  });
};

module.exports = {
  registerCommands
};
