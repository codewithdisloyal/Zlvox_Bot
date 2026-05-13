module.exports = (bot) => {
  bot.help((ctx) => {
    const helpMessage = `
*Available Commands:*
/start - Restart the bot
/help - Show this help message
/idea - Get a random viral content idea 💡
/tools - Discover top AI tools 🛠️

More features coming soon!
    `;
    ctx.replyWithMarkdown(helpMessage);
  });
};
