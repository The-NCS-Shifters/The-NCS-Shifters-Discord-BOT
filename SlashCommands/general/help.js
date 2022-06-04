const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
 } = require("discord.js");
 const helpemoji = require("../../config/help.json");
 const { clientname, clientavatar } = require("../../config/settings.json");

module.exports = {
   name: "help",
   description: "Help Command",
   type: "CHAT_INPUT",
   run: async (client, interaction, args) => {

    const roleColor =
    interaction.guild.me.displayHexColor === "#000000"
       ? "#ffffff"
       : interaction.guild.me.displayHexColor;
 const directories = [
    ...new Set(client.slashCommands.map((cmd) => cmd.directory)),
 ];

 const formatString = (str) => {
    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
 };

 const categories = directories.map((dir) => {
    const getCommands = client.slashCommands
       .filter((cmd) => cmd.directory === dir)
       .map((cmd) => {
          return {
             name: cmd.name ? cmd.name : "No command name!",
             description: cmd.description
                ? cmd.description
                : "No command description!",
          };
       });

    return {
       directory: formatString(dir),
       commands: getCommands,
    };
 });

 const embed = new MessageEmbed()
    .setTitle(`${clientname || "Bot"}'s Commands`)
    .setDescription(
       "Please choose one of the options in the dropdown below!"
    )
    .setColor(roleColor)
    .setFooter(`${clientname}`, `${clientavatar}`)
    .setTimestamp();

 const components = (state) => [
    new MessageActionRow().addComponents(
       new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("Please select a category!")
          .setDisabled(state)
          .addOptions([
             categories.map((cmd) => {
                return {
                   label: `${cmd.directory}`,
                   value: `${cmd.directory.toLowerCase()}`,
                   emoji: `${helpemoji[cmd.directory.toLowerCase()]}`,
                   description:
                      `Commands from ` + `${cmd.directory}` + " category",
                };
             }),
          ])
    ),
 ];

 const inMessage = await interaction.followUp({
    embeds: [embed],
    components: components(false),
 });

 const filter = (interaction) => interaction.user.id === interaction.user.id;

 const collector = interaction.channel.createMessageComponentCollector({
    filter,
    componentType: "SELECT_MENU",
    time: 60000,
 });

 collector.on("collect", (interaction) => {
    const [directory] = interaction.values;
    const category = categories.find(
       (x) => x.directory.toLowerCase() === directory
    );

    const embed2 = new MessageEmbed()
       .setTitle(`${directory.charAt(0).toUpperCase()}${directory.slice(1).toLowerCase()}`)
       .setDescription(
          "" + category.commands.map((cmd) => `✪ | \`${cmd.name}\` (*${cmd.description}*)`).join("\n ")
       )
       .setColor(roleColor);

    interaction.update({ embeds: [embed2] });
 });

 collector.on("end", () => {
    inMessage.edit({ components: components(true) });
 });

   },
};