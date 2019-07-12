const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  infoLogger = require('../middleware/infoLogger'),
  errorLogger = require('../middleware/errorLogger'),
  axios = require('axios'),
  keys = require('../config/keys'),
  { flag } = require('country-emoji'),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

const previousGrandPrixScene = new Scene('previousGrandPrixScene');

previousGrandPrixScene.enter(ctx => {
  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });

  return ctx.reply(
    '⏮ Select from the menu below ⬇️',
    Markup.keyboard([
      ['⏮ Qualification Results'],
      ['⏮ Race Results (w/ fastest lap)'],
      ['⏮ Race Results (w/ gaps)'],
      ['⏮ Race Results (w/ starting position)'],
      ['🗂 Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

previousGrandPrixScene.hears('⏮ Qualification Results', ctx => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then(res => {
      const lastRace = res.data.MRData.RaceTable.round;
      axios
        .get(`${apiUrl}${currentYear}/${lastRace}/qualifying.json`)
        .then(res => {
          const raceName = res.data.MRData.RaceTable.Races[0].raceName;
          const gpName =
            res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
          const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
          const qualifyingResults =
            res.data.MRData.RaceTable.Races[0].QualifyingResults;
          let preparedReply = [];

          for (let i = 0; i < qualifyingResults.length; i++) {
            if (
              qualifyingResults[i].Q3 &&
              qualifyingResults[i].Q2 &&
              qualifyingResults[i].Q1
            ) {
              preparedReply.push(
                `${i + 1}. ${qualifyingResults[i].Driver.givenName} ${
                  qualifyingResults[i].Driver.familyName
                } (${qualifyingResults[i].Q3})`
              );
            } else if (qualifyingResults[i].Q2 && qualifyingResults[i].Q1) {
              preparedReply.push(
                `${i + 1}. ${qualifyingResults[i].Driver.givenName} ${
                  qualifyingResults[i].Driver.familyName
                } (${qualifyingResults[i].Q2})`
              );
            } else {
              preparedReply.push(
                `${i + 1}. ${qualifyingResults[i].Driver.givenName} ${
                  qualifyingResults[i].Driver.familyName
                } (${qualifyingResults[i].Q1})`
              );
            }
          }
          ctx.reply(
            `${flag(
              gpName
            )}${raceName} Qualification results: \n\n${preparedReply.join(
              '\n'
            )}`,
            Markup.inlineKeyboard([
              Markup.urlButton(
                'Grand Prix Report (Wikipedia)',
                `${wikiReportUrl}`
              )
            ]).extra()
          );
          ctx.scene.reenter();
        })
        .catch(err => {
          errorLogger.log({
            level: 'error',
            message: `CHAT: ${ctx.from.id}, USERNAME: ${
              ctx.from.username
            }, NAME: ${ctx.from.first_name} ${
              ctx.from.last_name
            }, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
              ctx.message.text
            }, TG_DATE: ${ctx.message.date}, ERROR_MESSAGE: ${err.message}`
          });
        });
    })
    .catch(err => {
      ctx.reply(
        `Oh snap! 🤖 We are either preparing the results 🕵🏻‍♂️ or there was an unfortunate error ❌. I've already notified my developer 👨🏻‍💻 Please try again later!`
      );

      errorLogger.log({
        level: 'error',
        message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
          ctx.from.first_name
        } ${ctx.from.last_name}, MESSAGE_ID: ${
          ctx.message.message_id
        }, MESSAGE: ${ctx.message.text}, TG_DATE: ${
          ctx.message.date
        }, ERROR_MESSAGE: ${err.message}`
      });
    });

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

previousGrandPrixScene.hears('🗂 Main Menu', ctx => {
  ctx.scene.leave('previousGrandPrix');
  ctx.scene.enter('mainScene');

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

previousGrandPrixScene.hears('⏮ Race Results (w/ fastest lap)', ctx => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then(res => {
      const results = res.data.MRData.RaceTable.Races[0].Results;
      const raceName = res.data.MRData.RaceTable.Races[0].raceName;
      const gpName =
        res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
      const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
      let preparedReply = [];
      for (let i = 0; i < results.length; i++) {
        if (i === 0) {
          if (results[i].FastestLap.rank && results[i].FastestLap.rank == 1) {
            preparedReply.push(
              `🥇 ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].points}) (⏱ – ${results[i].FastestLap.Time.time})`
            );
          } else {
            preparedReply.push(
              `🥇 ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].points})`
            );
          }
        } else if (i === 1) {
          if (results[i].FastestLap.rank && results[i].FastestLap.rank == 1) {
            preparedReply.push(
              `🥈 ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].points}) (⏱ – ${results[i].FastestLap.Time.time})`
            );
          } else {
            preparedReply.push(
              `🥈 ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].points})`
            );
          }
        } else if (i === 2) {
          if (results[i].FastestLap.rank && results[i].FastestLap.rank == 1) {
            preparedReply.push(
              `🥉 ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].points}) (⏱ – ${results[i].FastestLap.Time.time})`
            );
          } else {
            preparedReply.push(
              `🥉 ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].points})`
            );
          }
        } else if (results[i].FastestLap.rank == 1) {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points}) (⏱ – ${results[i].FastestLap.Time.time})`
          );
        } else {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points})`
          );
        }
      }
      ctx.reply(
        `${flag(gpName)}${raceName} results: \n\n${preparedReply.join('\n')}`,
        Markup.inlineKeyboard([
          Markup.urlButton('Grand Prix Report (Wikipedia)', `${wikiReportUrl}`)
        ]).extra()
      );
      ctx.scene.reenter();
    })
    .catch(err => {
      ctx.reply(
        `Oh snap! 🤖 We are either preparing the results 🕵🏻‍♂️ or there was an unfortunate error ❌. I've already notified my developer 👨🏻‍💻 Please try again later!`
      );

      errorLogger.log({
        level: 'error',
        message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
          ctx.from.first_name
        } ${ctx.from.last_name}, MESSAGE_ID: ${
          ctx.message.message_id
        }, MESSAGE: ${ctx.message.text}, TG_DATE: ${
          ctx.message.date
        }, ERROR_MESSAGE: ${err.message}`
      });
    });

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

previousGrandPrixScene.hears('⏮ Race Results (w/ gaps)', ctx => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then(res => {
      const results = res.data.MRData.RaceTable.Races[0].Results;
      const raceName = res.data.MRData.RaceTable.Races[0].raceName;
      const gpName =
        res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
      const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
      let preparedReply = [];
      for (let i = 0; i < results.length; i++) {
        if (i === 0) {
          preparedReply.push(
            `🥇 ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].Time.time})`
          );
        } else if (i === 1) {
          preparedReply.push(
            `🥈 ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].Time.time})`
          );
        } else if (i === 2) {
          preparedReply.push(
            `🥉 ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].Time.time})`
          );
        } else {
          if (results[i].Time) {
            preparedReply.push(
              `${i + 1}. ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].Time.time})`
            );
          } else {
            preparedReply.push(
              `${i + 1}. ${results[i].Driver.givenName} ${
                results[i].Driver.familyName
              } (${results[i].status})`
            );
          }
        }
      }
      ctx.reply(
        `${flag(
          gpName
        )}${raceName} results (with gaps): \n\n${preparedReply.join('\n')}`,
        Markup.inlineKeyboard([
          Markup.urlButton('Grand Prix Report (Wikipedia)', `${wikiReportUrl}`)
        ]).extra()
      );
      ctx.scene.reenter();
    })
    .catch(err => {
      ctx.reply(
        `Oh snap! 🤖 We are either preparing the results 🕵🏻‍♂️ or there was an unfortunate error ❌. I've already notified my developer 👨🏻‍💻 Please try again later!`
      );

      errorLogger.log({
        level: 'error',
        message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
          ctx.from.first_name
        } ${ctx.from.last_name}, MESSAGE_ID: ${
          ctx.message.message_id
        }, MESSAGE: ${ctx.message.text}, TG_DATE: ${
          ctx.message.date
        }, ERROR_MESSAGE: ${err.message}`
      });
    });

  infoLogger.log({
    level: 'info',
    message: `CHAT: ${ctx.from.id}, USERNAME: ${ctx.from.username}, NAME: ${
      ctx.from.first_name
    } ${ctx.from.last_name}, MESSAGE_ID: ${ctx.message.message_id}, MESSAGE: ${
      ctx.message.text
    }, TG_DATE: ${ctx.message.date}`
  });
});

previousGrandPrixScene.hears('⏮ Race Results (w/ starting position)', ctx => {
  ctx.reply('starting position');
});

module.exports = previousGrandPrixScene;
