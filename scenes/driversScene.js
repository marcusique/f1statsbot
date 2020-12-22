const Scene = require("telegraf/scenes/base"),
  Markup = require("telegraf/markup"),
  errorLogger = require("../middleware/errorLogger"),
  lib = require("../middleware/lib"),
  axios = require("axios"),
  { flag } = require("country-emoji"),
  keys = require("../config/keys"),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

const driversScene = new Scene("driversScene");

driversScene.enter((ctx) => {
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);

  return ctx.reply(
    "👱🏻‍♂️ Select from the menu below ⬇️",
    Markup.keyboard([["🏆 Current Standings", "🏆 Current Standings w/ teams"], ["🎖 Standings by year"], ["🗂 Main Menu"]])
      .oneTime()
      .resize()
      .extra()
  );
});

/* 🏅 Current Standings (Drivers only) [START] */
driversScene.hears(`🏆 Current Standings`, (ctx) => {
  axios
    .get(`${apiUrl}current/driverStandings.json`)
    .then((res) => {
      const numOfLastRace = res.data.MRData.StandingsTable.StandingsLists[0].round;
      const driverStandings = res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      let preparedReply = [];
      for (let i = 0; i < driverStandings.length; i++) {
        if (i === 0) {
          preparedReply.push(`🥇 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} ${flag(driverStandings[i].Driver.nationality)} (${driverStandings[i].points})`);
        } else if (i === 1) {
          preparedReply.push(`🥈 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} ${flag(driverStandings[i].Driver.nationality)} (${driverStandings[i].points})`);
        } else if (i === 2) {
          preparedReply.push(`🥉 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} ${flag(driverStandings[i].Driver.nationality)} (${driverStandings[i].points})`);
        } else {
          preparedReply.push(`${i + 1}. ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} ${flag(driverStandings[i].Driver.nationality)} (${driverStandings[i].points})`);
        }
      }
      ctx.reply(`<b>🏆 Current Driver standings after ${numOfLastRace} race(s):</b> \n\n${preparedReply.join("\n")}`, { parse_mode: "HTML" });
      ctx.scene.reenter();
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
      errorLogger.log({
        level: "error",
        message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${ctx.from.first_name} ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
          ctx.message.text
        }, DATE: ${lib.returnDate(ctx.message.date)}, ERROR_MESSAGE: ${err.message}`,
      });
    });
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});
/* 🏅 Current Standings (Drivers only) [END] */

/* 🏅 Current Standings (Drivers + Teams) [START] */
driversScene.hears("🏆 Current Standings w/ teams", (ctx) => {
  axios
    .get(`${apiUrl}current/driverStandings.json`)
    .then((res) => {
      const numOfLastRace = res.data.MRData.StandingsTable.StandingsLists[0].round;
      const driverStandings = res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      let preparedReply = [];
      for (let i = 0; i < driverStandings.length; i++) {
        if (i === 0) {
          preparedReply.push(
            `🥇 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
              driverStandings[i].points
            })`
          );
        } else if (i === 1) {
          preparedReply.push(
            `🥈 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
              driverStandings[i].points
            })`
          );
        } else if (i === 2) {
          preparedReply.push(
            `🥉 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
              driverStandings[i].points
            })`
          );
        } else {
          preparedReply.push(
            `${i + 1}. ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
              driverStandings[i].points
            })`
          );
        }
      }
      ctx.reply(`<b>🏆 Current Driver standings after ${numOfLastRace} race(s):</b> \n\n${preparedReply.join("\n")}`, { parse_mode: "HTML" });
      ctx.scene.reenter();
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
      errorLogger.log({
        level: "error",
        message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${ctx.from.first_name} ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
          ctx.message.text
        }, DATE: ${lib.returnDate(ctx.message.date)}, ERROR_MESSAGE: ${err.message}`,
      });
    });
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

/* 🏅 Current Standings (Drivers + Teams) [END] */

/* Standings by Year [START] */
driversScene.hears("🎖 Standings by year", (ctx) => {
  ctx.reply(`Enter a year between 1950 and ${currentYear} ⌨️ `);
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

driversScene.hears(/^[0-9]{4}$/, (ctx) => {
  ctx.scene.state = { value: ctx.message.text };
  if (ctx.scene.state.value >= 1950 && ctx.scene.state.value <= new Date().getFullYear()) {
    axios
      .get(`${apiUrl}${ctx.scene.state.value}/driverStandings.json`)
      .then((res) => {
        const driverStandings = res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        let preparedReply = [];
        for (let i = 0; i < driverStandings.length; i++) {
          if (i === 0) {
            preparedReply.push(
              `🥇 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
                driverStandings[i].points
              })`
            );
          } else if (i === 1) {
            preparedReply.push(
              `🥈 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
                driverStandings[i].points
              })`
            );
          } else if (i === 2) {
            preparedReply.push(
              `🥉 ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
                driverStandings[i].points
              })`
            );
          } else {
            preparedReply.push(
              `${i + 1}. ${driverStandings[i].Driver.givenName} ${driverStandings[i].Driver.familyName} (${driverStandings[i].Constructors[0].name}) ${flag(driverStandings[i].Driver.nationality)} (${
                driverStandings[i].points
              })`
            );
          }
        }
        ctx.reply(`<b>🎖 Driver Standings in ${ctx.message.text}:</b> \n\n${preparedReply.join("\n")}`, { parse_mode: "HTML" });
        ctx.scene.reenter();
      })
      .catch((err) => {
        ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);

        errorLogger.log({
          level: "error",
          message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${ctx.from.first_name} ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
            ctx.message.text
          }, DATE: ${lib.returnDate(ctx.message.date)}, ERROR_MESSAGE: ${err.message}`,
        });
      });
  } else {
    ctx.reply(`Enter a year between 1950 and ${currentYear} ⌨️ `);
  }

  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});
/* Standings by Year (Drivers only) [END] */

driversScene.hears("🗂 Main Menu", (ctx) => {
  ctx.scene.leave("driversScene");
  ctx.scene.enter("mainScene");
  lib.logEvent("info", ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

module.exports = driversScene;
