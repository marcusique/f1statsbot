const { Telegraf, Markup, Stage, session } = require('telegraf'),
  // Markup = require('telegraf/markup'),
  // Stage = require('telegraf/stage'),
  // session = require('telegraf/session'),
  keys = require('./config/keys'),
  mainScene = require('./scenes/mainScene'),
  driversScene = require('./scenes/driversScene'),
  constructorsScene = require('./scenes/constructorsScene'),
  scheduleScene = require('./scenes/scheduleScene'),
  previousGrandPrixScene = require('./scenes/previousGrandPrixScene'),
  bot = new Telegraf(keys.telegramBotToken);

bot.use(session());

bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
  console.log(botInfo.username + ' is now running!');
});

// bot.command('k', (ctx) => {
//   return ctx.replyWithMarkdown('<b>Coke</b> or <i>Pepsi?</i>', {
//     parse_mode: 'HTML',
//     ...Markup.inlineKeyboard([
//       Markup.callbackButton('send', 'send')
//     ], { columns: 1 }).extra()
//   })
// })


/* Welcome Message */
bot.start((ctx) => {
  if (ctx.from.first_name) {
    ctx.reply(
      `Hi there, ${ctx.from.first_name} 👋🏻

I can help you to navigate in the world of Formula 1! 🏎 
Hit /help to learn more about me or go straight to the main menu by pressing the button below ⬇️`,
      Markup.keyboard([['🗂 Menu']])
        .oneTime()
        .resize()
        .extra()
    );
  } else {
    ctx.reply(
      `Hi there 👋🏻

I can help you to navigate in the world of Formula 1! 🏎 
Hit /help to learn more about me or go straight to the main menu by pressing the button below ⬇️`,
      Markup.keyboard([['🗂 Menu']])
        .oneTime()
        .resize()
        .extra()
    );
  }
});

/* Help Message */
bot.help((ctx) => {
  ctx.reply(`To navigate through my functionality, simply follow the menu buttons ☑️

As of today you I can:
👱🏻‍♂️ Get current driver standings
👱🏻‍♂️ Get driver standings for a given year
🏎 Get current constructor standings
🏎 Get constructor standings for a given year
⏮ Get previous qualification results
⏮ Get previous race results (with points and fastest lap)
⏮ Get previous race results (with gaps)
⏮ Get previous race results (with starting position)
🗓 Get next race schedule
🗓 Get schedule for current season

Hit /new to see changelog for the latest update.

If you are ready to start, hit the 🗂 Menu button below ⬇️

  `);
});

// Create scene manager
const stage = new Stage([mainScene, scheduleScene, driversScene, constructorsScene], { default: 'mainScene' });

// Scene registration
stage.register(mainScene);
stage.register(scheduleScene);
stage.register(driversScene);
stage.register(constructorsScene);
stage.register(previousGrandPrixScene);

// Middleware registration
bot.use(stage.middleware());
bot.use(mainScene);
bot.use(scheduleScene);
bot.use(driversScene);
bot.use(constructorsScene);
bot.use(previousGrandPrixScene);

bot.hears('🗂 Menu', (ctx) => {
  ctx.scene.enter('mainScene');
});

bot.command('new', (ctx) => {
  ctx.reply(`🤖 December 2020 update:

Added teams in driver standings; Fixed next race issue when the season is over

Hit /help to learn more about my features!
  `);
});

bot.command('cancel', (ctx) => {
  if (ctx.session.__scenes.current) {
    ctx.scene.leave(ctx.session.__scenes.current);
    ctx.reply('🛑 Action cancelled, returning to Main Menu 🗂');
    ctx.scene.enter('mainScene');
  } else {
    ctx.reply('🛑 Action cancelled, returning to Main Menu 🗂');
    ctx.scene.enter('mainScene');
  }
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('Graceful stop with SIGINT'));
process.once('SIGTERM', () => bot.stop('Graceful stop with SIGTERM'));

bot.launch();
