const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} = require('@discordjs/voice');

const fetch = require('node-fetch');
const twitch = require("twitch-m3u8");

async function livechecksvimm(channel, servers) {
    let data;

    if (servers == "usa") {
        const urlcheck = "https://www.vimm.tv/hls/" + channel + ".m3u8";

        // Note the await keyword
        await fetch(urlcheck)
            .then((response) => {

                if (response.status == 200) {

                    data = "https://www.vimm.tv/hls/" + channel + ".m3u8";

                } else {

                    data = "OFFLINE";

                }

            })
            .catch((error) => console.log("error", error));

        return data;
    } else if (servers == "fl") {

        const url1check = "https://fl.vimm.tv/hls/" + channel + ".m3u8";

        await fetch(url1check).then((response) => {
                if (response.status == 200) {
                    data = "https://fl.vimm.tv/hls/" + channel + ".m3u8";
                } else {
                    data = "OFFLINE";
                }
            })
            .catch((error) => console.log("error", error));

        return data;

    }
}

module.exports = {
    name: "livestreamradio",
    aliases: ["liveradiostream"],
    description: "Play Global streaming Platform from (Twitch/Dlive/VIMM/YouTube)",
    botpermissions: ["CONNECT", "SPEAK", "SEND_MESSAGES", "VIEW_CHANNEL"],
    usage: "chis!liveradiostream play [twitch|vimm|dlive|youtube] monstercat",
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

                const search = message.content.split(' ').splice(3).toString();

                if (args[1] == "twitch") {

                    twitch.getStream(search).then(data => {
                        var channel = message.member.voice;

                        connection1 = joinVoiceChannel({
                            channelId: channel.channelId,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                        });

                        let resource = createAudioResource(data[0].url, {
                            inlineVolume: true
                        });

                        resource.volume.setVolume(0.5);

                        const player = createAudioPlayer();
                        connection1.subscribe(player)
                        player.play(resource);
                        message.channel.send(`${search} is Live on Twitch`)
                        
                    }).catch(err => {
                    
                        message.channel.send(`${search} is not Live on Twitch`)
                        
                    })

                } else if (args[1] == "vimm") {
                    livechecksvimm(search, "usa").then((data) => {


                        if (data == "https://www.vimm.tv/hls/" + search + ".m3u8") {

                            var channel = message.member.voice;

                            connection1 = joinVoiceChannel({
                                channelId: channel.channelId,
                                guildId: channel.guild.id,
                                adapterCreator: channel.guild.voiceAdapterCreator,
                            });

                            let resource = createAudioResource("https://www.vimm.tv/hls/" + search + ".m3u8", {
                                inlineVolume: true
                            });

                            resource.volume.setVolume(0.5);

                            const player = createAudioPlayer();
                            connection1.subscribe(player)
                            player.play(resource);
                            
                            message.channel.send(`${search} is Live on Vimm Using united states Server`)

                        } else {
                            livechecksvimm(search, "fl").then((data1) => {
                                if (data1 == "https://fl.vimm.tv/hls/" + search + ".m3u8") {

                                    var channel = message.member.voice;

                                    connection1 = joinVoiceChannel({
                                        channelId: channel.channelId,
                                        guildId: channel.guild.id,
                                        adapterCreator: channel.guild.voiceAdapterCreator,
                                    });

                                    let resource = createAudioResource("https://fl.vimm.tv/hls/" + search + ".m3u8", {
                                        inlineVolume: true
                                    });

                                    resource.volume.setVolume(0.5);

                                    const player = createAudioPlayer();
                                    connection1.subscribe(player)
                                    player.play(resource);
                                    
                                    message.channel.send(`${search} is Live on Vimm Using finland Server`)

                                } else {
                                    message.channel.send(`${search} is not Live on Vimm`)
                                }
                            })
                        }

                    })

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
                    inlineVolume: true
                });

                resource.volume.setVolume(0.2);

                const player = createAudioPlayer();
                connection1.destroy();
                player.stop(resource);
                message.delete().catch(O_o => {})
                return

            }
        }

    }
}
