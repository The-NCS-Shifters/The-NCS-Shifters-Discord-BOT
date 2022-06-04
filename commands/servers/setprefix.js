const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
   name: "setprefix",
   aliases: ["prefixset"],
   description: "Set Custom PRefix on your Discord Server",
   userpermissions: ["ADMINISTRATOR"],
   botpermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
   usage: "chis!setprefix $",
   cooldowns: 2000,
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

    var connection = client.sqlconn;

    function getGuild(guildID) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM guilds WHERE guild_id = '${guildID}'`, (err, rows) => {
                if (err) return reject(err);

                resolve(rows);
            });
        });
    }

    const permissions = message.channel.permissionsFor(message.client.user);
        if (permissions.has(["ADMINISTRATOR"]) || message.author.id == message.guild.ownerID) {
            let suffix = message.content.split(' ').splice(1).toString();
            connection.query(`UPDATE guild_settings SET prefix = '${suffix}' WHERE guild_id = '${message.guild.id}'`, (err, rows) => {
                if (err) return console.log(err);

                message.channel.send(`Prefix has been set to ${suffix}`)
            });
        } else {
            message.channel.send("Sorry, Only `Server Owners` or People have `ADMINISTRATOR` Permissions can do This command.")
        }

   },
};
