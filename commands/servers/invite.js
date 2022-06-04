module.exports = {
    name: "invite",
    cooldowns: 3000,
    description: "Send bot invite link",
    usage: "chis!invite",
    toggleOff: false,
    developersOnly: false,
    userpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
    botpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
    run: async (client, message, args) => {

        return message.member
            .send(
                `https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=414568541511`
            )
            .catch(console.error);

    }
}
