const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'purge',
    aliases: ['clear'],
    description: 'Clears number of messages in perticular channel.',
    category: 'Moderation',
    usage: 'purge <amount>',
    cooldown: 3,
    userPermissions: ['ManageMessages'],
    botPermissions: ['ManageMessages'],
    run: async (client, message, args) => {

        try {
            
            const amount = parseInt(args[0]);

            if (!amount) {
                return message.reply({ content: 'Please provide a valid amount.' });
            }

            if (amount > 99) {
                return message.reply({ content: 'You can only clear 99 messages at a time.' });
            }

            if (amount < 1) {
                return message.reply({ content: 'You must clear at least 1 message.' });
            } 

            await message.channel.bulkDelete(amount, true).catch((_) => { });

            let embed = new EmbedBuilder()
            .setColor(config.Success)
            .setDescription(`<:tick:1114819476689539114> | Successfully Cleared ${amount} Messages.`)

            message.channel.send({ embeds: [embed]}).then((m) => setTimeout(() => m.delete(), 10000));
        } catch (e) {
            message.reply(`You cant Delete Message Older Than 14 Days.`)
        }
    }
}