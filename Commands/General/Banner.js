const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'banner',
    aliases: [''],
    description: 'Shows the banner of the user.',
    category: 'Utility',
    usage: 'banner <user>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first() || args[0];
        } else if (args[0]) {
            user = await client.users.fetch(args[0], { force: true }).catch(err => { return undefined; })
        } else {
            user = message.author;
        }
        
        user = await user.fetch();
        
        if (!user.bannerURL()) {
            return message.reply({ content: `User does not have a banner.` })
        }

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setAuthor({ name: `${user.tag}'s banner`, iconURL: user.displayAvatarURL({ dynamic: true })})
        .setImage(user.bannerURL({ dynamic: true, size: 4096 }))

        const but1 = new ButtonBuilder().setLabel('JPEG').setURL(`${user.bannerURL({ extension: "jpeg", forceStatic: true, size: 4096 })}`).setStyle(ButtonStyle.Link);
        const but2 = new ButtonBuilder().setLabel('PNG').setURL(`${user.bannerURL({ extension: "png", forceStatic: true, size: 4096 })}`).setStyle(ButtonStyle.Link);
        const but3 = new ButtonBuilder().setLabel('WEBG').setURL(`${user.bannerURL({ extension: "webp", forceStatic: true, size: 4096 })}`).setStyle(ButtonStyle.Link);
        const but4 = new ButtonBuilder().setLabel('GIF').setURL(`${user.bannerURL({ extension: "gif", forceStatic: true, size: 4096 })}`).setStyle(ButtonStyle.Link);


        if (user.bannerURL({ dynamic: true, size: 4096  }).split('?')[0].endsWith('.gif')) {
            button = new ActionRowBuilder().addComponents(but1, but2, but3, but4)
        } else (
            button = new ActionRowBuilder().addComponents(but1, but2, but3)
        )
     
        message.reply({ embeds: [embed], components: [button] })
    }
}