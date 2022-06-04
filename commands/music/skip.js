const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const i18n = require("i18n");
i18n.setLocale("en");

module.exports = {
   name: "skip",
   aliases: ["s"],
   description: i18n.__("skip.description"),
   botpermissions: ["CONNECT", "SPEAK", "SEND_MESSAGES", "VIEW_CHANNEL"],
   usage: "chis!skip",
   cooldowns: 2000,
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

    var connection = client.sqlconn;

    function getGuildToggle(guildID) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM guild_command_toggle WHERE guild_id = '${guildID}'`, (err, rows) => {
                if (err) return reject(err);

                resolve(rows);
            });
        });
    }

    const [guildsettingstoggle] = await getGuildToggle(message.guild.id) // destructuring 'rows' array
        .catch(console.error);


    if (guildsettingstoggle.musicToggle != 0) {

        const queue = client.player.createQueue(message.guild.id, {
            data: {
                channel: message.channel,
            }});
          if (!queue) return message.reply(i18n.__("skip.errorNotQueue")).catch(console.error);
          if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

          let song = client.player.getQueue(message.guild.id);

           //console.log(song.songs[0].name)

          song.skip();
          message.channel.send(`**${song.songs[0].name}** was skipped!`);

    } else {

        message.channel.send("Server Adminstrator Disabled Music Intergration on this Server. If want Renable it, please go to our Dashboard and Re-enable it");

    }
   },
};


function canModifyQueue(member) {
    const { channelID } = member.voice;
    const botChannel = member.guild.channels.cache.get(channelID);
 
    if (channelID !== botChannel) {
        member.send("You need to join the voice channel first!").catch(console.error);
        return;
    }
 
    return true;
 };
