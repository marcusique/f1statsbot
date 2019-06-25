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

mainScene.hears('👱🏻‍♂️ Drivers', ctx => ctx.scene.enter('driversScene'));
mainScene.hears('🏎 Constructors', ctx => ctx.scene.enter('constructorsScene'));
mainScene.hears('🗓 Schedule', ctx => ctx.scene.enter('scheduleScene'));

module.exports = mainScene;
