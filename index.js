const Telegraf = require('telegraf'),
  Markup = require('telegraf/markup'),
  Stage = require('telegraf/stage'),
  session = require('telegraf/session'),
  keys = require('./config/keys'),
  mainScene = require('./scenes/mainScene'),
  driversScene = require('./scenes/driversScene'),
  constructorsScene = require('./scenes/constructorsScene'),
  scheduleScene = require('./scenes/scheduleScene'),
  bot = new Telegraf(keys.telegramBotToken);

bot.use(session());

/* Welcome Message */
bot.start(ctx => {
  ctx.reply(
    `Hi there, ${ctx.from.first_name} 👋🏻
I can help you to navigate in the world of Formula 1! 🏎 
Forget about checking race stats in browser, I will help you to get them much faster 💨
Hit /help to learn more about me or go straight to the main menu by pressing the button below ⬇️`,
    Markup.keyboard([['🗂 Menu']])
      .oneTime()
      .resize()
      .extra()
  );
});

/* Help Message */
bot.help(ctx => {
  ctx.reply(`To navigate through my functionality, simply follow the menu buttons ☑️
If you experience any troubles using me, hit /start every time something goes wrong. I am still learning, so don't be harsh on me 🙏🏻

⚠️ I don't support persistent sessions yet ☹️, so if my developer updates me – you will lose your session with me. In this case just hit /start and everything should be ok 👍🏻.

As of today you can 💪🏻:
👱🏻‍♂️ Get current driver standings
👱🏻‍♂️ Get driver standings by a given year
🏎 Get current constructor standings
🏎 Get constructor standings by a given year
🗓 Get previous qualification results
🗓 Get previous race results (including fastest lap)
🗓 Get next race schedule
🗓 Get schedule for current season

I constantly learn new stuff, so you might see new functionality as time goes by 📚

If you are ready to start, hit the 🗂 Menu button below ⬇️

  `);
});

// Create scene manager
const stage = new Stage();

// Scene registration
stage.register(mainScene);
stage.register(driversScene);
stage.register(constructorsScene);
stage.register(scheduleScene);

// Middleware registration
bot.use(stage.middleware());
bot.use(mainScene);
bot.use(driversScene);
bot.use(constructorsScene);
bot.use(scheduleScene);

bot.hears('🗂 Menu', ctx => ctx.scene.enter('mainScene'));

bot.launch();
