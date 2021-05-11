const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "partners",
  aliases: ["pg"],
  description: "Get DATA from Partners Groups",
  async execute(message, args) {
	
	const availablechars = ['alloyxuast', 'spookyhosting', 'vortex']

	const search = message.content.split(' ').splice(1).toString();

	if (!search) { 
      message.channel.send(new MessageEmbed()
      .setColor('#F8AA2A')
      .setThumbnail("https://apps.chisdealhd.co.uk/botimgs/pmoLfeY.gif")
      .setDescription('You didn\'t provide a Community Name! List of all available:\n`alloyxuast`, `spookyhosting`'))
      return
    }
	
	if (availablechars.includes(search)) {
        const result = require(`../data-json/partners-data/${message.content.split(' ').splice(1).toString()}`);
		if(!result) return;

        var color = '#FFE4AA'

      message.channel.send(new MessageEmbed()
        .setColor(color)
        .setTitle(`${result.name} (Clickable)`)
        .setDescription(`**Title**: ${result.title}\n**Founded By**: ${result.founders}\n**Catergory**: ${result.catergory}\n**Type Mode**: ${result.typemode}\n\n${result.description}`)
        .setURL(result.url)
        .setThumbnail(result.image))
        return
    } else {
      message.channel.send(new MessageEmbed()
      .setColor('#F8AA2A')
	    .setThumbnail("https://apps.chisdealhd.co.uk/botimgs/pmoLfeY.gif")
      .setDescription('You\'ve provided wrong Community Name! List of all available:\n`alloyxuast`, `spookyhosting`, `vortex`'))
      return
    }
	
  }
};
