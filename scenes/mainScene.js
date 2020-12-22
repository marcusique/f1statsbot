const Scene = require("telegraf/scenes/base"),
  Markup = require("telegraf/markup"),
  lib = require("../middleware/lib");

const mainScene = new Scene("mainScene");

mainScene.enter((ctx) => {
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);

  return ctx.reply(
    "🗂 Select from the menu below ⬇️",
    Markup.keyboard([
      ["👱🏻‍♂️ Drivers", "🏎 Constructors"],
      ["🗓 Schedule", "⏮ Previous Grand Prix"],
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

mainScene.hears("👱🏻‍♂️ Drivers", (ctx) => {
  ctx.scene.enter("driversScene");
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

mainScene.hears("🏎 Constructors", (ctx) => {
  ctx.scene.enter("constructorsScene");
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

mainScene.hears("🗓 Schedule", (ctx) => {
  ctx.scene.enter("scheduleScene");
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

mainScene.hears("⏮ Previous Grand Prix", (ctx) => {
  ctx.scene.enter("previousGrandPrixScene");
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

mainScene.hears(/^[0-9]{4}$/, (ctx) => {
  ctx.reply(`${ctx.from.first_name}, select from the menu below ⬇️`);
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

module.exports = mainScene;
