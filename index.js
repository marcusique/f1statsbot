const Telegraf = require('telegraf'),
  Markup = require('telegraf/markup'),
  Stage = require('telegraf/stage'),
  session = require('telegraf/session'),
  Scene = require('telegraf/scenes/base'),
  keys = require('./config/keys'),
  apiUrl = keys.apiUrl,
  { flag } = require('country-emoji'),
  axios = require('axios'),
  dateFormat = require('dateformat'),
  currentYear = new Date().getFullYear(),
  bot = new Telegraf(keys.telegramBotToken);

bot.use(session());

/* Welcome Message */
bot.start(ctx => {
  ctx.reply(
    `Hi there, ${ctx.from.first_name} 👋🏻
I can help you to navigate in the world of Formula 1! 🏎 
Forget about checking race stats in browser, I will help you to get them much faster 💨
Hit /help to learn more about me or go straight to the main menu by pressing the button below ⬇️`,
    Markup.keyboard([['🗂 Menu']])
      .oneTime()
      .resize()
      .extra()
  );
});

/* Help Message */
bot.help(ctx => {
  ctx.reply(`To navigate through my functionality, simply follow the menu buttons ☑️
If you experience any troubles using me, hit /start every time something goes wrong. I am still learning, so don't be harsh on me 🙏🏻

⚠️ I don't support persistent sessions yet ☹️, so if my developer updates me – you will lose your session with me. In this case just hit /start and everything should be ok 👍🏻.

As of today you can 💪🏻:
👱🏻‍♂️ Get current driver standings
👱🏻‍♂️ Get driver standings by a given year
🏎 Get current constructor standings
🏎 Get constructor standings by a given year
🗓 Get previous qualification results
🗓 Get previous race results (including fastest lap)
🗓 Get next race schedule
🗓 Get schedule for current season

I constantly learn new stuff, so you might see new functionality as time goes by 📚

If you are ready to start, hit the 🗂 Menu button below ⬇️

  `);
});

/*Main Menu Scene [START]*/
const mainMenu = new Scene('menu');
mainMenu.enter(ctx => {
  return ctx.reply(
    '🗂 Select from the menu below ⬇️',
    Markup.keyboard([['👱🏻‍♂️ Drivers', '🏎 Constructors'], ['🗓 Schedule']])
      .oneTime()
      .resize()
      .extra()
  );
});
/*Main Menu Scene [END]*/

/*Drivers Scene [START]*/
const drivers = new Scene('drivers');
drivers.enter(ctx => {
  return ctx.reply(
    '👱🏻‍♂️ Select from the menu below ⬇️',
    Markup.keyboard([
      [`🏅  Current Standings (${currentYear})`, '🎖 Standings by year'],
      ['🗂 Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

/* 🏅 Current Standings [START] */
drivers.hears(`🏅  Current Standings (${currentYear})`, ctx => {
  axios
    .get(`${apiUrl}current/driverStandings.json`)
    .then(res => {
      const numOfLastRace =
        res.data.MRData.StandingsTable.StandingsLists[0].round;
      const driverStandings =
        res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      let preparedReply = [];
      for (let i = 0; i < driverStandings.length; i++) {
        if (i === 0) {
          preparedReply.push(
            i +
              1 +
              '. ' +
              driverStandings[i].Driver.givenName +
              ' ' +
              driverStandings[i].Driver.familyName +
              ` (${driverStandings[i].points}) 🥇`
          );
        } else if (i === 1) {
          preparedReply.push(
            i +
              1 +
              '. ' +
              driverStandings[i].Driver.givenName +
              ' ' +
              driverStandings[i].Driver.familyName +
              ` (${driverStandings[i].points}) 🥈`
          );
        } else if (i === 2) {
          preparedReply.push(
            i +
              1 +
              '. ' +
              driverStandings[i].Driver.givenName +
              ' ' +
              driverStandings[i].Driver.familyName +
              ` (${driverStandings[i].points}) 🥉`
          );
        } else {
          preparedReply.push(
            i +
              1 +
              '. ' +
              driverStandings[i].Driver.givenName +
              ' ' +
              driverStandings[i].Driver.familyName +
              ` (${driverStandings[i].points})`
          );
        }
      }
      ctx.reply(
        `<b>Current Driver standings after ${numOfLastRace} race(s):</b> \n\n${preparedReply.join(
          '\n'
        )}`,
        { parse_mode: 'HTML' }
      );
      ctx.scene.reenter();
    })
    .catch(err => {
      console.log(err);
    });
});
/* 🏅 Current Standings [END] */

/* Standings by Year [START] */
drivers.hears('🎖 Standings by year', ctx => {
  ctx.reply(`Enter a year between 1950 and ${currentYear} ⌨️ `);
  drivers.on('text', ctx => {
    ctx.scene.state = { value: ctx.message.text };
    if (
      ctx.scene.state.value >= 1950 &&
      ctx.scene.state.value <= new Date().getFullYear()
    ) {
      axios
        .get(`${apiUrl}${ctx.scene.state.value}/driverStandings.json`)
        .then(res => {
          const driverStandings =
            res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
          let preparedReply = [];
          for (let i = 0; i < driverStandings.length; i++) {
            if (i === 0) {
              preparedReply.push(
                i +
                  1 +
                  '. ' +
                  driverStandings[i].Driver.givenName +
                  ' ' +
                  driverStandings[i].Driver.familyName +
                  ` (${driverStandings[i].points}) 🥇`
              );
            } else if (i === 1) {
              preparedReply.push(
                i +
                  1 +
                  '. ' +
                  driverStandings[i].Driver.givenName +
                  ' ' +
                  driverStandings[i].Driver.familyName +
                  ` (${driverStandings[i].points}) 🥈`
              );
            } else if (i === 2) {
              preparedReply.push(
                i +
                  1 +
                  '. ' +
                  driverStandings[i].Driver.givenName +
                  ' ' +
                  driverStandings[i].Driver.familyName +
                  ` (${driverStandings[i].points}) 🥉`
              );
            } else {
              preparedReply.push(
                i +
                  1 +
                  '. ' +
                  driverStandings[i].Driver.givenName +
                  ' ' +
                  driverStandings[i].Driver.familyName +
                  ` (${driverStandings[i].points})`
              );
            }
          }
          ctx.reply(
            `<b>Driver Standings in ${
              ctx.message.text
            }:</b> \n\n${preparedReply.join('\n')}`,
            { parse_mode: 'HTML' }
          );
          ctx.scene.reenter();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      ctx.reply(`Enter a year between 1950 and ${currentYear} ⌨️ `);
    }
  });
});
/* Standings by Year [END] */

drivers.hears('🗂 Main Menu', ctx => {
  ctx.scene.enter('menu');
});
/*Drivers Scene [END]*/

/* Constructor Scene [START] */
const constructors = new Scene('constructors');
constructors.enter(ctx => {
  return ctx.reply(
    '🏎 Select from the menu below ⬇️',
    Markup.keyboard([
      [`🏅 Current Standings (${currentYear})`, '🎖 Standings by year'],
      ['🗂 Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

/* 🏅 Current Standings [START] */
constructors.hears(`🏅 Current Standings (${currentYear})`, ctx => {
  axios
    .get(`${apiUrl}current/constructorStandings.json`)
    .then(res => {
      const numOfLastRace =
        res.data.MRData.StandingsTable.StandingsLists[0].round;
      const constructorStandings =
        res.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      let preparedReply = [];
      for (let i = 0; i < constructorStandings.length; i++) {
        if (i === 0) {
          preparedReply.push(
            `${i + 1}. ${constructorStandings[i].Constructor.name} (${
              constructorStandings[i].points
            }) 🥇`
          );
        } else if (i === 1) {
          preparedReply.push(
            `${i + 1}. ${constructorStandings[i].Constructor.name} (${
              constructorStandings[i].points
            }) 🥈`
          );
        } else if (i === 2) {
          preparedReply.push(
            `${i + 1}. ${constructorStandings[i].Constructor.name} (${
              constructorStandings[i].points
            }) 🥉`
          );
        } else {
          preparedReply.push(
            `${i + 1}. ${constructorStandings[i].Constructor.name} (${
              constructorStandings[i].points
            })`
          );
        }
      }
      ctx.reply(
        `<b>Current 🏎 Constructors Standings after ${numOfLastRace} race(s):\n\n</b>${preparedReply.join(
          '\n'
        )}`,
        { parse_mode: 'HTML' }
      );
      ctx.scene.reenter();
    })
    .catch(err => {
      console.log(err);
    });
});
/* 🏅 Current Standings [END] */

/* Standings by Year [START] */
constructors.hears('🎖 Standings by year', ctx => {
  ctx.reply(`Enter a year between 1958 and ${currentYear} ⌨️ `);
  constructors.on('text', ctx => {
    ctx.scene.state = { value: ctx.message.text };
    if (
      ctx.scene.state.value >= 1958 &&
      ctx.scene.state.value <= new Date().getFullYear()
    ) {
      axios
        .get(`${apiUrl}${ctx.message.text}/constructorStandings.json`)
        .then(res => {
          const constructorsStandings =
            res.data.MRData.StandingsTable.StandingsLists[0]
              .ConstructorStandings;
          let preparedReply = [];
          for (let i = 0; i < constructorsStandings.length; i++) {
            if (i === 0) {
              preparedReply.push(
                `${i + 1}. ${constructorsStandings[i].Constructor.name} (${
                  constructorsStandings[i].points
                }) 🥇`
              );
            } else if (i === 1) {
              preparedReply.push(
                `${i + 1}. ${constructorsStandings[i].Constructor.name} (${
                  constructorsStandings[i].points
                }) 🥈`
              );
            } else if (i === 2) {
              preparedReply.push(
                `${i + 1}. ${constructorsStandings[i].Constructor.name} (${
                  constructorsStandings[i].points
                }) 🥉`
              );
            } else {
              preparedReply.push(
                `${i + 1}. ${constructorsStandings[i].Constructor.name} (${
                  constructorsStandings[i].points
                })`
              );
            }
          }
          ctx.reply(
            `<b>🏎 Constructors Standings in ${
              ctx.message.text
            }:</b> \n\n${preparedReply.join('\n')}`,
            { parse_mode: 'HTML' }
          );
          ctx.scene.reenter();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      ctx.reply(`Enter a year between 1958 and ${currentYear} ⌨️ `);
    }
  });
});
/* Standings by Year [END] */

constructors.hears('🗂 Main Menu', ctx => {
  ctx.scene.enter('menu');
});
/* Constructor Scene [END] */

/* 🗓 Schedule Scene [START] */
const schedule = new Scene('schedule');
schedule.enter(ctx => {
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

schedule.hears(`🗓 Current Schedule (${currentYear})`, ctx => {
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

schedule.hears('🔙 Previous Race', ctx => {
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

schedule.hears('🔜 Next Race', ctx => {
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

schedule.hears('🔙 Previous Qualification', ctx => {
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

schedule.hears('🗂 Main Menu', ctx => {
  ctx.scene.enter('menu');
});
/* 🗓 Schedule Scene [END] */

// Create scene manager
const stage = new Stage();

// Scene registration
stage.register(mainMenu);
stage.register(drivers);
stage.register(constructors);
stage.register(schedule);

bot.use(stage.middleware());

bot.hears('🗂 Menu', ctx => ctx.scene.enter('menu'));
bot.hears('👱🏻‍♂️ Drivers', ctx => ctx.scene.enter('drivers'));
bot.hears('🏎 Constructors', ctx => ctx.scene.enter('constructors'));
bot.hears('🗓 Schedule', ctx => ctx.scene.enter('schedule'));

bot.launch();
