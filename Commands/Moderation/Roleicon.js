const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'roleicon',
    aliases: [ 'ricon'],
    description: 'Sets role icon for you',
    category: 'Moderation',
    usage: 'roleicon <role> <emoji>',
    cooldown: 3,
    userPermissions: ['ManageRoles'],
    botPermissions: ['ManageRoles'],
    run: async (client, message, args) => {

        let owner = message.author.id == message.guild.ownerId;

        if (message.member.roles.highest.position <= message.guild.members.cache.get(client.user.id).roles.highest.position && !owner) {
            return message.reply(`You need to be higher than me in the role hierarchy to ban this user!`)
        }

        try {
            
        if (!args[0]) {
            return message.reply({ content: `Please Provide A Role And An Emoji To Set As Icon!` })
        }

        let role = message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]) ||
        message.guild.roles.cache.find((r) => r.name.toLowerCase() ==
        args.slice(1).join(" ").toLowerCase()
        );

        if (!role) {
            return message.reply({ content: `Please provide a valid role.` })
        }

        const emojiargs = args[1];

        if (!emojiargs) {
            return message.reply({ content: `Please provide a valid emoji.` })
        }

        let animemojis = emojiargs.match(/[a][:]([A-Za-z0-9_~])+[:]\d{1,}/g);
        let normemojis = emojiargs.match(/[^a][:]([A-Za-z0-9_~])+[:]\d{1,}/g);

        if (animemojis) {
            for (let aemoji in animemojis) {
                const list = animemojis[aemoji].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.gif`;

                await role.setIcon(Url);

                    let embed1 = new EmbedBuilder()
                    .setColor(config.Success)
                    .setDescription(`<:tick:1114819476689539114> | Successfully Updated **${role.name}** Role Icon.`)
        
                    message.reply({ embeds: [embed1]})
            }
        }

        if (normemojis) {
            for (let emojis in normemojis) {
                const list = normemojis[emojis].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.png`;

                await role.setIcon(Url);

                    let embed2 = new EmbedBuilder()
                    .setColor(config.Success)
                    .setDescription(`<:tick:1114819476689539114> | Successfully Updated **${role.name}** Role Icon.`)
                    
                    message.reply({ embeds: [embed2]})
                }
            }
        } catch (e) {
            message.reply(`Server Is Not In Level 2 Boosting Tier.`)
        }
    }
}