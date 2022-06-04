const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');


const {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');


module.exports = {
   name: "radio",
   aliases: ["liveradio"],
   description: "Play Global Radio Stations, runs on ChisdealHDYT API",
   botpermissions: ["CONNECT", "SPEAK", "SEND_MESSAGES", "VIEW_CHANNEL"],
   usage: "chis!radio play truckersfm",
   cooldowns: 2000,
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

    var connection = client.sqlconn;

    function getGuildToggle(guildID) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM guild_command_toggle WHERE guild_id = '${guildID}'`, (err, rows) => {
                if (err) return reject(err);

                resolve(rows);
            });
        });
    }

    const [guildsettingstoggle] = await getGuildToggle(message.guild.id) // destructuring 'rows' array
        .catch(console.error);


    if (guildsettingstoggle.musicToggle != 0) {

        if (args[0] == "play") {

            const search = message.content.split(' ').splice(2).toString();

            const response = await fetch(`https://api.chisdealhd.co.uk/v1/radiopublic/${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (!search) {
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor('#F8AA2A')
                .setDescription(`You didn\'t provide a Radio name`)]})
                return
            }

            if (json.status == "success") {
                
                var channel = message.member.voice;
                
                connection1 = joinVoiceChannel({
                    channelId: channel.channelId,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                
                let resource = createAudioResource(json.radioURL, {
                    inlineVolume : true
                });

                resource.volume.setVolume(0.2);
                
                const player = createAudioPlayer();
                connection1.subscribe(player)
                player.play(resource);
                
                message.reply(`Playing: ${json.radioName}`);

            } else {

                message.channel.send({
                embeds: [new MessageEmbed()
                .setColor('#F8AA2A')
                .setDescription(`Invald Lists, List: ${json.listradios}`)]})

            }

        } else if (args[0] == "stop") {


            if (!message.member.voice.channel) return
            var channel = message.member.voice;
                
            connection1 = joinVoiceChannel({
                channelId: channel.channelId,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
                
            let resource = createAudioResource("", {
                inlineVolume : true
            });

            resource.volume.setVolume(0.2);
                
            const player = createAudioPlayer();
            connection1.destroy();
            player.stop(resource);
            message.delete().catch(O_o => {})
            return

        } else if (args[0] == "np") {

            const search = message.content.split(' ').splice(2).toString();

            const response = await fetch(`https://api.chisdealhd.co.uk/v1/radiopublic/${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (!search) {
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor('#F8AA2A')
                .setDescription(`You didn\'t provide a Radio name`)]})
                return
            }

            if (json.status == "success") {

                if (json.nowPlaying.song == null) return message.reply("This Radio doesnt have Now Playing API, Sorry about this Actions. if has API Please contact us");
                const playingEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${json.radioName} - Now Playing`)
                    .setTimestamp()
                    .addField("Current Song:", json.nowPlaying.song)
                    .setImage(json.nowPlaying.art)
                    .setFooter(message.client.user.username, message.client.user.avatarURL)
                message.delete().catch(O_o => {})
                message.channel.send({
                    embeds: [playingEmbed]
                });

            } else {

                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor('#F8AA2A')
                    .setDescription(`Invald Lists, List: ${json.listradios}`)]})

            }
        } else if (args[0] == "requestradio") {

            message.channel.send("To Request Radio Listing Please contact us on our Discord Server with following Radio Name, Radio URL, Radio API if has 1 @ https://discord.gg/RYscPHc");

        } else {

            message.channel.send("Invalid Command, Valid command is `play` & `stop` & `np` & `requestradio`");

        }
    } else {

        message.channel.send("Server Adminstrator Disabled Music Intergration on this Server. If want Renable it, please go to our Dashboard and Re-enable it");

    }
   },
};
