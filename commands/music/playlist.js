const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const i18n = require("i18n");
i18n.setLocale("en");

module.exports = {
   name: "playlist",
   aliases: ["pl"],
   description: i18n.__("playlist.description"),
   botpermissions: ["CONNECT", "SPEAK", "SEND_MESSAGES", "VIEW_CHANNEL"],
   usage: "chis!playlist YTLINK|SPOTIFYLINK",
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

        const { channel } = message.member.voice;
        const serverQueue = client.player.getQueue(message);

        if (!args.length)
            return message
                .reply(i18n.__mf("playlist.usageReply", { prefix: client.config.prefix }))
                .catch(console.error);
        if (!channel) return message.reply(i18n.__("playlist.errorNotChannel")).catch(console.error);

        const permissions = channel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.reply(i18n.__("playlist.missingPermissionConnect"));
        if (!permissions.has("SPEAK")) return message.reply(i18n.__("missingPermissionSpeak"));

        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message
                .reply(i18n.__mf("play.errorNotInSameChannel", { user: client.user }))
                .catch(console.error);


                let queue = client.player.createQueue(message.guild.id, {
                    data: {
                        channel: message.channel.send,
                    }});
                await queue.join(message.member.voice.channel);
                let song = await queue.playlist(args.join(' ')).catch(_ => {
                    if(!serverQueue)
                        queue.stop();
                });

    } else {

        message.channel.send("Server Adminstrator Disabled Music Intergration on this Server. If want Renable it, please go to our Dashboard and Re-enable it");

    }
   },
};
