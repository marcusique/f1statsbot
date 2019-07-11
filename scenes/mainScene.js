const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  infoLogger = require('../middleware/infoLogger');

const mainScene = new Scene('mainScene');

mainScene.enter(ctx => {
  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });

  return ctx.reply(
    '🗂 Select from the menu below ⬇️',
    Markup.keyboard([
      ['👱🏻‍♂️ Drivers', '🏎 Constructors'],
      ['🗓 Schedule', '⏮ Previous Grand Prix']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

mainScene.hears('👱🏻‍♂️ Drivers', ctx => {
  ctx.scene.enter('driversScene');

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

mainScene.hears('🏎 Constructors', ctx => {
  ctx.scene.enter('constructorsScene');

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

mainScene.hears('🗓 Schedule', ctx => {
  ctx.scene.enter('scheduleScene');

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

mainScene.hears('⏮ Previous Grand Prix', ctx => {
  ctx.scene.enter('previousGrandPrixScene');

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

mainScene.hears(/^[0-9]{4}$/, ctx => {
  ctx.reply(`${ctx.from.first_name}, select from the menu below ⬇️`);

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

module.exports = mainScene;
