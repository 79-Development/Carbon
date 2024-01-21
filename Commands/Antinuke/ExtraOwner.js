const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'extraowner',
    aliases: ['owner', 'eo'],
    description: '',
    usage: '',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        if (message.author.id !== message.guild.ownerId) {
            return message.reply({ content: `Only the guild owner can use this command.` })
        }

        if (!args[0]) {
            return message.reply(`Please provide a valid action. (add, remove, show)`)
        }

        let abc = await client.db.get(`${message.guild.id}_owner`)

        if (abc === null) {
            await client.db.set(`${message.guild.id}_owner`, { ExtraOwner: [] })
        }


        let user;
        if (message.mentions.members.first()) {
            user = message.mentions.members.first();
        } else if (args[1]) {
            user = message.guild.members.cache.get(args[1]);
        }

        if (args[0] === 'add') {
            if (!user) {
                return message.reply(`Please provide a valid user.`)
            }

                await client.db.get(`${message.guild.id}_owner`).then(async (data) => {

                    if (data.ExtraOwner.length === 2) {
                        return message.reply(`You have reached the ExtraOwner limit.`)
                    }

                    if (user) {
                        const userId = user.id;
                        if (userId == data.ExtraOwner) {
                            let emb1 = new EmbedBuilder()
                            .setColor(config.Danger)
                            .setDescription(`<:crosszz:1124281794670362644> | <@${user.id}> is already a Extra Owner.`)
                            message.reply({ embeds: [emb1] })
                        } else {
                            await client.db.push(`${message.guild.id}_owner.ExtraOwner`, userId);
                            let emb2 = new EmbedBuilder()
                            .setColor(config.Success)
                            .setDescription(`<:tick:1114819476689539114> | Successfully added <@${user.id}> as Extra Owner.`)
                            message.reply({ embeds: [emb2] })
                        }
                    }
                })

        } else if (args[0] === 'remove') {
            if (!user) {
                return message.reply(`Please provide a valid user.`)
            }
                await client.db.get(`${message.guild.id}_owner`).then(async (data) => {

                    if (user) {
                        const userId = user.id;
                        if (!userId == data.ExtraOwner) {
                            let emb1 = new EmbedBuilder()
                            .setColor(config.Danger)
                            .setDescription(`<:crosszz:1124281794670362644> | <@${user.id}> is not a Extra Owner`)
                            message.reply({ embeds: [emb1] })
                        } else {
                            await client.db.pull(`${message.guild.id}_owner.ExtraOwner`, userId);
                            let emb2 = new EmbedBuilder()
                            .setColor(config.Success)
                            .setDescription(`<:tick:1114819476689539114> | Successfully removed <@${user.id}> from Extra Owner`)
                            message.reply({ embeds: [emb2] })
                        }
                    }
                })
            
        } else if (args[0] === 'show') {
                
            let data = await client.db.get(`${message.guild.id}_owner`)

            const users = data.ExtraOwner;
            const mentions = []

            users.forEach((userId, index) => {
                const formattedIndex = (index + 1).toString().padStart(2, '0'); 
                mentions.push(`\`${formattedIndex}\` | <@${userId}> (${userId})`);
            });

            if (users == 0) {
                return message.reply(`There are no Extra Owner.`)
            }

            let embed = new EmbedBuilder()
            .setColor(config.Success)
            .setTitle(`Extra Owner: ${users.length}`)
            .setDescription(mentions.join('\n'))
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
            .setTimestamp()

            message.channel.send({embeds: [embed]})
        }    
    }
}