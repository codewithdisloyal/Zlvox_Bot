const growthService = require('../services/growth.service');
const config = require('../utils/env');

module.exports = (bot) => {
  bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const userName = ctx.from?.first_name || 'User';
    
    // 1. Referral Logic (ctx.payload contains anything after /start <payload>)
    const referralCode = ctx.payload;
    if (referralCode) {
      await growthService.processReferral(userId, referralCode);
    }

    // 2. Channel Subscription Check
    const isSubscribed = await growthService.isUserSubscribedToChannel(ctx, userId);
    
    if (!isSubscribed) {
      return ctx.reply(
        `👋 Hello ${userName}!\n\nTo use this bot, you must join our official channel first.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '📢 Join Our Channel', url: config.CHANNEL_LINK }],
              [{ text: '✅ I have joined', callback_data: 'check_subscription' }]
            ]
          }
        }
      );
    }

    // 3. Normal Welcome if subscribed
    ctx.reply(`Welcome to ZLVOX Telegram Bot, ${userName}! 🚀\n\nI am currently in development. Use /help to see what I can do.`);
  });

  // Action handler for the "I have joined" button
  bot.action('check_subscription', async (ctx) => {
    const userId = ctx.from.id;
    const isSubscribed = await growthService.isUserSubscribedToChannel(ctx, userId);

    if (isSubscribed) {
      await ctx.answerCbQuery('Thank you for joining!');
      await ctx.editMessageText('✅ Subscription verified!\n\nWelcome to ZLVOX Telegram Bot! 🚀\nUse /help to see what I can do.');
    } else {
      await ctx.answerCbQuery('⚠️ You have not joined the channel yet.', { show_alert: true });
    }
  });
};
