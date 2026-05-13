const { Markup } = require('telegraf');
const groqService = require('../services/groq.service');
const logger = require('../utils/logger');

const IDEAS_CATEGORIES = [
  { name: '🚀 SaaS Ideas', id: 'saas' },
  { name: '🎥 YouTube Shorts', id: 'yt_shorts' },
  { name: '📸 Instagram Reels', id: 'ig_reels' },
  { name: '💼 LinkedIn Posts', id: 'linkedin' },
  { name: '📝 Blog Post Titles', id: 'blog' },
  { name: '💻 Programming Projects', id: 'coding' },
  { name: '🐦 X Threads', id: 'x_threads' },
  { name: '💰 Digital Products', id: 'digital_prod' },
  { name: '📧 Newsletter Topics', id: 'newsletter' },
  { name: '🎙️ Podcast Episodes', id: 'podcast' },
  { name: '🎵 TikTok Trends', id: 'tiktok' },
  { name: '🧩 Chrome Extensions', id: 'chrome_ext' },
  { name: '🤖 Discord Bot Ideas', id: 'discord_bot' },
  { name: '📱 Mobile App Ideas', id: 'mobile_app' },
  { name: '🛒 E-commerce Niches', id: 'ecommerce' },
  { name: '🧠 AI Tool Ideas', id: 'ai_tools' },
  { name: '🤝 Freelance Services', id: 'freelance' },
  { name: '📖 Tutorial Series', id: 'tutorials' },
  { name: '📣 Marketing Ideas', id: 'marketing' },
  { name: '🎢 Startup Pitches', id: 'startup' }
];

module.exports = (bot) => {
  // Command to show categories
  bot.command('idea', async (ctx) => {
    try {
      const keyboard = Markup.inlineKeyboard(
        IDEAS_CATEGORIES.map(cat => Markup.button.callback(cat.name, `gen_idea:${cat.id}`)),
        { columns: 2 }
      );

      await ctx.reply('💡 *What kind of viral idea do you need?*\nSelect a category below:', {
        parse_mode: 'Markdown',
        ...keyboard
      });
    } catch (error) {
      logger.error('Error in /idea command:', error);
      ctx.reply('Sorry, I could not load the categories.');
    }
  });

  // Handle category selection
  bot.action(/^gen_idea:(.+)$/, async (ctx) => {
    const categoryId = ctx.match[1];
    const category = IDEAS_CATEGORIES.find(c => c.id === categoryId);
    
    if (!category) return ctx.answerCbQuery('Category not found!');

    try {
      await ctx.answerCbQuery(`Generating ${category.name} idea...`);
      
      const loadingMsg = await ctx.reply(`⏳ *Generating a brilliant idea for:* ${category.name}...`, { parse_mode: 'Markdown' });
      
      const idea = await groqService.generateViralIdea(category.name);
      
      await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
      await ctx.reply(`💡 *Category: ${category.name}*\n\n${idea}`, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error(`Error generating idea for ${categoryId}:`, error);
      ctx.reply('Sorry, I encountered an error while generating your idea.');
    }
  });
};

