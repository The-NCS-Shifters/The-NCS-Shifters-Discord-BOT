const i18n = require("i18n");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "patreon",
    aliases: ["donate"],
    cooldowns: 30,
    description: "SUPPORT OUR PROJECTS",
    usage: "chis!patreon",
    toggleOff: false,
    developersOnly: false,
    userpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
    botpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
    run: async (client, message, args) => {

        
        if (args[0] == "list") {

            const response = await fetch('https://raw.githubusercontent.com/ChisVR/chisjsondata/main/patrondata.json');
            const lists = await response.json();
            let currentPage = 0;
                const embeds = generateListEmbed(message, lists.lists);

                const queueEmbed = await message.channel.send({
					content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
                    embeds: [embeds[currentPage]]
				});

                try {
                    await queueEmbed.react("⬅️");
                    await queueEmbed.react("⏹");
                    await queueEmbed.react("➡️");
                } catch (error) {
                    console.error(error);
                    message.channel.send(error.message).catch(console.error);
                }

                const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
                const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

                collector.on("collect", async(reaction, user) => {
                    try {
                        if (reaction.emoji.name === "➡️") {
                            if (currentPage < embeds.length - 1) {
                                currentPage++;
                                queueEmbed.edit({
									content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
									embeds: [embeds[currentPage]]
								});
                            }
                        } else if (reaction.emoji.name === "⬅️") {
                            if (currentPage !== 0) {
                                --currentPage;
                                queueEmbed.edit({
									content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
									embeds: [embeds[currentPage]]
								});
                            }
                        } else {
                            collector.stop();
                            reaction.message.reactions.removeAll();
                        }
                        await reaction.users.remove(message.author.id);
                    } catch (error) {
                        console.error(error);
                        return message.channel.send(error.message).catch(console.error);
                    }
                });

        } else {

            const response = await fetch('https://raw.githubusercontent.com/ChisVR/chisjsondata/main/patrondata.json');
            const pay = await response.json();

            let currentPage = 0;
                const embeds = generatePayEmbed(message, pay.prices);

                const queueEmbed = await message.channel.send({
					content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
                    embeds: [embeds[currentPage]]
				});

                try {
                    await queueEmbed.react("⬅️");
                    await queueEmbed.react("⏹");
                    await queueEmbed.react("➡️");
                } catch (error) {
                    console.error(error);
                    message.channel.send(error.message).catch(console.error);
                }

                const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
                const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

                collector.on("collect", async(reaction, user) => {
                    try {
                        if (reaction.emoji.name === "➡️") {
                            if (currentPage < embeds.length - 1) {
                                currentPage++;
                                queueEmbed.edit({
									content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
									embeds: [embeds[currentPage]]
								});
                            }
                        } else if (reaction.emoji.name === "⬅️") {
                            if (currentPage !== 0) {
                                --currentPage;
                                queueEmbed.edit({
									content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
									embeds: [embeds[currentPage]]
								});
                            }
                        } else {
                            collector.stop();
                            reaction.message.reactions.removeAll();
                        }
                        await reaction.users.remove(message.author.id);
                    } catch (error) {
                        console.error(error);
                        return message.channel.send(error.message).catch(console.error);
                    }
                });
            }
            }

}

function generatePayEmbed(message, queue) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `Item: **${track.name}**\n\nPrice: **${track.price}**\n\n**URL**: **[URLHERE](${track.url})**\n\n**REWARDS**\n**${track.packageRewards}**`).join("\n\n");

        const embed = new MessageEmbed()
            .setTitle("Patreon Pay List")
            .setThumbnail(message.guild.iconURL())
            .setColor("#F8AA2A")
            .setDescription("DONATE TO HELP SUPPORT COMMUNITY KEEP OUR PROJECTS ACTIVE!\n\n" + info)
            .setTimestamp();
        embeds.push(embed);
    }

    return embeds;
}

function generateListEmbed(message, queue) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `**Discord Name**: ${track.discordName}\n\n**Twitch**: ${track.twitchName}\n\n**Vimm**: ${track.vimmName}\n\n**VRChat Name**: ${track.vrchatName}`).join("\n\n");

        const embed = new MessageEmbed()
            .setTitle("Patreon Lists")
            .setThumbnail(message.guild.iconURL())
            .setColor("#F8AA2A")
            .setDescription("DONATE TO HELP SUPPORT COMMUNITY KEEP OUR PROJECTS ACTIVE!\n\n" + info)
            .setTimestamp();
        embeds.push(embed);
    }

    return embeds;
}
