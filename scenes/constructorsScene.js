const Scene = require('telegraf/scenes/base'),
  Markup = require('telegraf/markup'),
  axios = require('axios'),
  { flag } = require('country-emoji'),
  keys = require('../config/keys'),
  apiUrl = keys.apiUrl,
  currentYear = new Date().getFullYear();

const constructorsScene = new Scene('constructorsScene');
constructorsScene.enter((ctx) => {
  return ctx.reply(
    '🏎 Select from the menu below ⬇️',
    Markup.keyboard([[`🏆 Current Standings`, '🎖 Standings by year'], ['🗂 Main Menu']])
      .oneTime()
      .resize()
      .extra()
  );
});

/* 🏆 Current Standings [START] */
constructorsScene.hears(`🏆 Current Standings`, (ctx) => {
  axios
    .get(`${apiUrl}current/constructorStandings.json`)
    .then((res) => {
      const numOfLastRace = res.data.MRData.StandingsTable.StandingsLists[0].round;
      const constructorStandings = res.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      let preparedReply = [];
      for (let i = 0; i < constructorStandings.length; i++) {
        if (i === 0) {
          preparedReply.push(`🥇 ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)}  (${constructorStandings[i].points})`);
        } else if (i === 1) {
          preparedReply.push(`🥈 ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)} (${constructorStandings[i].points})`);
        } else if (i === 2) {
          preparedReply.push(`🥉 ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)} (${constructorStandings[i].points})`);
        } else {
          preparedReply.push(`${i + 1}. ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)} (${constructorStandings[i].points})`);
        }
      }
      ctx.reply(`<b>🏆 Current Constructors Standings after ${numOfLastRace} race(s):\n\n</b>${preparedReply.join('\n')}`, { parse_mode: 'HTML' });
      ctx.scene.reenter();
    })
    .catch((err) => {
      ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);
    });
});
/* 🏆 Current Standings [END] */

/* Standings by Year [START] */
constructorsScene.hears('🎖 Standings by year', (ctx) => {
  ctx.reply(`Enter a year between 1958 and ${currentYear} ⌨️ `);
});

constructorsScene.hears(/^[0-9]{4}$/, (ctx) => {
  ctx.scene.state = { value: ctx.message.text };
  if (ctx.scene.state.value >= 1958 && ctx.scene.state.value <= new Date().getFullYear()) {
    axios
      .get(`${apiUrl}${ctx.message.text}/constructorStandings.json`)
      .then((res) => {
        const constructorStandings = res.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        let preparedReply = [];
        for (let i = 0; i < constructorStandings.length; i++) {
          if (i === 0) {
            preparedReply.push(`🥇 ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)} (${constructorStandings[i].points})`);
          } else if (i === 1) {
            preparedReply.push(`🥈 ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)} (${constructorStandings[i].points})`);
          } else if (i === 2) {
            preparedReply.push(`🥉 ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)} (${constructorStandings[i].points})`);
          } else {
            preparedReply.push(
              `${i + 1}. ${constructorStandings[i].Constructor.name} ${flag(constructorStandings[i].Constructor.nationality)} (${constructorStandings[i].points})`
            );
          }
        }
        ctx.reply(`<b>🎖 Constructors Standings in ${ctx.message.text}:</b> \n\n${preparedReply.join('\n')}`, { parse_mode: 'HTML' });
        ctx.scene.reenter();
      })
      .catch((err) => {
        ctx.reply(`Oh snap! 🤖 The results are not yet ready or an error occured. Please try again later.`);

      });
  } else {
    ctx.reply(`Enter a year between 1958 and ${currentYear} ⌨️ `);
  }
});
/* Standings by Year [END] */

constructorsScene.hears('🗂 Main Menu', (ctx) => {
  ctx.scene.leave('constructorsScene');
  ctx.scene.enter('mainScene');

});

module.exports = constructorsScene;
