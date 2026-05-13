const aiTools = require('../data/tools');
const logger = require('../utils/logger');

module.exports = (bot) => {
  bot.command('tools', (ctx) => {
    try {
      let message = "*🛠️ Top AI Tools by Category*\n\n";
      
      aiTools.forEach(categoryGroup => {
        message += `*${categoryGroup.category}*\n`;
        categoryGroup.tools.forEach(tool => {
          message += `• *${tool.name}*: ${tool.description}\n`;
        });
        message += `\n`;
      });

      ctx.replyWithMarkdown(message);
    } catch (error) {
      logger.error('Error in /tools command:', error);
      ctx.reply('Sorry, I could not fetch the tools right now.');
    }
  });
};
