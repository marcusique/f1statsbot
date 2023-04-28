const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  Extra = require('telegraf/extra'),
  axios = require('axios'),
  dateFormat = require('dateformat'),
  keys = require('../config/keys'),
  { flag } = require('country-emoji'),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

/* Declare params for replies */
const extra = Extra.markup();
extra.parse_mode = 'HTML';
extra.webPreview(false);

const scheduleScene = new Scene('scheduleScene');
scheduleScene.enter((ctx) => {

  return ctx.reply(
    '🗓 Select from the menu below ⬇️',
    Markup.keyboard([['🔜 Next Race'], ['🗓 Current Schedule', '🗓 Historical Schedule'], ['🗂 Main Menu']])
      .oneTime()
      .resize()
      .extra()
  );
});

/* Current Schedule [START] */
scheduleScene.hears(`🗓 Current Schedule`, (ctx) => {
  axios
    .all([axios.get(`${apiUrl}current.json`), axios.get(`${apiUrl}current/driverStandings.json`)])
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
    })
    .then(
      axios.spread((resSchedule, resStandings) => {
        const currentSchedule = resSchedule.data.MRData.RaceTable.Races;
        const racesCompleted = parseInt(resStandings.data.MRData.StandingsTable.StandingsLists[0].round);
        const seasonYear = resSchedule.data.MRData.RaceTable.season;
        let preparedReply = [];

        for (let i = 0; i < currentSchedule.length; i++) {
          if (i < racesCompleted) {
            preparedReply.push(`✅${i + 1}. ${flag(currentSchedule[i].Circuit.Location.country)} ${currentSchedule[i].raceName} (${dateFormat(currentSchedule[i].date, 'mmm dS')})`);
          } else if (i === racesCompleted) {
            preparedReply.push(`➡️${i + 1}. ${flag(currentSchedule[i].Circuit.Location.country)} ${currentSchedule[i].raceName} (${dateFormat(currentSchedule[i].date, 'mmm dS')})`);
          } else {
            preparedReply.push(`${i + 1}. ${flag(currentSchedule[i].Circuit.Location.country)} ${currentSchedule[i].raceName} (${dateFormat(currentSchedule[i].date, 'mmm dS')})`);
          }
        }
        ctx.reply(`<b>Race Schedule for ${seasonYear}:</b>\n\n${preparedReply.join('\n')}`, extra);
        ctx.scene.reenter();
      })
    );
});
/* Current Schedule [END] */

/* Historical Schedule [START] */
scheduleScene.hears('🗓 Historical Schedule', (ctx) => {
  ctx.reply(`Enter a year between 1950 and ${currentYear} ⌨️ `);
});

scheduleScene.hears(/^[0-9]{4}$/, (ctx) => {
  ctx.scene.state = { value: ctx.message.text };
  if (ctx.scene.state.value >= 1950 && ctx.scene.state.value <= new Date().getFullYear()) {
    axios
      .get(`${apiUrl}${ctx.scene.state.value}.json`)
      .then((res) => {
        const races = res.data.MRData.RaceTable.Races;
        let preparedReply = [];

        for (let i = 0; i < races.length; i++) {
          preparedReply.push(
            `${i + 1}. ${flag(races[i].Circuit.Location.country)} ${races[i].raceName} (${races[i].Circuit.circuitName}) – ${dateFormat(races[i].date, 'mmmm dS, yyyy')}. <a href="${races[i].url
            }">Report</a>`
          );
        }
        ctx.reply(`<b>🗓 Historical Schedule for ${ctx.message.text}:</b> \n\n${preparedReply.join('\n')}`, extra);
        ctx.scene.reenter();
      })
      .catch((err) => {
        ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
      });
  } else {
    ctx.reply(`Enter a year between 1950 and ${currentYear} ⌨️ `);
  }
});
/* Historical Schedule [END] */

/* Next Race [START] */
scheduleScene.hears('🔜 Next Race', (ctx) => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then((res) => {
      const lastRace = parseInt(res.data.MRData.RaceTable.round);
      const nextRace = lastRace + 1;
      const totalRaces = parseInt(res.data.MRData.total) + 1;
      if (nextRace <= totalRaces) {
        axios
          .get(`${apiUrl}current/${nextRace}.json`)
          .then((res) => {
            const raceInfo = res.data.MRData.RaceTable;
            const gpWikiLink = raceInfo.Races[0].url;
            ctx.reply(
              `The next race is ${flag(raceInfo.Races[0].Circuit.Location.country)} ${raceInfo.Races[0].raceName} at ${raceInfo.Races[0].Circuit.circuitName
              }, starting at ${raceInfo.Races[0].time.substring(0, 5)} UTC time on ${dateFormat(raceInfo.Races[0].date, 'longDate')} (Sunday).`,
              Markup.inlineKeyboard([Markup.urlButton('Wikipedia', `${gpWikiLink}`)]).extra()
            );
            ctx.scene.reenter();
          })
          .catch((err) => {
            ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
          });
      } else {
        ctx.reply('Current season is over. See you next season ✊🏻');
        ctx.scene.reenter();
      }
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
    });
});

scheduleScene.hears('🗂 Main Menu', (ctx) => {
  ctx.scene.leave('scheduleScene');
  ctx.scene.enter('mainScene');
});
/* Next Race [END] */

module.exports = scheduleScene;
