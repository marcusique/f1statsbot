const Telegraf = require('telegraf'),
  keys = require('./config/keys'),
  apiUrl = keys.apiUrl,
  bot = new Telegraf(keys.telegramBotToken),
  axios = require('axios');
/* Welcome Message */
bot.start(ctx => ctx.reply('Welcome to F1 Stats Bot!'));

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
          ctx.reply(preparedReply.join('\n'));
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

bot.launch();
