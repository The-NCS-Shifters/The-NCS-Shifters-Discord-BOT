const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const i18n = require("i18n");
i18n.setLocale("en");

module.exports = {
   name: "stop",
   aliases: [],
   description: i18n.__('stop.description'),
   botpermissions: ["CONNECT", "SPEAK", "SEND_MESSAGES", "VIEW_CHANNEL"],
   usage: "chis!stop",
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

        const queue = client.player.getQueue(message.guild.id);

            if (!queue) return message.reply(i18n.__("stop.errorNotQueue")).catch(console.error);

            let isDone = queue.stop();
            if (isDone)
                message.channel.send(i18n.__mf("stop.result", { author: message.author })).catch(console.error);

    } else {

        message.channel.send("Server Adminstrator Disabled Music Intergration on this Server. If want Renable it, please go to our Dashboard and Re-enable it");

    }
   },
};
