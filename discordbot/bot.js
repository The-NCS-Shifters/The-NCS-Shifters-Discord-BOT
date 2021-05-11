/**
 * Module Imports
 */
const { Client, Collection, WebhookClient, Util } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX, WEBHOOKID, WEBHOOKTOKEN } = require("./util/BotUtil");
const fetch = require("node-fetch");
const request = require("request");
const path = require("path");
const i18n = require("i18n");

const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const webhookchis = new WebhookClient(WEBHOOKID, WEBHOOKTOKEN);

i18n.configure({
  locales: ["en", "es", "ko", "fr", "tr", "pt_br", "zh_cn", "zh_tw"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    console.log("warn", msg);
  },

  logErrorFn: function (msg) {
    console.log("error", msg);
  },

  missingKeyFn: function (locale, value) {
    return value;
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

const { Player, Utils } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false,
});

client.player = player;

client.db = require("quick.db");
client.request = new (require("rss-parser"))();


function handleUploads() {
    if (client.db.fetch(`postedVideos`) === null) client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=UCbEoTKYw6Tk_pVjHkikxcJw`)
        .then(data => {
            //console.log("Checking")
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
        
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                //let channel = bot.channels.cache.get(client.config.channel);
                
                //console.log(`Found Video: ${Discord.Util.escapeMarkdown(parsed.title)}: ${parsed.link}`)
                
                //console.log(parsed)
                const channel = client.channels.cache.get('840954721786265601');
                
                if (!channel) return;
                var msgdata = `__**[YOUTUBE]**__ \n\n{{AuthorName}} uploaded {{Title}} at {{CreatedAt}} {{Url}} `;
                let message = msgdata
                    .replace(/{{AuthorName}}/g, parsed.author)
                    .replace(/{{Title}}/g, Util.escapeMarkdown(parsed.title))
                    .replace(/{{CreatedAt}}/g, parsed.pubDate)
                    .replace(/{{Url}}/g, parsed.link);
                    
                let author = parsed.author;
                
                
                let descmsg = `[Click here to see this video]({{Url}})`;
                
                let msgdesc = descmsg.replace(/{{Url}}/g, parsed.link);
                
	try {

		webhookchis.send({
    "username": "The NCS Shifters Feed",
    "avatarURL": "https://i.imgur.com/46z2Bc2.jpg",
    "content": message,
    "embeds": [{
        "author": {
            "name": author,
            "url": "https://www.youtube.com/channel/UCbEoTKYw6Tk_pVjHkikxcJw",
            "icon_url": "https://i.imgur.com/46z2Bc2.jpg"
        },
        "description": msgdesc,
        "color": 15258703,
        "thumbnail": {
            "url": "https://i.pinimg.com/originals/de/1c/91/de1c91788be0d791135736995109272a.png"
        },
        "footer": {
            "text": "Created by @ChisdealHD",
            "icon_url": "https://cdn.discordapp.com/attachments/503975295112577024/675993659107442717/Webp.net-resizeimage.png"
        }
    }]
});
	} catch (error) {
		console.error('Error trying to send: ', error);
	}
                
                
            }
        });
    },  60 * 1000);
}
client.player
    // Emitted when channel was empty.
    .on('channelEmpty',  (message, queue) =>
        message.channel.send(`The **${queue.connection.channel}** was empty, music was removed!`))
    // Emitted when a song was added to the queue.
    .on('songAdd',  (message, queue, song) =>
        message.channel.send(`**${song.name}** has been added to the queue!`))
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd',  (message, queue, playlist) =>
        message.channel.send(`${playlist.name} Has Loaded, Added to QUEUE!`))
    // Emitted when there was no more music to play.
    .on('queueEnd',  (message, queue) =>
        message.channel.send(`Left Channel`))
    // Emitted when a song changed.
    .on('songChanged', (message, newSong, oldSong) =>
        message.channel.send(`**${newSong.name}** is now playing!`))
    // Emitted when a first song in the queue started playing (after play method).
    .on('songFirst',  (message, song) =>
        message.channel.send(`**${song.name}** is now playing!`))
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (message, queue) =>
        message.channel.send(`I got disconnected from the channel, music was removed.`))
    // Emitted when there was an error with NonAsync functions.
    .on('error', (message, error) => {
        switch (error) {
            // Thrown when the YouTube search could not find any song with that query.
            case 'SearchIsNull':
                message.channel.send(`No song with that query was found.`);
                break;
            // Thrown when the provided YouTube Playlist could not be found.
            case 'InvalidPlaylist':
                message.channel.send(`No Playlist was found with that link.`);
                break;
            // Thrown when the provided Spotify Song could not be found.
            case 'InvalidSpotify':
                message.channel.send(`No Spotify Song was found with that link.`);
                break;
            // Thrown when the Guild Queue does not exist (no music is playing).
            case 'QueueIsNull':
                message.channel.send(`There is no music playing right now.`);
                break;
            // Thrown when the Members is not in a VoiceChannel.
            case 'VoiceChannelTypeInvalid':
                message.channel.send(`You need to be in a Voice Channel to play music.`);
                break;
            // Thrown when the current playing song was an live transmission (that is unsupported).
            case 'LiveUnsupported':
                message.channel.send(`We do not support YouTube Livestreams.`);
                break;
            // Thrown when the current playing song was unavailable.
            case 'VideoUnavailable':
                message.channel.send(`Something went wrong while playing the current song, skipping...`);
                break;
            // Thrown when provided argument was Not A Number.
            case 'NotANumber':
                message.channel.send(`The provided argument was Not A Number.`);
                break;
            // Thrown when the first method argument was not a Discord Message object.
            case 'MessageTypeInvalid':
                message.channel.send(`The Message object was not provided.`);
                break;
            // Thrown when the Guild Queue does not exist (no music is playing).
            default:
                message.channel.send(`**Unknown Error Ocurred:** ${error}`);
                break;
        }
    });


/**
 * Client Events
 */
client.on("ready", () => {
  
  console.log(`${client.user.username} Discord BOT Ready!`);
  
       client.user.setActivity(`The NCS Shifters is Starting... | Loading Modules / Commands`)
        .then(() => {

            handleUploads();
            setInterval(() => {

                var member = client.guilds.cache.get("833631656710897684")
                
                client.channels.cache.get("840938813890494464").setName(`USERS: ${member.roles.cache.get('834282752215089202').members.filter(m => !m.user.bot).size}`);
                client.channels.cache.get("840938876733882368").setName(`BOTS: ${member.roles.cache.get('834282959296135208').members.filter(m => m.user.bot).size}`);
                client.channels.cache.get("840938916067409941").setName(`STAFF: ${member.roles.cache.get('840941760456556584').members.filter(m => !m.user.bot).size}`);
                //bot.channels.cache.get("718534473238446102").setName(`SUPPORTER: ${member.roles.cache.get('718534469820088352').members.filter(m => !m.user.bot).size}`);
                
                request("https://api.chisdealhd.co.uk/v1/assets/TNCSS/counter",
                function(err, res, body) {
                    var data = JSON.parse(body);

                    client.channels.cache.get("840939293002563604").setName(`TWITCH: ${data.twitch}`);
                    client.channels.cache.get("840939331836444732").setName(`DLIVE: ${data.dlive}`);
                    client.channels.cache.get("840939365794054205").setName(`VIMM: ${data.vimm}`);
                    client.channels.cache.get("840939400833269770").setName(`TROVO: ${data.trovo}`);
                    client.channels.cache.get("840939447376937032").setName(`YOUTUBE: ${data.youtube}`);
                    client.channels.cache.get("840939102034722826").setName(`VIEWERS: ${data.totalviewers}`);
                
                })

            }, 500000)
            
            
            //prefix config    
            setInterval(() => {
                client.user.setActivity(`The NCS Shifters BOT. | Prefix ${PREFIX} | Nightcore Playlist / Music / Command BOT`).then(function(setActivity) {
                    setTimeout(function() {
                        client.user.setActivity('The NCS Shifters: Its Ongoing Project bring royality Free / NCS into Nightcore on Discord Servers')
                    }, 30000)
                    setTimeout(function() {
                        client.user.setActivity(`The NCS Shifters: I'm Connected to ${client.guilds.cache.size} Servers`)
                    }, 40000)
                    setTimeout(function() {
                        client.user.setActivity('The NCS Shifters: Creators: ChisdealHDYT#7172, AtomicGaming666#8864, nathanwgamingYT#8610, crazyrubytime#3940')
                    }, 50000)
                    setTimeout(function() {
                        client.user.setActivity(`The NCS Shifters: If you Want Play Our Music, Or any Commands. Please do ${PREFIX}help for more`)
                    }, 60000)
                })
            }, 70000)

        })
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});
