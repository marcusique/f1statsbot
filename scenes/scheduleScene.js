const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  infoLogger = require('../middleware/infoLogger'),
  errorLogger = require('../middleware/errorLogger'),
  lib = require('../middleware/lib'),
  axios = require('axios'),
  dateFormat = require('dateformat'),
  keys = require('../config/keys'),
  { flag } = require('country-emoji'),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

const scheduleScene = new Scene('scheduleScene');
scheduleScene.enter(ctx => {
  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`
  });

  return ctx.reply(
    '🗓 Select from the menu below ⬇️',
    Markup.keyboard([
      ['🔜 Next Race'],
      [`🗓 Current Schedule (${currentYear})`],
      ['🗂 Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

scheduleScene.hears(`🗓 Current Schedule (${currentYear})`, ctx => {
  axios
    .all([
      axios.get(`${apiUrl}current.json`),
      axios.get(`${apiUrl}current/driverStandings.json`)
    ])
    .catch(err => {
      ctx.reply(
        `Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`
      );
      errorLogger.log({
        level: 'error',
        message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
          ctx.from.first_name
        } ${ctx.from.last_name}, MESSAGE_ID: ${
          ctx.message.message_id
        }, MESSAGE: ${ctx.message.text}, DATE: ${lib.returnDate(
          ctx.message.date
        )}, ERROR_MESSAGE: ${err.message}`
      });
    })
    .then(
      axios.spread((resSchedule, resStandings) => {
        const currentSchedule = resSchedule.data.MRData.RaceTable.Races;
        const racesCompleted = parseInt(
          resStandings.data.MRData.StandingsTable.StandingsLists[0].round
        );
        let preparedReply = [];
        for (let i = 0; i < currentSchedule.length; i++) {
          if (i < racesCompleted) {
            preparedReply.push(
              `✅${i + 1}. ${flag(
                currentSchedule[i].Circuit.Location.country
              )} ${currentSchedule[i].raceName} (${dateFormat(
                currentSchedule[i].date,
                'mmm dS'
              )})`
            );
          } else if (i === racesCompleted) {
            preparedReply.push(
              `➡️${i + 1}. ${flag(
                currentSchedule[i].Circuit.Location.country
              )} ${currentSchedule[i].raceName} (${dateFormat(
                currentSchedule[i].date,
                'mmm dS'
              )})`
            );
          } else {
            preparedReply.push(
              `${i + 1}. ${flag(currentSchedule[i].Circuit.Location.country)} ${
                currentSchedule[i].raceName
              } (${dateFormat(currentSchedule[i].date, 'mmm dS')})`
            );
          }
        }
        ctx.reply(
          `<b>Race Schedule for ${currentYear}:</b>\n\n${preparedReply.join(
            '\n'
          )}`,
          { parse_mode: 'HTML' }
        );
        ctx.scene.reenter();
      })
    );

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`
  });
});

scheduleScene.hears('🔜 Next Race', ctx => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then(res => {
      const lastRace = parseInt(res.data.MRData.RaceTable.round);
      const nextRace = lastRace + 1;
      const totalRaces = parseInt(res.data.MRData.total) + 1;
      if (nextRace <= totalRaces) {
        axios
          .get(`${apiUrl}current/${nextRace}.json`)
          .then(res => {
            const raceInfo = res.data.MRData.RaceTable;
            const gpWikiLink = raceInfo.Races[0].url;
            ctx.reply(
              `The next race is ${flag(
                raceInfo.Races[0].Circuit.Location.country
              )} ${raceInfo.Races[0].raceName} at ${
                raceInfo.Races[0].Circuit.circuitName
              }, starting at ${raceInfo.Races[0].time.substring(
                0,
                5
              )} UTC time on ${dateFormat(
                raceInfo.Races[0].date,
                'longDate'
              )} (Sunday).`,
              Markup.inlineKeyboard([
                Markup.urlButton('Wikipedia', `${gpWikiLink}`)
              ]).extra()
            );
            ctx.scene.reenter();
          })
          .catch(err => {
            ctx.reply(
              `Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`
            );

            errorLogger.log({
              level: 'error',
              message: `CHAT: ${ctx.from.id}, USERNAME: ${
                ctx.from.username
              }, NAME: ${ctx.from.first_name} ${
                ctx.from.last_name
              }, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
                ctx.message.text
              }, DATE: ${lib.returnDate(ctx.message.date)}, ERROR_MESSAGE: ${
                err.message
              }`
            });
          });
      } else {
        ctx.reply('Current season is over. See you next season ✊🏻');
      }
    })
    .catch(err => {
      ctx.reply(
        `Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`
      );

      errorLogger.log({
        level: 'error',
        message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
          ctx.from.first_name
        } ${ctx.from.last_name}, MESSAGE_ID: ${
          ctx.message.message_id
        }, MESSAGE: ${ctx.message.text}, DATE: ${lib.returnDate(
          ctx.message.date
        )}, ERROR_MESSAGE: ${err.message}`
      });
    });

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`
  });
});

scheduleScene.hears('🗂 Main Menu', ctx => {
  ctx.scene.leave('scheduleScene');
  ctx.scene.enter('mainScene');

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, DATE: ${lib.returnDate(ctx.message.date)}`
  });
});

module.exports = scheduleScene;
