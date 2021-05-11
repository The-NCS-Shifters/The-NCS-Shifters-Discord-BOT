const { LOCALE } = require("../util/BotUtil");
const i18n = require("i18n");

i18n.setLocale("en");

module.exports = {
  name: "stop",
  cooldown: 3,
  aliases: ["s"],
  description: i18n.__('stop.description'),
  execute(message) {
    const queue = message.client.player.getQueue(message);

    if (!queue) return message.reply(i18n.__("stop.errorNotQueue")).catch(console.error);
    
       let isDone = message.client.player.stop(message);
        if(isDone)
			    message.channel.send(i18n.__mf("stop.result", { author: message.author })).catch(console.error);
  }
};