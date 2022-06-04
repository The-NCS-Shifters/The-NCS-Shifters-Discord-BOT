const { MessageEmbed } = require("discord.js");
module.exports = {
   name: "restart",
   aliases: ["reboot"],
   cooldowns: 3000,
   description: "RESTART BOT (ONLY DEVELOPERS HAS ACCESS)",
   usage: "",
   toggleOff: false,
   developersOnly: true,
   userpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
   description: "RESTART BOT (ONLY DEVELOPERS HAS ACCESS)",
   
   
   run: async (client, message, args) => {
     
      let embed1 = new MessageEmbed()
      embed1.setAuthor("UPDATE", message.author.avatarURL())
                 
      embed1.addField("Output", `\`\`\`BOT HAS BEEN RESTARTED\`\`\``)
                 
      embed1.setColor("GREEN");

      message.channel.send({ embeds: [embed1] }).then(() => {
         process.exit();
      })
      
   },
};
