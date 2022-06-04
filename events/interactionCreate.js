const client = require("../index");
const i18n = require("i18n");
i18n.setLocale("en");
const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

client.on("interactionCreate", async (interaction) => {

   // ———————————————[Slash Commands]———————————————
   if (interaction.isCommand()) {
      await interaction.deferReply({ ephemeral: false }).catch(() => {});

      //console.log(client.slashCommands.get(interaction.commandName.toLowerCase()))
      const cmd = client.slashCommands.get(interaction.commandName.toLowerCase());
      if (!cmd)
         return interaction.followUp({ content: "An error has occured " });

      const args = [];

      for (let option of interaction.options.data) {
         if (option.type === "SUB_COMMAND") {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
               if (x.value) args.push(x.value);
            });
         } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(
         interaction.user.id
      );
      
      if (cmd && cmd.voiceChannel) {
        if (!interaction.member.voice.channel) return interaction.followUp({ content: `You are not connected to an audio channel. ❌`, ephemeral: true});
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.followUp({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true});
      }

      cmd.run(client, interaction, args);
   }
   // ———————————————[Buttons]———————————————
   if (interaction.isButton()) {
      
   }
   // ———————————————[Select Menu]———————————————
   if (interaction.isSelectMenu()) {
   }
   // ———————————————[Context Menu]———————————————
   if (interaction.isContextMenu()) {
      await interaction.deferReply({ ephemeral: false });
      const command = client.slashCommands.get(interaction.commandName);
      if (command) command.run(client, interaction);
   }
});
