const Telegraf = require('telegraf'),
  keys = require('./config/keys'),
  bot = new Telegraf(keys.telegramBotToken),
  axios = require('axios'),
  telegrafInlineMenu = require('telegraf-inline-menu');
/* Welcome Message */
bot.start(ctx => ctx.reply('Welcome to F1 Stats Bot!'));

bot.command('/getdriverstandings', ctx => {
  ctx.reply('Enter a year: ');
  bot.on('text', ctx => {
    axios
      .get(`https://ergast.com/api/f1/${ctx.message.text}/driverStandings.json`)
      .then(function(res) {
        const data =
          res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        let reply = [];
        for (let i = 0; i < data.length; i++) {
          reply.push(
            data[i].Driver.givenName +
              ' ' +
              data[i].Driver.familyName +
              ` (${data[i].points})`
          );
        }
        ctx.reply(reply.join('\n'));
      });
  });
});

bot.launch();
