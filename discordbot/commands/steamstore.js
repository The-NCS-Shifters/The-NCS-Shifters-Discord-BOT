const { MessageEmbed } = require("discord.js");
var steam = require('steam-provider');

module.exports = {
  name: "steamstore",
  aliases: ["steam"],
  description: "Checks Steam Store if Games on Offer or not",
  async execute(message, args) {

	var steam = require('steam-provider')
    var provider = new steam.SteamProvider();
    let game = message.content.split(" ")[1];
    let steampng = "https://cdn.discordapp.com/attachments/458004691402489856/470344660364034049/steam.png"
    if (!game) return message.reply('Please write the name of a game on Steam. Example: `(prefix)steamstore portal 2`')
		
    provider.search(game).then(result => {
        provider.detail(result[0].id, "United Kingdom", "gbp").then(results => {
            const embed = new MessageEmbed()
            embed.setAuthor('Steam Store', steampng)
            embed.setColor("#36393F")
            embed.setTitle(result[0].name)
            embed.addField(`ID of the game`, result[0].id)
            embed.setThumbnail(results.otherData.imageUrl)
            embed.addField('types', results.genres, true)
			if (results.priceData.initialPrice == "0.0"){
				embed.addField('Price', '**FREE!**', true)
            } else if (results.priceData.initialPrice == results.priceData.finalPrice){
				embed.addField('Price', `Price **${results.priceData.initialPrice}** GBP`, true)
			} else {
				embed.addField('Price', `**SALE OFFER**\nWas **~~${results.priceData.initialPrice}~~** GBP\nNow **${results.priceData.finalPrice}** GBP\n Precent **-${results.priceData.discountPercent}**%`, true)
            }
            embed.addField('Platforms', results.otherData.platforms, true)
            //embed.addField('Metacritic Score', results.otherData.metacriticScore, true)
            embed.addField('Labels', results.otherData.features, true)
            embed.addField('Developers', results.otherData.developer, true)
            embed.addField('Publishers', results.otherData.publisher, true)
            embed.setColor("#36393F")
            message.channel.send(embed).catch(e => {
                console.log(e)
                message.reply('There was an error `' + game + '` No Game Found')
            })
        })
	})
	
  }
};
