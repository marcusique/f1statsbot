const Telegraf = require('telegraf'),
  Markup = require('telegraf/markup'),
  Stage = require('telegraf/stage'),
  session = require('telegraf/session'),
  { leave } = Stage,
  Scene = require('telegraf/scenes/base'),
  keys = require('./config/keys'),
  apiUrl = keys.apiUrl,
  { flag } = require('country-emoji'),
  bot = new Telegraf(keys.telegramBotToken),
  axios = require('axios'),
  currentYear = new Date().getFullYear();

/* Welcome Message */
bot.start(ctx => {
  ctx.reply(
    'Go to the main menu!',
    Markup.keyboard([['Menu']])
      .oneTime()
      .resize()
      .extra()
  );
});

/*Main Menu Scene [START]*/
const mainMenu = new Scene('menu');
mainMenu.enter(ctx => {
  return ctx.reply(
    'Main Menu',
    Markup.keyboard([['Drivers', 'Constructors'], ['Schedule']])
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
    'Drivers Scene',
    Markup.keyboard([
      [`Current Standings (${currentYear})`, 'Standings by year'],
      ['Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

/* Current Standings [START] */
drivers.hears(`Current Standings (${currentYear})`, ctx => {
  axios
    .get(`${apiUrl}current/driverStandings.json`)
    .then(res => {
      const numOfLastRace =
        res.data.MRData.StandingsTable.StandingsLists[0].round;
      const driverStandings =
        res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      let preparedReply = [];
      for (let i = 0; i < driverStandings.length; i++) {
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
/* Current Standings [END] */

/* Standings by Year [START] */
drivers.hears('Standings by year', ctx => {
  ctx.reply('Enter a year: ');
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
      ctx.reply(
        'Please enter a year between 1950 and ' + new Date().getFullYear() + '.'
      );
    }
  });
});
/* Standings by Year [END] */

drivers.hears('Main Menu', ctx => {
  ctx.scene.enter('menu');
});
/*Drivers Scene [END]*/

/* Constructor Scene [START] */
const constructors = new Scene('constructors');
constructors.enter(ctx => {
  return ctx.reply(
    'Constructors Scene',
    Markup.keyboard([
      [`Current Standings (${currentYear})`, 'Standings by year'],
      ['Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

/* Current Standings [START] */
constructors.hears(`Current Standings (${currentYear})`, ctx => {
  axios
    .get(`${apiUrl}current/constructorStandings.json`)
    .then(res => {
      const numOfLastRace =
        res.data.MRData.StandingsTable.StandingsLists[0].round;
      const constructorStandings =
        res.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      let preparedReply = [];
      for (let i = 0; i < constructorStandings.length; i++) {
        preparedReply.push(
          `${i + 1}. ${constructorStandings[i].Constructor.name} (${
            constructorStandings[i].points
          })`
        );
      }
      ctx.reply(
        `<b>Current Constructors Standings after ${numOfLastRace} race(s):\n\n</b>${preparedReply.join(
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
/* Current Standings [END] */

/* Standings by Year [START] */
constructors.hears('Standings by year', ctx => {
  ctx.reply('Enter a year: ');
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
            preparedReply.push(
              `${i + 1}. ${constructorsStandings[i].Constructor.name} (${
                constructorsStandings[i].points
              })`
            );
          }
          ctx.reply(
            `<b>Constructors Standings in ${
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
      ctx.reply(
        'Please enter a year between 1958 and ' + new Date().getFullYear() + '.'
      );
    }
  });
});
/* Standings by Year [END] */

constructors.hears('Main Menu', ctx => {
  ctx.scene.enter('menu');
});
/* Constructor Scene [END] */

/* Schedule Scene [START] */
const schedule = new Scene('schedule');
schedule.enter(ctx => {
  return ctx.reply(
    'Schedule Scene',
    Markup.keyboard([
      ['Previous Race', 'Next Race'],
      [`Current Schedule (${currentYear})`],
      ['Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

schedule.hears(`Current Schedule (${currentYear})`, ctx => {
  axios.get(`${apiUrl}current.json`).then(res => {
    const currentSchedule = res.data.MRData.RaceTable.Races;
    let preparedReply = [];
    for (let i = 0; i < currentSchedule.length; i++) {
      preparedReply.push(
        `${i + 1}: ${flag(currentSchedule[i].Circuit.Location.country)} ${
          currentSchedule[i].raceName
        } 📆 ${currentSchedule[i].date}`
      );
    }
    ctx.reply(
      `<b>Race Schedule for ${currentYear}:</b>\n\n${preparedReply.join('\n')}`,
      { parse_mode: 'HTML' }
    );
    ctx.scene.reenter();
  });
});

schedule.hears('Previous Race', ctx => {
  axios.get(`${apiUrl}current/last/results.json`).then(res => {
    const results = res.data.MRData.RaceTable.Races[0].Results;
    const raceName = res.data.MRData.RaceTable.Races[0].raceName;
    let preparedReply = [];
    console.log(results);
    for (let i = 0; i < results.length; i++) {
      preparedReply.push(
        `${i + 1}. ${results[i].Driver.givenName} ${
          results[i].Driver.familyName
        } (${results[i].points})`
      );
    }
    ctx.reply(`<b>${raceName} results</b>: \n\n${preparedReply.join('\n')}`, {
      parse_mode: 'HTML'
    });
  });
});

schedule.hears('Next Race', ctx => {
  axios
    .get(`${apiUrl}current/last/results.json`)
    .then(res => {
      let lastRace = parseInt(res.data.MRData.RaceTable.round);
      let nextRace = lastRace + 1;
      let totalRaces = parseInt(res.data.MRData.total) + 1;
      if (nextRace <= totalRaces) {
        axios
          .get(`${apiUrl}current/${nextRace}.json`)
          .then(res => {
            let raceInfo = res.data.MRData.RaceTable;
            let gpWikiLink = raceInfo.Races[0].url;
            ctx.reply(
              `The next race is ${flag(
                raceInfo.Races[0].Circuit.Location.country
              )} ${raceInfo.Races[0].raceName} at ${
                raceInfo.Races[0].Circuit.circuitName
              }, starting at ${raceInfo.Races[0].time.substring(
                0,
                5
              )} UTC time on ${raceInfo.Races[0].date} (Sunday).`,
              Markup.inlineKeyboard([
                Markup.urlButton('Wikipedia', `${gpWikiLink}`)
              ]).extra()
            );
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

schedule.hears('Main Menu', ctx => {
  ctx.scene.enter('menu');
});
/* Schedule Scene [END] */

// Create scene manager
const stage = new Stage();
//stage.command('cancel', leave())

// Scene registration
stage.register(mainMenu);
stage.register(drivers);
stage.register(constructors);
stage.register(schedule);

bot.use(session());
bot.use(stage.middleware());
bot.hears('Menu', ctx => ctx.scene.enter('menu'));
bot.hears('Drivers', ctx => ctx.scene.enter('drivers'));
bot.hears('Constructors', ctx => ctx.scene.enter('constructors'));
bot.hears('Schedule', ctx => ctx.scene.enter('schedule'));

bot.launch();
