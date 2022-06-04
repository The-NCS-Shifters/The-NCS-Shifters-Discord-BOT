const client = require("../index");
const { MessageEmbed } = require("discord.js");
const chalk = require("chalk");
const ms = require("ms");
const { developerID } = require("../config/settings.json");
const { clientavatar } = require("../config/settings.json");
const { clientname } = require("../config/settings.json");
const prefix = client.config.prefix;
const connection = client.sqlconn;

function getGuild(guildID) {
   return new Promise((resolve, reject) => {
       connection.query(`SELECT * FROM guild_settings WHERE guild_id = '${guildID}'`, (err, rows) => {
           if (err) return reject(err);

           resolve(rows);
       });
   });
}

function getGuildToggle(guildID) {
   return new Promise((resolve, reject) => {
       connection.query(`SELECT * FROM guild_command_toggle WHERE guild_id = '${guildID}'`, (err, rows) => {
           if (err) return reject(err);

           resolve(rows);
       });
   });
}
const { randomMessages_Cooldown } = require("../config/settings.json");
client.on("messageCreate", async (message) => {

   var discordusername = message.guild.name;
    var boop = discordusername.replace(/[\u0800-\uFFFF]/g, '')
    var dusers = boop.replace(`'`, '')

    connection.query(`SELECT guild_id FROM guilds WHERE guild_id='${message.guild.id}'`, async function(err, results) {

        if (results.length === 0) {

            connection.query(`
            INSERT INTO guilds SET name = '${dusers}', guild_id = '${message.guild.id}', owner_id = '${message.guild.ownerId}', region='discontinued'`,  err => {
                if (err) throw err;

                console.log("[AUTOMOD] Discord Server been Addded to Database");
            });

            connection.query(`
            INSERT INTO guild_settings SET guild_id = '${message.guild.id}', prefix='${client.config.prefix}', welcome_msg='N/A', leave_msg='N/A'`, err => {
                if (err) throw err;

                console.log("[AUTOMOD] Discord Server Settings been Addded to Database");
            })

            connection.query(`
            INSERT INTO guild_command_toggle SET guild_id = '${message.guild.id}'`, err => {
                if (err) throw err;

                console.log("[AUTOMOD] Discord Server Settings been Addded to Database");
            });
        } else {
 
             //console.log(`${message.guild.name} ALREADY ADDED, SKIPPED!`);


             const [guildsettings] = await getGuild(message.guild.id) // destructuring 'rows' array
                 .catch(console.error);
 
             const [guildsettingstoggle] = await getGuildToggle(message.guild.id) // destructuring 'rows' array
                 .catch(console.error);
 
                 if (guildsettingstoggle == undefined) return console.log("DOESNT ESIST SERVER, ADDIGN NOW")
                 if (guildsettings == undefined) return console.log("DOESNT ESIST SERVER, ADDIGN NOW")

             const prefix11 = guildsettings.prefix;

   if (
      message.author.bot ||
      !message.guild ||
      !message.content.toLowerCase().startsWith(prefix11)
   )
      return;
   if (!message.member)
      message.member = await message.guild.fetchMember(message);
   const [cmd, ...args] = message.content
      .slice(prefix11.length)
      .trim()
      .split(" ");
   let noargs_embed = new MessageEmbed()
      .setTitle(`:x: | Please Provide A Command To Be Executed!`)
      .setColor("RED")
      .setFooter(`${clientname}`, `${clientavatar}`)
      .setTimestamp();
   if (cmd.length === 0) return message.reply({ embeds: [noargs_embed] });

   const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
   let nocmd_embed = new MessageEmbed()
      .setTitle(`:x: | No Command Found! Try Using  \`${prefix}help\``)
      .setColor("RED")
      .setFooter(`${clientname}`, `${clientavatar}`)
      .setTimestamp();
   if (!command) return message.channel.send({ embeds: [nocmd_embed] });
   if (command.toggleOff) {
      let toggleoff_embed = new MessageEmbed()
         .setTitle(
            `:x: | That Command Has Been Disabled By The Developers! Please Try Later.`
         )
         .setColor("RED")
         .setFooter(`${clientname}`, `${clientavatar}`)
         .setTimestamp();
      return message.reply({ embeds: [toggleoff_embed] });
   } else if (!message.member.permissions.has(command.userpermissions || [])) {
      let userperms_embed = new MessageEmbed()
         .setTitle(`:x: | You Don't Have Permissions To Use The Command!`)
         .setColor("RED")
         .setFooter(`${clientname}`, `${clientavatar}`)
         .setTimestamp();
      return message.reply({ embeds: [userperms_embed] });
   } else if (!message.guild.me.permissions.has(command.botpermissions || [])) {
      let botperms_embed = new MessageEmbed()
         .setTitle(`:x: | I Don't Have Permissions To Use The Command!`)
         .setColor("RED")
         .setFooter(`${clientname}`, `${clientavatar}`)
         .setTimestamp();
      return message.reply({ embeds: [botperms_embed] });
   } else if (command.developersOnly) {
      if (!developerID.includes(message.author.id)) {
         let developersOnly_embed = new MessageEmbed()
            .setTitle(`:x: | Only Developers Can Use That Command!`)
            .setDescription(
               `Developers: ${developerID.map((v) => `<@${v}>`).join(",")}`
            )
            .setColor("RED")
            .setFooter(`${clientname}`, `${clientavatar}`)
            .setTimestamp();
         return message.reply({ embeds: [developersOnly_embed] });
      }
   } else if (command.cooldowns) {
      if (client.cooldowns.has(`${command.name}${message.author.id}`)) {
         let cooldown_embed = new MessageEmbed()
            .setTitle(
               `${
                  randomMessages_Cooldown[
                     Math.floor(Math.random() * randomMessages_Cooldown.length)
                  ]
               }`
            )
            .setDescription(
               `You Need To Wait \`${ms(
                  client.cooldowns.get(`${command.name}${message.author.id}`) -
                     Date.now(),
                  { long: true }
               )}\` To Use \`${prefix}${command.name}\` again!`
            )
            .setColor("BLUE")
            .setFooter(`${clientname}`, `${clientavatar}`)
            .setTimestamp();

         return message.reply({ embeds: [cooldown_embed] });
      }

      client.cooldowns.set(
         `${command.name}${message.author.id}`,
         Date.now() + command.cooldowns
      );

      setTimeout(() => {
         client.cooldowns.delete(`${command.name}${message.author.id}`);
      }, command.cooldowns);
   }
   await command.run(client, message, args);
}
});
});