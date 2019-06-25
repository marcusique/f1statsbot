const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  axios = require('axios'),
  keys = require('../config/keys'),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

const driversScene = new Scene('driversScene');
driversScene.enter(ctx => {
  return ctx.reply(
    '👱🏻‍♂️ Select from the menu below ⬇️',
    Markup.keyboard([
      [`🏆 Current Standings (${currentYear})`, '🎖 Standings by year'],
      ['🗂 Main Menu']
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

/* 🏅 Current Standings [START] */
driversScene.hears(`🏆 Current Standings (${currentYear})`, ctx => {
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
driversScene.hears('🎖 Standings by year', ctx => {
  ctx.reply(`Enter a year between 1950 and ${currentYear} ⌨️ `);
  driversScene.on('text', ctx => {
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

driversScene.hears('🗂 Main Menu', ctx => {
  ctx.scene.enter('mainScene');
});

module.exports = driversScene;
