const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'nickname',
    aliases: ['nick'],
    description: `To change someone's nickname.`,
    category: 'Moderation',
    usage: 'nickname <user>\nnickname reset <user>',
    cooldown: 3,
    userPermissions: ['ManageNicknames'],
    botPermissions: ['ManageNicknames'],
    run: async (client, message, args) => {
        
        if(!["reset"].includes(args[0])) {

            if (!args[0]) {
                return message.reply(`Please provide a user.`)
            }

            let user;
            if (message.mentions.members.first()) {
                user = message.mentions.members.first();
            } else if (args[0]) {
                user = message.guild.members.cache.get(args[0]);
            }

            if (!user) {
                return message.reply(`That user isn't in this guild!`)
            }

            if (user.roles.highest.position > message.guild.members.cache.get(client.user.id).roles.highest.position) {
                return message.reply(`I can't chnage nickname that user!`)
            }


            if (args.slice(1).length == 0) {
                return message.reply(`Please provide Nickname to set`)
            }

            let nickName = args.slice(1).join(" ");

            if (nickName.length > 32) {
                return message.reply(`Nickname cannot be more than 32 characters.`)
            }

            user.setNickname(nickName).catch((_) => { });

            let embed = new EmbedBuilder()
            .setColor(config.Success)
            .setDescription(`<:tick:1114819476689539114> | Successfully changed ${user.user.username}'s nickname to (${nickName})`)
            
            message.reply({ embeds: [embed] })

        } else if (args[0] === 'reset') {

            if (!args[1]) {
                return message.reply(`Please provide a user.`)
            }

            let user;
            if (message.mentions.members.first()) {
                user = message.mentions.members.first();
            } else if (args[1]) {
                user = message.guild.members.cache.get(args[1]);
            }

            if (!user) {
                return message.reply(`That user isn't in this guild!`)
            }

            if (user.roles.highest.position > message.guild.members.cache.get(client.user.id).roles.highest.position) {
                return message.reply(`I can't chnage nickname that user!`)
            }
            
            user.setNickname(null).catch((_) => { });
            
            let embed = new EmbedBuilder()
            .setColor(config.Success)
            .setDescription(`<:tick:1114819476689539114> | Successfully reset ${user.nickname} nickname to (${user.user.username})`)

            message.reply({embeds: [embed] })
        }

    }
}