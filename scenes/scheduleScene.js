const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  axios = require('axios'),
  dateFormat = require('dateformat'),
  keys = require('../config/keys'),
  { flag } = require('country-emoji'),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

const scheduleScene = new Scene('scheduleScene');
scheduleScene.enter(ctx => {
  return ctx.reply(
    '🗓 Select from the menu below ⬇️',
    Markup.keyboard([
      ['🔙 Previous Qualification', '🔙 Previous Race'],
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
          `<b>Race on Schedule for ${currentYear}:</b>\n\n${preparedReply.join(
            '\n'
          )}`,
          { parse_mode: 'HTML' }
        );
        ctx.scene.reenter();
      })
    );
});

scheduleScene.hears('🔙 Previous Race', ctx => {
  axios.get(`${apiUrl}current/last/results.json`).then(res => {
    const results = res.data.MRData.RaceTable.Races[0].Results;
    const raceName = res.data.MRData.RaceTable.Races[0].raceName;
    const gpName = res.data.MRData.RaceTable.Races[0].Circuit.Location.country;
    const wikiReportUrl = res.data.MRData.RaceTable.Races[0].url;
    let preparedReply = [];
    for (let i = 0; i < results.length; i++) {
      if (i === 0) {
        if (results[i].FastestLap.rank == 1) {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points}) (⏱ – ${results[i].FastestLap.Time.time})`
          );
        } else {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points}) 🥇`
          );
        }
      } else if (i === 1) {
        if (results[i].FastestLap.rank == 1) {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points}) (⏱ – ${results[i].FastestLap.Time.time})`
          );
        } else {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points}) 🥈`
          );
        }
      } else if (i === 2) {
        if (results[i].FastestLap.rank == 1) {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points}) (⏱ – ${results[i].FastestLap.Time.time})`
          );
        } else {
          preparedReply.push(
            `${i + 1}. ${results[i].Driver.givenName} ${
              results[i].Driver.familyName
            } (${results[i].points}) 🥉`
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
            console.log(err);
          });
      } else {
        ctx.reply('Current season is over. See you next season ✊🏻');
      }
    })
    .catch(err => {
      console.log(err);
    });
});

scheduleScene.hears('🔙 Previous Qualification', ctx => {
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
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

scheduleScene.hears('🗂 Main Menu', ctx => {
  ctx.scene.enter('mainScene');
});

module.exports = scheduleScene;
