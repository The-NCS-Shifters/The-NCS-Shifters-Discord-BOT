const { MessageEmbed } = require("discord.js");
const { LOCALE } = require("../util/BotUtil");
//const i18n = require("i18n");
const i18n = require("i18n");

i18n.setLocale('en');

module.exports = {
  name: "queue",
  cooldown: 5,
  aliases: ["q"],
  description: i18n.__("queue.description"),
  async execute(message, args) {

	 const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return message.reply(i18n.__("queue.missingPermissionMessage"));

    const queue = message.client.player.getQueue(message);
    if (!queue) return message.channel.send(i18n.__("queue.errorNotQueue"));

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, queue.songs);

    const queueEmbed = await message.channel.send(
      `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
      embeds[currentPage]
    );

    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("➡️");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction, user) =>
      ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
    const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(
              i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds[currentPage]
            );
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(
              i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds[currentPage]
            );
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
};

function generateQueueEmbed(message, queue) {
  let embeds = [];
  let k = 10;

  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `${++j} - [${track.name}](${track.url})`).join("\n");

    const embed = new MessageEmbed()
      .setTitle(i18n.__("queue.embedTitle"))
      .setThumbnail(message.guild.iconURL())
      .setColor("#F8AA2A")
      .setDescription(
        i18n.__mf("queue.embedCurrentSong", { title: queue[0].name, url: queue[0].url, info: info })
      )
      .setTimestamp();
    embeds.push(embed);
  }

  return embeds;
}
