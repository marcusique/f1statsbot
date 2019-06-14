const Telegraf = require('telegraf'),
  keys = require('./config/keys'),
  apiUrl = keys.apiUrl,
  { flag } = require('country-emoji'),
  bot = new Telegraf(keys.telegramBotToken),
  axios = require('axios');

/* Welcome Message */
bot.start(ctx => ctx.reply('Welcome to F1 Stats Bot!'));

/* Get Current Constructors Standings [START]*/
bot.command('/getcurrentconstructorsstandings', ctx => {
  axios.get(`${apiUrl}current/constructorStandings.json`).then(function(res) {
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
  });
});
/* Get Current Constructor Standings [END]*/

/* Get Current Driver Standings [START]*/
bot.command('/getcurrentdriverstandings', ctx => {
  axios.get(`${apiUrl}current/driverStandings.json`).then(function(res) {
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
  });
});
/* Get Current Driver Standings [END]*/

/* Get Driver Standings by a Given Year [START]*/
bot.command('/getdriverstandings', ctx => {
  ctx.reply('Enter a year: ');
  bot.on('text', ctx => {
    if (
      ctx.message.text >= 1950 &&
      ctx.message.text <= new Date().getFullYear()
    ) {
      axios
        .get(`${apiUrl}${ctx.message.text}/driverStandings.json`)
        .then(function(res) {
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
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      ctx.reply(
        'Please enter a year between 1950 and ' + new Date().getFullYear() + '.'
      );
    }
  });
});
/* Get Driver Standings by a Given Year [END]*/

/* Get Current Constructors Standings [START]*/
bot.command('/getcurrentconstructorsstandings', ctx => {
  axios.get(`${apiUrl}current/constructorStandings.json`).then(function(res) {
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
  });
});
/* Get Current Constructor Standings [END]*/

/* Get Constructors Standings by a Given Year [START]*/
bot.command('/getconstructorstandings', ctx => {
  ctx.reply('Enter a year: ');
  bot.on('text', ctx => {
    if (
      ctx.message.text >= 1950 &&
      ctx.message.text <= new Date().getFullYear()
    ) {
      axios
        .get(`${apiUrl}${ctx.message.text}/constructorStandings.json`)
        .then(function(res) {
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
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      ctx.reply(
        'Please enter a year between 1950 and ' + new Date().getFullYear() + '.'
      );
    }
  });
});
/* Get Constructors Standings by a Given Year [END]*/

/* Get Current Race Schedule [START]*/
bot.command('/getraceschedule', ctx => {
  axios.get(`${apiUrl}current.json`).then(function(res) {
    const currentSchedule = res.data.MRData.RaceTable.Races;
    const currentYear = new Date().getFullYear();
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
  });
});
/* Get Current Race Schedule [END]*/
bot.launch();
