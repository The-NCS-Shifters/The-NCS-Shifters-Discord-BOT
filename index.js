  
var fs = require('fs');
var config = require('./config.json');

var chalk = require('chalk');
var clear = require('clear');
const fetch = require('node-fetch');

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

console.log("Starting UP!");
clear();
console.log(`
${chalk.grey('--------------------------------------------------')}
ChisBot, an open-source, multi-platform bot.
${chalk.red('PLEASE DO NOT SELL THIS BOT/SOURCE TO OTHER PEOPLE')}
${chalk.red('PLEASE DO NOT SELL THE BOT FOR SERVICE.')}
BOTS: ${chalk.magenta('MUSIC / COMMANDS')}
${chalk.grey('--------------------------------------------------')}
`);



const { TOKEN, PREFIX } = require("./discordbot/util/BotUtil");

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./discordbot/bot.js', {
    totalShards: 1,
    token:  TOKEN
});

manager.spawn();

manager.on('shardCreate', (shard) => {
    console.log(`${shard.id} ID shard started`);

     //setInterval(() => {
    const promises = [
      manager.fetchClientValues("guilds.cache.size"),
      manager.broadcastEval("this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)")
    ];
    return Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      const body = { servers: totalGuilds, shards: manager.totalShards, users: totalMembers };
      /*fetch(``, {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => res.json())
        .then((json) => console.log(json));

        console.log(body);
        console.log(chalk.blueBright("[BOTRIX]"), `Successfully posted stats.`);*/
    });
  //}, 3600000);

});