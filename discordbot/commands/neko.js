const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "neko",
    aliases: ["nekoimage"],
    description: "NEKO Images ***(Totally Randomly Selected)***",
    async execute(message, args) {

        const { url } = await fetch("https://nekos.life/api/v2/img/neko")
            .then((res) => res.json());

        let embed = new MessageEmbed();
        embed.setColor(0x9900FF)
        embed.setTitle("Neko Images")
        embed.setDescription("NEKO Images Random Generated if do Commands")
        embed.setImage(url);
        embed.setFooter("Requested by " + message.author.username + " | Powered by nekos.life", message.client.user.avatarURL)
        embed.setTimestamp()

        message.channel.send({
            embed
        })

    }
};