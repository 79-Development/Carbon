const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'whitelist',
    aliases: ['wl'],
    description: 'Whitelist A User.',
    category: 'AntiNuke',
    usage: 'whitelist <add/remove/show>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        const owners = await client.db.get(`${message.guild.id}_owner.ExtraOwner`)  || []

        if (!owners.includes(message.author.id) && message.author.id !== message.guild.ownerId) {
            return message.reply({ content: `Only the extra owner can use this command.` })
        }

        if (!args[0]) {
            return message.reply(`Please provide a valid action. (add, remove, show)`)
        }

        let abc = await client.db.get(`${message.guild.id}_wl`)

        if (abc === null) {
            await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] })
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

            const antinuke = await client.db.get(`${message.guild.id}_antinuke`);

            if (!antinuke) {
                return message.reply(`Anti-Nuke is not enabled.`)
            } else {
                await client.db.get(`${message.guild.id}_wl`).then(async (data) => {

                    if (data.whitelisted.length == 10) {
                        return message.reply(`You have reached the Whitelist limit.`)
                    }

                    if (user) {
                        const userId = user.id;
                        if (userId == data.whitelisted) {
                            let emb1 = new EmbedBuilder()
                            .setColor(config.Danger)
                            .setDescription(`<:crosszz:1124281794670362644> | <@${user.id}> is already a whitelisted user.`)
                            message.reply({ embeds: [emb1] })
                        } else {
                            await client.db.push(`${message.guild.id}_wl.whitelisted`, userId);
                            let emb2 = new EmbedBuilder()
                            .setColor(config.Success)
                            .setDescription(`<:tick:1114819476689539114> | Successfully added <@${user.id}> as whitelisted user.`)
                            message.reply({ embeds: [emb2] })
                        }
                    }
                })
            }

        } else if (args[0] === 'remove') {
            if (!user) {
                return message.reply(`Please provide a valid user.`)
            }
            
            const antinuke = await client.db.get(`${message.guild.id}_antinuke`);

            if (!antinuke) {
                return message.reply(`Anti-Nuke is not enabled.`)
            } else {
                await client.db.get(`${message.guild.id}_wl`).then(async (data) => {

                    if (user) {
                        const userId = user.id;
                        if (!userId == data.whitelisted) {
                            let emb1 = new EmbedBuilder()
                            .setColor(config.Danger)
                            .setDescription(`<:crosszz:1124281794670362644> | <@${user.id}> is not a whitelisted member.`)
                            message.reply({ embeds: [emb1] })
                        } else {
                            await client.db.pull(`${message.guild.id}_wl.whitelisted`, userId);
                            let emb2 = new EmbedBuilder()
                            .setColor(config.Success)
                            .setDescription(`<:tick:1114819476689539114> | Successfully removed <@${user.id}> from whitelisted user.`)
                            message.reply({ embeds: [emb2] })
                        }
                    }
                })
            }
        } else if (args[0] === 'show') {
                
            let data = await client.db.get(`${message.guild.id}_wl`)

            const users = data.whitelisted;
            const mentions = []

            users.forEach((userId, index) => {
                const formattedIndex = (index + 1).toString().padStart(2, '0'); 
                mentions.push(`\`${formattedIndex}\` | <@${userId}> (${userId})`);
            });

            if (users == 0) {
                return message.reply(`There are no whitelisted users.`)
            }

            let embed = new EmbedBuilder()
            .setColor(config.Success)
            .setTitle(`Total Whitelist Users: ${users.length}`)
            .setDescription(mentions.join('\n'))
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
            .setTimestamp()

            message.channel.send({embeds: [embed]})
        }          
    }
}