const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'membercount',
    aliases: ['mc'],
    description: 'Shows the membercount of the server.',
    category: 'Utility',
    usage: 'membercount',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setTitle(`Membercount`)
        .setDescription(`${message.guild.memberCount} members`)

        message.reply({ embeds: [embed] })
    }
}