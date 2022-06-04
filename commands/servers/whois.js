const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../utils/funt.js");

module.exports = {
   name: "whois",
   aliases: ["who", "user", "info"],
   description: "Returns user information",
   userpermissions: ["ADMINISTRATOR"],
   botpermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
   usage: "chis!whois @name",
   cooldowns: 2000,
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

    const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

        .addField('Member information:', stripIndents `**- Display name:** ${member.displayName}
            **- Joined at:** ${joined}
            **- Roles:** ${roles}`, true)

        .addField('User information:', stripIndents `**- ID:** ${member.user.id}
            **- Username**: ${member.user.username}
            **- Tag**: ${member.user.tag}
            **- Created at**: ${created}`, true)

        .setTimestamp()
  
        message.channel.send({
            embeds: [embed]
        });

   },
};
