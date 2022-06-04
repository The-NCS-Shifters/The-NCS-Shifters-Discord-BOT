const { Client, Collection, WebhookClient, MessageEmbed } = require("discord.js");
// Import Discord.Js.
const client = new Client({ disableMentions: "everyone", intents: 32767 });
// Make New Discord Client.
module.exports = client;
// Export Client To Give Other Files Access.
const chalk = require("chalk");
// Import Chalk
const path = require("path");
// Import Path

// ———————————————[Global Variables]———————————————
client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.config = require("./config/settings.json");
require("./handler")(client);

// ———————————————[i18n Data]———————————————
const i18n = require("i18n");

i18n.configure({
   locales: ["en", "es", "ko", "fr", "tr", "pt_br", "zh_cn", "zh_tw"],
   directory: path.join(__dirname, "locales"),
   defaultLocale: "en",
   objectNotation: true,
   register: global,

   logWarnFn: function(msg) {
       console.log("warn", msg);
   },

   logErrorFn: function(msg) {
       console.log("error", msg);
   },

   missingKeyFn: function(locale, value) {
       return value;
   },

   mustacheConfig: {
       tags: ["{{", "}}"],
       disable: false
   }
});

// ———————————————[DISCORDTOGETHER]———————————————
const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);

// ———————————————[MYSQL]———————————————

var mysql = require('mysql');
 var connection = mysql.createConnection({
     host: client.config.sql.host,
     user: client.config.sql.user,
     password: client.config.sql.password,
     database: client.config.sql.database
 });
 client.sqlconn = connection;

// ———————————————[MUSIC PLAYER]———————————————

const { Player, Utils } = require("discord-music-player");
 const player = new Player(client, {
     leaveOnEmpty: false,
     deafenOnJoin: true,
 });

client.queue = new Map();
client.player = player;

client.player
    // Emitted when channel was empty.
    .on('channelEmpty',  (queue) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle(`The channel is empty, I have removed the music`)]}))
    // Emitted when a song was added to the queue.
    .on('songAdd',  (queue, song) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle(song + ' has been added to the queue')]}))
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd',  (queue, playlist) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle(`I just added a playlist ${playlist} with ${playlist.songs.length} songs!`)]}))
    // Emitted when there was no more music to play.
    .on('queueEnd',  (queue) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle('The queue has ended!')]}))
    // Emitted when a song changed.
    .on('songChanged', (queue, newSong, oldSong) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle(newSong + ' is now playing!')]}))
    // Emitted when a first song in the queue started playing.
    .on('songFirst',  (queue, song) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle(song + ' is now playing!')]}))
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle('I was disconnected!')]}))
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) =>
        queue.data.channel({ embeds: [new MessageEmbed().setColor('#0099ff').setTitle('I was undeafened!')]}))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        console.log(`Error: ${error} in ${queue.guild.name}`);
    });

// Initializing the project.

// ———————————————[Logging Into Client]———————————————
const token = process.env["clienttoken"] || client.config.clienttoken;
if(token === ""){
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Invalid Token")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(chalk.magenta("There Are 3 Ways To Fix This"));
   console.log(
      chalk.blue("Put Your ") + chalk.red("Bot Token ") + chalk.blue("in:")
   );
   console.log(
      chalk.yellow.bold("1.) ") +
         chalk.cyan("index.js") +
         chalk.gray(
            " On the client.login line remove client.login(token) and write client.login('Your token')"
         )
   );
   console.log(
      chalk.yellow.bold("2.) ") +
         chalk.cyan("ENV/Secrets") +
         chalk.gray(
            " If using replit, make new secret named 'clienttoken' and put your token in it else, if your using VsCode, Then Follow Some ENV tutorials (I don't suggest using it in VSC)"
         )
   );
   console.log(
      chalk.yellow.bold("3.) ") +
         chalk.cyan("settings.json ") +
         chalk.gray(
            'Go To config/settings.json, Find The Line with client.token and put "client.token":"Your Bot Token"'
         )
   );
} else {
   client.login(token);
}
// Login The Bot.
// ———————————————[Error Handling]———————————————
process.on("unhandledRejection", (reason, p) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Unhandled Rejection/Catch")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Uncaught Exception/Catch")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Multiple Resolves")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(type, promise, reason);
});
