const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  lib = require('../middleware/lib'),
  axios = require('axios'),
  keys = require('../config/keys'),
  { flag } = require('country-emoji'),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

const previousGrandPrixScene = new Scene('previousGrandPrixScene');

previousGrandPrixScene.enter((ctx) => {
  lib.logEvent('info', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);

  return ctx.reply(
    '⏮ Select from the menu below ⬇️',
    Markup.keyboard([['⏮ Qualification Results'], ['⏮ Race Results (w/ points & fastest lap)'], ['⏮ Race Results (w/ gaps)'], ['⏮ Race Results (gained/lost)'], ['🗂 Main Menu']])
      .oneTime()
      .resize()
      .extra()
  );
});

previousGrandPrixScene.hears('⏮ Qualification Results', (ctx) => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then((res) => {
      const lastRace = res.data.MRData.RaceTable.round;
      const seasonYear = res.data.MRData.RaceTable.season;
      
      axios
        .get(`${apiUrl}${seasonYear}/${lastRace}/qualifying.json`)
        .then((res) => {
          const raceName = res.data.MRData.RaceTable.Races[0].raceName;
          const gpName = res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
          const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
          const qualifyingResults = res.data.MRData.RaceTable.Races[0].QualifyingResults;
          let preparedReply = [];

          for (let i = 0; i < qualifyingResults.length; i++) {
            if (qualifyingResults[i].Q3 && qualifyingResults[i].Q2 && qualifyingResults[i].Q1) {
              preparedReply.push(
                `${i + 1}. ${qualifyingResults[i].Driver.givenName} ${qualifyingResults[i].Driver.familyName} ${flag(qualifyingResults[i].Driver.nationality)} (${
                  qualifyingResults[i].Q3
                })`
              );
            } else if (qualifyingResults[i].Q2 && qualifyingResults[i].Q1) {
              preparedReply.push(
                `${i + 1}. ${qualifyingResults[i].Driver.givenName} ${qualifyingResults[i].Driver.familyName} ${flag(qualifyingResults[i].Driver.nationality)} (${
                  qualifyingResults[i].Q2
                })`
              );
            } else {
              preparedReply.push(
                `${i + 1}. ${qualifyingResults[i].Driver.givenName} ${qualifyingResults[i].Driver.familyName} ${flag(qualifyingResults[i].Driver.nationality)} (${
                  qualifyingResults[i].Q1
                })`
              );
            }
          }
          ctx.reply(
            `${flag(gpName)}${raceName} Qualification results: \n\n${preparedReply.join('\n')}`,
            Markup.inlineKeyboard([Markup.urlButton('Grand Prix Report (Wikipedia)', `${wikiReportUrl}`)]).extra()
          );
          ctx.scene.reenter();
        })
        .catch((err) => {
          lib.logEvent('error', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, err.message);
          ctx.scene.reenter();
        });
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
      lib.logEvent('error', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, err.message);
    });
  lib.logEvent('info', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

previousGrandPrixScene.hears('⏮ Race Results (w/ points & fastest lap)', (ctx) => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then((res) => {
      const results = res.data.MRData.RaceTable.Races[0].Results;
      const raceName = res.data.MRData.RaceTable.Races[0].raceName;
      const gpName = res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
      const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
      let preparedReply = [];
      for (let i = 0; i < results.length; i++) {
        if (i === 0) {
          if (results[i].FastestLap && results[i].FastestLap.rank == 1) {
            preparedReply.push(
              `🥇 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points}) (⏱ – ${
                results[i].FastestLap.Time.time
              })`
            );
          } else {
            preparedReply.push(`🥇 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points})`);
          }
        } else if (i === 1) {
          if (results[i].FastestLap && results[i].FastestLap.rank == 1) {
            preparedReply.push(
              `🥈 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points}) (⏱ – ${
                results[i].FastestLap.Time.time
              })`
            );
          } else {
            preparedReply.push(`🥈 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points})`);
          }
        } else if (i === 2) {
          if (results[i].FastestLap && results[i].FastestLap.rank == 1) {
            preparedReply.push(
              `🥉 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points}) (⏱ – ${
                results[i].FastestLap.Time.time
              })`
            );
          } else {
            preparedReply.push(`🥉 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points})`);
          }
        } else {
          if (results[i].FastestLap && results[i].FastestLap.rank == 1) {
            preparedReply.push(
              `${i + 1}. ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points}) (⏱ – ${
                results[i].FastestLap.Time.time
              })`
            );
          } else {
            preparedReply.push(`${i + 1}. ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].points})`);
          }
        }
      }
      ctx.reply(
        `${flag(gpName)}${raceName} results: \n\n${preparedReply.join('\n')}`,
        Markup.inlineKeyboard([Markup.urlButton('Grand Prix Report (Wikipedia)', `${wikiReportUrl}`)]).extra()
      );
      ctx.scene.reenter();
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
      lib.logEvent('error', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, err.message);
    });
  lib.logEvent('info', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

previousGrandPrixScene.hears('⏮ Race Results (w/ gaps)', (ctx) => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then((res) => {
      const results = res.data.MRData.RaceTable.Races[0].Results;
      const raceName = res.data.MRData.RaceTable.Races[0].raceName;
      const gpName = res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
      const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
      let preparedReply = [];
      for (let i = 0; i < results.length; i++) {
        if (i === 0) {
          preparedReply.push(`🥇 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].Time.time})`);
        } else if (i === 1) {
          preparedReply.push(`🥈 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].Time.time})`);
        } else if (i === 2) {
          preparedReply.push(`🥉 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].Time.time})`);
        } else {
          if (results[i].Time) {
            preparedReply.push(`${i + 1}. ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].Time.time})`);
          } else {
            preparedReply.push(`${i + 1}. ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} (${results[i].status})`);
          }
        }
      }
      ctx.reply(
        `${flag(gpName)}${raceName} results (with gaps): \n\n${preparedReply.join('\n')}`,
        Markup.inlineKeyboard([Markup.urlButton('Grand Prix Report (Wikipedia)', `${wikiReportUrl}`)]).extra()
      );
      ctx.scene.reenter();
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
      lib.logEvent('error', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, err.message);
    });
  lib.logEvent('info', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

previousGrandPrixScene.hears('⏮ Race Results (gained/lost)', (ctx) => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then((res) => {
      const results = res.data.MRData.RaceTable.Races[0].Results;
      const raceName = res.data.MRData.RaceTable.Races[0].raceName;
      const gpName = res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
      const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
      let preparedReply = [];

      for (let i = 0; i < results.length; i++) {
        if (i === 0) {
          if (results[i].grid == 0 || i + 1 < results[i].grid) {
            preparedReply.push(`🥇 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤴️ from ${results[i].grid}`);
          } else if (i + 1 > results[i].grid && results[i].grid != 0) {
            preparedReply.push(`🥇 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤵️ from ${results[i].grid}`);
          } else {
            preparedReply.push(`🥇 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⬅️ from ${results[i].grid}`);
          }
        } else if (i === 1) {
          if (results[i].grid == 0 || i + 1 < results[i].grid) {
            preparedReply.push(`🥈 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤴️ from ${results[i].grid}`);
          } else if (i + 1 > results[i].grid && results[i].grid != 0) {
            preparedReply.push(`🥈 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤵️ from ${results[i].grid}`);
          } else {
            preparedReply.push(`🥇 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⬅️ from ${results[i].grid}`);
          }
        } else if (i === 2) {
          if (results[i].grid == 0 || i + 1 < results[i].grid) {
            preparedReply.push(`🥉 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤴️ from ${results[i].grid}`);
          } else if (i + 1 > results[i].grid && results[i].grid != 0) {
            preparedReply.push(`🥉 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤵️ from ${results[i].grid}`);
          } else {
            preparedReply.push(`🥉 ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⬅️ from ${results[i].grid}`);
          }
        } else {
          if (results[i].grid == 0 || i + 1 < results[i].grid) {
            preparedReply.push(`${i + 1}. ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤴️ from ${results[i].grid}`);
          } else if (i + 1 > results[i].grid && results[i].grid != 0) {
            preparedReply.push(`${i + 1}. ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⤵️ from ${results[i].grid}`);
          } else {
            preparedReply.push(`${i + 1}. ${results[i].Driver.givenName} ${results[i].Driver.familyName} ${flag(results[i].Driver.nationality)} ⬅️ from ${results[i].grid}`);
          }
        }
      }
      ctx.reply(
        `${flag(gpName)}${raceName} results (gained/lost): \n\n${preparedReply.join('\n')}`,
        Markup.inlineKeyboard([Markup.urlButton('Grand Prix Report (Wikipedia)', `${wikiReportUrl}`)]).extra()
      );
      ctx.scene.reenter();
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
      lib.logEvent('error', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, err.message);
    });
  lib.logEvent('info', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

previousGrandPrixScene.hears('🗂 Main Menu', (ctx) => {
  ctx.scene.leave('previousGrandPrix');
  ctx.scene.enter('mainScene');
  lib.logEvent('info', ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name, ctx.message.message_id, ctx.message.text, ctx.message.date, null);
});

module.exports = previousGrandPrixScene;
