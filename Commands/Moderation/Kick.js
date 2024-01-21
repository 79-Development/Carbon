const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'kick',
    aliases: ['getlost'],
    description: 'Kicks a User from server',
    category: 'Moderation',
    usage: 'kick <user> [reason]',
    cooldown: 3,
    userPermissions: ['KickMembers'],
    botPermissions: ['KickMembers'],
    run: async (client, message, args) => {
        let user;
        if (message.mentions.members.first()) {
            user = message.mentions.members.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]);
        }

        let owner = message.author.id == message.guild.ownerId;

        if (!args[0]) {
            return message.reply('Please provide a user to kick!')
        }

        if (!user) {
            return message.reply(`That user isn't in this guild!`)
        }

        if (user.id === message.guild.ownerId) {
            return message.reply(`You can't kick the server owner!`)
        }

        if (user.id === message.author.id) {
            return message.reply(`You can't kick yourself!`)
        }

        if (user.id === client.user.id) {
            return message.reply(`You can't kick me!`)
        }

        if(message.member.roles.highest.position <= message.guild.members.cache.get(client.user.id).roles.highest.position && !owner) {
            return message.channel.send(`You need to be higher than me in the role hierarchy to kick this user!`);
        }
          
        if(message.member.roles.highest.position <= user.roles.highest.position && !owner) {
            return message.channel.send(`You can't kick a user with same or higher roles as you!`);
        }

        if (!user.bannable) {
            return message.reply(`I can't kick that user!`)
        }

        const reason = args.slice(1).join(" ") || "No reason provided"

        await user.kick({ reason: reason }).catch((_) => { });
        user.send({
            content: `You have been kicked from **${message.guild.name}** for **${reason}**`
        }).catch((_) => { })


        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setDescription(`<:tick:1114819476689539114> | Successfully **${user.user.username}** has been kicked!`)

        message.reply({ embeds: [embed] })
    }
}