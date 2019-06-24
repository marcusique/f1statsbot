const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup');

const mainScene = new Scene('mainScene');

mainScene.enter(ctx => {
  return ctx.reply(
    '🗂 Select from the menu below ⬇️',
    Markup.keyboard([['👱🏻‍♂️ Drivers', '🏎 Constructors'], ['🗓 Schedule']])
      .oneTime()
      .resize()
      .extra()
  );
});

module.exports = mainScene;
