const { MessageEmbed } = require("discord.js");
module.exports = {
   name: "gitupdate",
   aliases: ["update"],
   cooldowns: 3000,
   description: "UPDATE BOT (ONLY DEVELOPERS HAS ACCESS)",
   usage: "",
   toggleOff: false,
   developersOnly: true,
   userpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
   description: "UPDATE BOT (ONLY DEVELOPERS HAS ACCESS)",
   
   
   run: async (client, message, args) => {
     
      const { exec } = require('child_process');
      exec('cd /root/botstuff/PaimonBOT/', (err, stdout, stderr) => {
        if (err) {
            if (typeof err !== "string")
              err = require("util").inspect(err);

             let embed = new MessageEmbed()
            .setAuthor("UPDATE", message.author.avatarURL())
            .addField("Output", `\`\`\`${err}\`\`\``)
            .setColor("RED");

            message.channel.send({ embeds: [embed] });
            console.error(err)
        } else {
            exec('git pull', (err1, stdout1, stderr1) => {
              if (err1) {
                if (typeof err !== "string")
                  err1 = require("util").inspect(err1);

                  let embed = new MessageEmbed()
                  .setAuthor("UPDATE", message.author.avatarURL())
                  .addField("Output", `\`\`\`${err1}\`\`\``)
                  .setColor("RED");

                  message.channel.send({ embeds: [embed] });
                console.error(err)
              } else {

                if (typeof stdout1 !== "string")
                  stdout1 = require("util").inspect(stdout1);
                
                let embed1 = new MessageEmbed()
                embed1.setAuthor("UPDATE", message.author.avatarURL())
                 
                embed1.addField("Output", `\`\`\`${stdout1}\`\`\``)
                embed1.addField("Reminder", `\`\`\`MAKE SURE DO "(PREFIX)reload commandname" FOR UPDATE COMMANDS\`\`\``)
                 
                embed1.setColor("GREEN");

                message.channel.send({ embeds: [embed1] });
              }
           });
        }
      });
      
   },
};
