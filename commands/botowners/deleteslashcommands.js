const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const settings = require("../../config/settings.json");

module.exports = {
   name: "deleteslashcommands",
   aliases: ["purgeslashccommands"],
   cooldowns: 3000,
   description: "Deletes all Slash commands",
   usage: "",
   toggleOff: false,
   developersOnly: true,
   userpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
   description: "Deletes all Slash commands",

   run: async (client, message, args) => {
     
      const token = settings.clienttoken;
      const clientId = settings.clientid;

      if (args[0] == "single") {

        const guildId = args[1];
      
        const rest = new REST({ version: '9' }).setToken(token);
        rest.get(Routes.applicationGuildCommands(clientId, guildId))
        .then(data => {
          const promises = [];
          for (const command of data) {
              const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
              promises.push(rest.delete(deleteUrl));
          }
          return Promise.all(promises);
        });
      } else {
      
        const Guilds = client.guilds.cache.map(guild => guild.id);

        for (const element of Guilds) {
          const rest = new REST({ version: '9' }).setToken(token);
          rest.get(Routes.applicationGuildCommands(clientId, element))
          .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(clientId, element)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
          });
        }
      
      }
   },
};
