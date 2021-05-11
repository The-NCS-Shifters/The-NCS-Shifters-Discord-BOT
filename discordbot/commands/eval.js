const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "eval",
  aliases: ["admineval"],
  description: "Admin Command for Eval",
  async execute(message, args) {
	
	message.delete({ timeout: 1, reason: 'Puged Command provent copying' });
    var user = message.author.username;
    let embed = new MessageEmbed();
    if (message.author.id == "100463282099326976") {
        try {
            let code = message.content.split(" ").splice(1).join(" ")
            let result = eval(code)
            embed.setTitle("Execute Command")
            embed.setColor(0x008000)
            embed.addField("Run command: ", "```" + user + "```", true)
            embed.addField("Input: ", "```javascript\n" + code + "```", true)
            embed.addField("Output: ", "```diff\n+ " + result + "```", true)
            embed.setFooter("Sent via " + message.client.user.username, message.client.user.avatarURL)
            embed.setTimestamp()
            message.channel.send({ embed })
        } catch (err) {
            message.channel.send("```diff\n- " + err + "```")
        }
    } else {
        message.channel.send("Sorry, you do not have permissisons to use this command, **" + message.author.username + "**.")
    }
	
  }
};
