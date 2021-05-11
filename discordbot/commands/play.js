const { LOCALE, DEFAULT_VOLUME, MAX_PLAYLIST_SIZE } = require("../util/BotUtil");
const i18n = require("i18n");

i18n.setLocale("en");

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: i18n.__("play.description"),
  async execute(message, args) {
  
    const { channel } = message.member.voice;
    const serverQueue = message.client.player.getQueue(message);
    
    if (!args.length)
      return message
        .reply(i18n.__mf("play.usageReply", { prefix: message.client.prefix }))
        .catch(console.error);
    if (!channel) return message.reply(i18n.__("play.errorNotChannel")).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.reply(i18n.__("play.missingPermissionConnect"));
    if (!permissions.has("SPEAK")) return message.reply(i18n.__("missingPermissionSpeak"));

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message
        .reply(i18n.__mf("play.errorNotInSameChannel", { user: message.client.user }))
        .catch(console.error);
        
 
   if (args.join(' ').toLowerCase() == "ncs") {
        
        await message.client.player.playlist(message, {
            search: 'https://www.youtube.com/playlist?list=PLe_blQcSwktKQ1v-r2mG_xaPUlJLzzBj8',
            maxSongs: MAX_PLAYLIST_SIZE
        }).then(async () => {
        
          let status = message.client.player.setQueueRepeatMode(message, true);
          if(status === null)
            return;
        
        })

    } else if (args.join(' ').toLowerCase() == "99l") {
        
        await message.client.player.playlist(message, {
            search: 'https://www.youtube.com/playlist?list=PLe_blQcSwktKAQotj-gae5jkxQRrEnRw5',
            maxSongs: MAX_PLAYLIST_SIZE
        }).then(async () => {
        
          let status = message.client.player.setQueueRepeatMode(message, true);
          if(status === null)
            return;
        
        })

    } else if (args.join(' ').toLowerCase() == "pr") {
        
        /* await message.client.player.playlist(message, {
            search: 'https://www.youtube.com/playlist?list=PLe_blQcSwktLKxC6iifzOXXee_w9GSI_t',
            maxSongs: MAX_PLAYLIST_SIZE
        }).then(async () => {
        
          let status = message.client.player.setQueueRepeatMode(message, true);
          if(status === null)
            return;
        
        }) */
        
        message.reply("Coming soon, no exact ETA when Songs be made on this Brand. but Stay Tuned?");

    } else if (args.join(' ').toLowerCase() == "br") {
        
        /* await message.client.player.playlist(message, {
            search: 'https://www.youtube.com/playlist?list=PLe_blQcSwktIdQJButyOSDQEL6A7x4wL-',
            maxSongs: MAX_PLAYLIST_SIZE
        }).then(async () => {
        
          let status = message.client.player.setQueueRepeatMode(message, true);
          if(status === null)
            return;
        
        }) */
        
        message.reply("Coming soon, no exact ETA when Songs be made on this Brand. but Stay Tuned?");

    } else if (args.join(' ').toLowerCase() == "all") {
        
        await message.client.player.playlist(message, {
            search: 'https://www.youtube.com/playlist?list=PLe_blQcSwktKqjb8RY14vLXCnUHbcR-_e',
            maxSongs: MAX_PLAYLIST_SIZE
        }).then(async () => {
        
          let status = message.client.player.setQueueRepeatMode(message, true);
          if(status === null)
            return;
        
        })

    } else {
    
      message
        .reply('ERROR: INVALID PLAYLIST, List: `99L`, `NCS`, `PR`, `BR`, `ALL`');
    
    }
        
  }
};