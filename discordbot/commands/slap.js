const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "slap",
    aliases: ["slapping"],
    description: "Slap User with (prefix)slap @taghere",
    async execute(message, args) {

        var suffix = message.content.split(" ").slice(1).join(" ");
        if (suffix == "" || suffix == null) return message.channel.sendMessage("You are Missing a TAG or Name of USER to **SLAP**");

        const { url } = await fetch("https://nekos.life/api/v2/img/slap")
            .then((res) => res.json());

        let embed = new MessageEmbed();
        embed.setColor(0x9900FF)
        embed.setTitle("Slap")
        embed.setDescription(`**${suffix}**, you just got slapped by **<@${message.author.id}>**`)
        embed.setImage(url)
        embed.setFooter("Requested by " + message.author.username + " | Powered by nekos.life", message.client.user.avatarURL)
        embed.setTimestamp()

        message.channel.send({
            embed
        })

    }
};