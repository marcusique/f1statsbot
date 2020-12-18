const Telegraf = require('telegraf'),
  Markup = require('telegraf/markup'),
  Stage = require('telegraf/stage'),
  session = require('telegraf/session'),
  infoLogger = require('./middleware/infoLogger'),
  lib = require('./middleware/lib'),
  keys = require('./config/keys'),
  mainScene = require('./scenes/mainScene'),
  driversScene = require('./scenes/driversScene'),
  constructorsScene = require('./scenes/constructorsScene'),
  scheduleScene = require('./scenes/scheduleScene'),
  previousGrandPrixScene = require('./scenes/previousGrandPrixScene'),
  bot = new Telegraf(keys.telegramBotToken);

bot.use(session());

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
  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`,
  });
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

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`,
  });
});

// Create scene manager
const stage = new Stage(
  [mainScene, scheduleScene, driversScene, constructorsScene],
  { default: 'mainScene' }
);

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

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`,
  });
});

bot.command('new', (ctx) => {
  ctx.reply(`🤖 December 2020 update:

Added teams in driver standings; Fixed next race issue when the season is over

Hit /help to learn more about my features!
  `);

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`,
  });
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

bot.launch();
