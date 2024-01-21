const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'server',
    aliases: ['svr'],
    description: 'Shows the icon/banner of the server.',
    category: 'Utility',
    usage: 'server <icon/banner>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        if (args[0] === 'icon') {

            let icon = message.guild.iconURL({ dynamic: true, size: 1024 })
            let avatar = message.guild.iconURL({ dynamic: true, size: 1024 }) || client.user.displayAvatar()

            if (!icon) {
                return message.reply({ content: `<:cross:1114823672163729490> | This server does not have any icon..` })
            }

            const embed = new EmbedBuilder()
            .setColor(config.Success)
            .setAuthor({ name: `${message.guild.name}`, iconURL: avatar})
            .setImage(icon)
        
            const but1 = new ButtonBuilder().setLabel('JPEG').setURL(`${message.guild.iconURL({ extension: "jpeg", size: 1024 })}`).setStyle(ButtonStyle.Link);
            const but2 = new ButtonBuilder().setLabel('PNG').setURL(`${message.guild.iconURL({ extension: "png", size: 1024 })}`).setStyle(ButtonStyle.Link);
            const but3 = new ButtonBuilder().setLabel('GIF').setURL(`${message.guild.iconURL({ extension: "gif", size: 1024 })}`).setStyle(ButtonStyle.Link);

            if (message.guild.iconURL({ dynamic: true, size: 1024 }).split('?')[0].endsWith('.gif')) {
                button = new ActionRowBuilder().addComponents(but1, but2, but3)
            } else (
                button = new ActionRowBuilder().addComponents(but1, but2)
            )

            message.reply({ embeds: [embed], components: [button] })

        } else if (args[0] === 'banner') {

            let banner = message.guild.bannerURL({ dynamic: true, size: 4096 })
            let avatar = message.guild.iconURL({ dynamic: true, size: 1024 }) || client.user.displayAvatar()

            if (!banner) {
                return message.reply({ content: `<:cross:1114823672163729490> | This server does not have any banner..` })
            }

            const embed = new EmbedBuilder()
            .setColor(config.Success)
            .setAuthor({ name: `${message.guild.name}`, iconURL: avatar})
            .setImage(icon)

            const but1 = new ButtonBuilder().setLabel('JPEG').setURL(`${message.guild.bannerURL({ extension: "jpeg", size: 4096 })}`).setStyle(ButtonStyle.Link);
            const but2 = new ButtonBuilder().setLabel('PNG').setURL(`${message.guild.bannerURL({ extension: "png", size: 4096 })}`).setStyle(ButtonStyle.Link);
            const but3 = new ButtonBuilder().setLabel('GIF').setURL(`${message.guild.bannerURL({ extension: "gif", size: 4096 })}`).setStyle(ButtonStyle.Link);


            if (message.guild.bannerURL({ dynamic: true, size: 4096 }).split('?')[0].endsWith('.gif')) {
                button = new ActionRowBuilder().addComponents(but1, but2, but3)
            } else (
                button = new ActionRowBuilder().addComponents(but1, but2)
            )

            message.reply({ embeds: [embed], components: [button] })
        }
    }
}