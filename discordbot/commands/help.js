const { MessageEmbed, client} = require("discord.js");
const { Menu } = require('discord.js-menu');
const fetch = require('node-fetch');

module.exports = {
  name: "help",
  aliases: ["commands"],
  description: "List of Help Commands",
  async execute(message, args) {

  var prefix = message.client.prefix;
  
  let helpMenu = new Menu(message.channel, message.author.id, [
            // Each object in this array is a unique page.
            {
                // A page object consists of a name, used as a destination by reactions...
                name: 'main',
                // A MessageEmbed to actually send in chat, and...
                content: new MessageEmbed({
                    title: 'About Menu (Page 1/4)',
                    thumbnail: { url: "https://apps.chisdealhd.co.uk/botimgs/pmoLfeY.gif" },
                    description: 'this BOT in BETA! there be bugs and stuff.',
                    color: '#F8AA2A'
                }),
                // A set of reactions with destination names attached.
                // Note there's also special destination names (read below)
                reactions: {
                    '⏹': 'delete',
                    '▶': 'general'
                }
            },
            {
                name: 'general',
                content: new MessageEmbed({
                    title: 'General Menu (Page 2/4)',
                    color: '#F8AA2A',
                    thumbnail: { url: "https://apps.chisdealhd.co.uk/botimgs/pmoLfeY.gif" },
                    fields: [
                      {
                         "name": prefix + "partners (pg)",
                         "value": "Get DATA from Our Partners Groups",
                         "inline": true

                      },
                      {
                         "name": prefix + "invite",
                         "value": "Send bot invite link",
                         "inline": true

                      },
                      {
                         "name": prefix + "uptime (u)",
                         "value": "Check the uptime",
                         "inline": true

                      },
                      {
                         "name": prefix + "steamstore (steam)",
                         "value": "Checks Steam Store if Games on Offer or not",
                         "inline": true

                      }
                    ]
                }),
                reactions: {
                    '◀': 'first',
                    '⏹': 'delete',
                    '▶': 'reactions'
                }
            },
            {
                name: 'reactions',
                content: new MessageEmbed({
                    title: 'Reactions Menu (Page 3/4)',
                    color: '#F8AA2A',
                    thumbnail: { url: "https://apps.chisdealhd.co.uk/botimgs/pmoLfeY.gif" },
                    fields: [
                      {
                         "name": prefix + "hug (hugging)",
                         "value": "HUGGING User with " + prefix + "hug @taghere",
                         "inline": true

                      },
                      {
                         "name": prefix + "neko (nekoimage)",
                         "value": "NEKO Images ***(Totally Randomly Selected)***",
                         "inline": true

                      },
                      {
                         "name": prefix + "rawr (rawr!)",
                         "value": "RAWR to User by " + prefix + "rawr @tagnamehere",
                         "inline": true

                      },
                      {
                         "name": prefix + "slap (slapping)",
                         "value": "Slap User by " + prefix + "slap @tagnamehere",
                         "inline": true

                      },
                      {
                         "name": prefix + "pat (headpats)",
                         "value": "Head Pat to User by " + prefix + "pat @tagnamehere",
                         "inline": true

                      },
                      {
                         "name": prefix + "feed (eat)",
                         "value": "Feed to User by " + prefix + "feed @tagnamehere",
                         "inline": true

                      }
                    ]
                }),
                reactions: {
                    '◀': 'general',
                    '⏹': 'delete',
                    '▶': 'music'
                }
            },
            {
                name: 'music',
                content: new MessageEmbed({
                    title: 'Music Menu (Page 4/4)',
                    color: '#F8AA2A',
                    thumbnail: { url: "https://apps.chisdealhd.co.uk/botimgs/pmoLfeY.gif" },
                    fields: [
                      {
                         "name": prefix + "nowplaying (np)",
                         "value": "Show now playing song",
                         "inline": true

                      },
                      {
                         "name": prefix + "play (p)",
                         "value": "Plays audio from YouTube or Soundcloud",
                         "inline": true

                      },
                      {
                         "name": prefix + "queue (q)",
                         "value": "Show the music queue and now playing.",
                         "inline": true

                      },
                      {
                         "name": prefix + "stop (s)",
                         "value": "Stops the music",
                         "inline": true

                      },
                      {
                         "name": prefix + "volume (v)",
                         "value": "Change volume of currently playing music",
                         "inline": true

                      }
                    ]

                }),
                reactions: {
                    '◀': 'reactions',
                    '⏹': 'delete'
                }
            }
            // The last parameter is the number of milliseconds you want the menu to collect reactions for each page before it stops to save resources
            // The timer is reset when a user interacts with the menu.
            // This is optional, and defaults to 180000 (3 minutes).
        ], 300000)
        // Run Menu.start() when you're ready to send the menu in chat.
        // Once sent, the menu will automatically handle everything else.
        helpMenu.start()


 }
};
