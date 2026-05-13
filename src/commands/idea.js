const groqService = require('../services/groq.service');
const logger = require('../utils/logger');

module.exports = (bot) => {
  bot.command('idea', async (ctx) => {
    try {
      const loadingMessage = await ctx.reply('⏳ Generating a brilliant idea using Groq AI...');
      const idea = await groqService.generateViralIdea();
      await ctx.deleteMessage(loadingMessage.message_id).catch(() => {});
      await ctx.reply(`💡 *Here is your AI-generated idea:*\n\n${idea}`, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('Error in /idea command:', error);
      ctx.reply(`Sorry, I encountered an error: ${error.message}`);
    }
  });
};
