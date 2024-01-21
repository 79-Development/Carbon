const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    description: 'Shows the avatar of the user.',
    category: 'Utility',
    usage: 'avatar <user>',
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

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setAuthor({ name: `${user.tag}'s global avatar`, iconURL: user.displayAvatarURL({ dynamic: true })})
        .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))

        const but1 = new ButtonBuilder().setLabel('JPEG').setURL(`${user.displayAvatarURL({ extension: "jpeg", forceStatic: true, size: 2048 })}`).setStyle(ButtonStyle.Link);
        const but2 = new ButtonBuilder().setLabel('PNG').setURL(`${user.displayAvatarURL({ extension: "png", forceStatic: true, size: 2048 })}`).setStyle(ButtonStyle.Link);
        const but3 = new ButtonBuilder().setLabel('GIF').setURL(`${user.displayAvatarURL({ extension: "gif", forceStatic: true, size: 2048 })}`).setStyle(ButtonStyle.Link);


        if (user.displayAvatarURL({ dynamic: true, size: 1024 }).split('?')[0].endsWith('.gif')) {
            button = new ActionRowBuilder().addComponents(but1, but2, but3)
        } else (
            button = new ActionRowBuilder().addComponents(but1, but2)
        )
     
        message.reply({ embeds: [embed], components: [button] })
    }
}