const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'serverleave',
    aliases: ['sle'],
    owner: true,
    description: '',
    category: '',
    usage: '',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        let id = args[0];

        if (!id) {
            return message.reply(`You didn't provided the server Id.`)
        }

        let guild = await client.guilds.fetch(id);

        if (!guild) {
            return message.reply(`You didn't provided a valid server Id.`)
        }

        await guild.leave();

        let embed = new EmbedBuilder()
        .setColor(config.EmbedColor)
        .setDescription(`**Successfully left Id:** \`${id}\``)
 
        message.reply({ embeds: [embed] })
    }
}