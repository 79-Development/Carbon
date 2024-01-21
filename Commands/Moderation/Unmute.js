const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'unmute',
    aliases: [''],
    description: 'Unmutes A User',
    category: 'Moderation',
    usage: 'unmute <user>',
    cooldown: 3,
    userPermissions: ['ModerateMembers'],
    botPermissions: ['ModerateMembers'],
    run: async (client, message, args) => {

        let user;
        if (message.mentions.members.first()) {
            user = message.mentions.members.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]);
        }

        if (!args[0]) {
            return message.reply('Please provide a user to timeout!')
        }

        if (!user.communicationDisabledUntil) {
            return message.reply('This user is not muted.')
        }

        await user.edit({ communicationDisabledUntil: null }).catch((_) => { });

        let embed = new EmbedBuilder()
        .setColor(config.Success)
        .setDescription(`Successfully Unmuted ${user.user.username}.`)

        message.reply({ embeds: [embed] })
    }
}