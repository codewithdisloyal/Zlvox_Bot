const zlvoxTools = require('../data/tools');
const logger = require('../utils/logger');

module.exports = (bot) => {
  bot.command('tools', (ctx) => {
    try {
      let message = "🛠️ *Explore ZLVOX Tools*\n\n";
      message += "Here are the professional tools available on our website:\n\n";
      
      zlvoxTools.forEach(categoryGroup => {
        message += `*${categoryGroup.category}*\n`;
        categoryGroup.tools.forEach(tool => {
          message += `• [${tool.name}](${tool.url})\n`;
        });
        message += `\n`;
      });

      message += "🔗 *Visit Website:* [zlvox.com](https://zlvox.com)";

      ctx.replyWithMarkdown(message, { disable_web_page_preview: true });
    } catch (error) {
      logger.error('Error in /tools command:', error);
      ctx.reply('Sorry, I could not fetch the tools right now.');
    }
  });
};

