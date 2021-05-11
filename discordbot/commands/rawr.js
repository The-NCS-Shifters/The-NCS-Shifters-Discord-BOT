const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "rawr",
  aliases: ["rawr!"],
  description: "RAWR to User by (prefix)rawr @tagnamehere",
  async execute(message, args) {

	var suffix = message.content.split(" ").slice(1).join(" ");
    if (suffix == "" || suffix == null) return message.channel.sendMessage("You are Missing a TAG or Name of USER to **RAWR** TO!");
    var mes = ["https://cdn130.picsart.com/300724351196201.jpg", "https://pm1.narvii.com/6529/690b039860d13075ef6a88202ec864b64266d1f1_hq.jpg", "https://i.pinimg.com/474x/20/2e/5a/202e5aa4d13b1edbeacac73252387b6b--fun-posts.jpg"];

    let embed = new MessageEmbed();
    embed.setColor(0x9900FF)
    embed.setTitle("RAWR CUTIES!")
    embed.setDescription(message.author.username + " just **RAWR** to " + suffix)
    embed.setImage(mes[Math.floor(Math.random() * mes.length)])
    embed.setFooter("Sent via " + message.client.user.username, message.client.user.avatarURL)
    embed.setTimestamp()

    message.channel.send({
        embed
    })
	
  }
};
