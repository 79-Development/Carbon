const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const db = require('../../Schema/Prefix.js');

module.exports = {
    name: 'autorole',
    aliases: [''],
    description: '',
    usage: '',
    category: 'Moderation',
    cooldown: 3,
    userPermissions: ['ManageRoles'],
    botPermissions: ['ManageRoles'],
    run: async (client, message, args) => {
        let rl1 = await client.db.get(`${message.guild.id}_humans`)
        if (rl1 === null) {
            await client.db.set(`${message.guild.id}_humans`, { id: [] })
        }

        let rl2 = await client.db.get(`${message.guild.id}_bots`)
        if (rl2 === null) {
            await client.db.set(`${message.guild.id}_bots`, { id: [] })
        }

        const data = await db.findOne({ Guild: message.guildId });
        let px;
        if (!data || !data.Prefix) {
            px = config.PREFIX;
        } else {
            px = data.Prefix;
        } 

        if (!args[0]) {
            let embed = new EmbedBuilder()
            .setColor(config.EmbedColor)
            .setAuthor({ name: `Autorole Commands`, iconURL: client.user.displayAvatarURL()})
            .setDescription(`\`${px}autorole humans \`\nSetup autoroles for human users.\n
\`${px}autorole bots \`\nSetup autoroles for bots.\n
\`${px}autorole reset \`\nClears autorole config for the server.\n
\`${px}autorole config \`\nGet autorole config for the server.\n`)

            message.reply({ embeds: [embed] })
        }

        let role = message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[2]) ||
        message.guild.roles.cache.find((r) => r.name.toLowerCase() ==
        args.slice(0).join(" ").toLowerCase()
        );

        if (args[0].toLowerCase() === 'humans') {
            if (!args[1]) {
                let embed = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setAuthor({ name: `Autorole Commands`, iconURL: client.user.displayAvatarURL()})
                .setDescription(`\`${px}autorole humans add <role>\`\nAdd role to list of autoroles for human users.\n
\`${px}autorole humans remove <role>\`\n Remove a role from autoroles for human users.`)

                message.reply({ embeds: [embed] })
            }

            if (args[1].toLowerCase() === 'add') {
                if (!role) {
                    return message.reply({ content: `Please provide a valid role.` })
                }

                if (message.guild.members.cache.get(client.user.id).roles.highest.position < role.position) {
                    return message.reply(`I can't add role to user because my role is lower then **${role.name}** role.`)
                }

                if (role.permissions.has('Administrator')) {
                    return message.reply(`You can't use roles with administrator in autoroles.`)
                }

                await client.db.get(`${message.guild.id}_humans`).then(async (data) => {

                    if (data.id.length === 3) {
                        return message.reply(`This server has reached the maximum number of autoroles limit.`)
                    }

                    if (role.id == data.id) {
                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:zzcross64:1141003742439804978> | <@&${role.id}> is already in human autoroles.`)
    
                        message.reply({ embeds: [embed] })

                    } else {
                        await client.db.push(`${message.guild.id}_humans.id`, role.id);

                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:codez_tick:1141002345250033755> | <@&${role.id}> has been added to human autoroles.`)
    
                        message.reply({ embeds: [embed] })
                    }
                })
            } else if (args[1].toLowerCase() === 'remove') {
                if (!role) {
                    return message.reply({ content: `Please provide a valid role.` })
                }

                await client.db.get(`${message.guild.id}_humans`).then(async (data) => {

                    if (!role.id == data.id) {
                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:zzcross64:1141003742439804978> | <@&${role.id}> is not in human autoroles.`)
    
                        message.reply({ embeds: [embed] })
                    } else {
                        await client.db.pull(`${message.guild.id}_humans.id`, role.id);

                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:codez_tick:1141002345250033755> | <@&${role.id}> has been removed to human autoroles.`)
    
                        message.reply({ embeds: [embed] })
                    }
                })
            }
        } else if (args[0].toLowerCase() === 'bots') {

            if (!args[1]) {
                let embed = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setAuthor({ name: `Autorole Commands`, iconURL: client.user.displayAvatarURL()})
                .setDescription(`\`${px}autorole bots add <role>\`\nAdd role to list of autoroles for bot users.\n
\`${px}autorole bots remove <role>\`\n Remove a role from autoroles for bot users.\n`)

                message.reply({ embeds: [embed] })
            }

            if (args[1].toLowerCase() === 'add') {
                if (role.permissions.has('Administrator')) {
                    return message.reply(`You can't use roles with administrator in autoroles.`)
                }

                if (message.guild.members.cache.get(client.user.id).roles.highest.position < role.position) {
                    return message.reply(`I can't add role to user because my role is lower then **${role.name}** role.`)
                }

                if (!role) {
                    return message.reply({ content: `Please provide a valid role.` })
                }
    
                await client.db.get(`${message.guild.id}_bots`).then(async (data) => {

                    if (data.id.length === 2) {
                        return message.reply(`This server has reached the maximum number of autoroles limit.`)
                    }

                    if (role.id == data.id) {
                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:zzcross64:1141003742439804978> | <@&${role.id}> is already in bot autoroles.`)
    
                        message.reply({ embeds: [embed] })

                    } else {
                        await client.db.push(`${message.guild.id}_bots.id`, role.id);

                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:codez_tick:1141002345250033755> | <@&${role.id}> has been added to bot autoroles.`)
    
                        message.reply({ embeds: [embed] })
                    }
                })
            } else if (args[1].toLowerCase() === 'remove') {
                if (!role) {
                    return message.reply({ content: `Please provide a valid role.` })
                }
    
                await client.db.get(`${message.guild.id}_bots`).then(async (data) => {

                    if (!role.id == data.id) {
                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:zzcross64:1141003742439804978> | <@&${role.id}> is not in bot autoroles.`)
    
                        message.reply({ embeds: [embed] })
                    } else {
                        await client.db.pull(`${message.guild.id}_bots.id`, role.id);

                        let embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setDescription(`<:codez_tick:1141002345250033755> | <@&${role.id}> has been removed to bot autoroles.`)
    
                        message.reply({ embeds: [embed] })
                    }
                })
            }
        } else if (args[0].toLowerCase() === 'reset') {
            if (!args[1]) {
                let embed = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setAuthor({ name: `Autorole Commands`, iconURL: client.user.displayAvatarURL()})
                .setDescription(`\`${px}autorole reset humans\`\nClears autorole config for the server.\n
\`${px}autorole reset bots\`\nClears autorole config for the server.\n
\`${px}autorole reset all\`\nClears autorole config for the server.\n`)

                message.reply({ embeds: [embed] })
            }

            if (args[1].toLowerCase() === 'humans') {

                if (client.db.get(`${message.guild.id}_humans`, { id: [] })) {
                    return message.reply(` This server don't have any human autoroles setupped.`)
                }

                await client.db.set(`${message.guild.id}_humans`, { id: [] })

                let embed = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setDescription(`<:codez_tick:1141002345250033755> | Successfully cleared all human autoroles for this server.`)

                message.reply({ embeds: [embed] })
            } else if (args[1].toLowerCase() === 'bots') {
                if (client.db.get(`${message.guild.id}_bots`, { id: [] })) {
                    return message.reply(` This server don't have any bot autoroles setupped.`)
                }

                await client.db.set(`${message.guild.id}_bots`, { id: [] })

                let embed = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setDescription(`<:codez_tick:1141002345250033755> | Successfully cleared all bot autoroles for this server.`)

                message.reply({ embeds: [embed] })
            } else if (args[1].toLowerCase() === 'all') {

                await client.db.set(`${message.guild.id}_humans`, { id: [] })
                await client.db.set(`${message.guild.id}_bots`, { id: [] })

                let embed = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setDescription(`<:codez_tick:1141002345250033755> | Successfully cleared all autoroles for this server.`)

                message.reply({ embeds: [embed] })
            }
        } else if (args[0].toLowerCase() === 'config') {
            let roleid1 = await client.db.get(`${message.guild.id}_humans`)
            let roleid2 = await client.db.get(`${message.guild.id}_bots`)

            const id1 = roleid1.id
            const id2 = roleid2.id
            const role1 = [];
            const role2 = [];

            id1.forEach((role) => {
                role1.push(`<@&${role}>`);
            });

            id2.forEach((role) => {
                role2.push(`<@&${role}>`);
            });

            let embed = new EmbedBuilder()
            .setColor(config.EmbedColor)
            .setAuthor({ name: `${message.guild.name} Autorole Settings`, iconURL: message.guild.iconURL({ dynamic: true })})

            .addFields([
                { 
                    name: "Humans",
                    value: `${role1.join('\n') || 'Not Set'}`
                }
            ])
            .addFields([
                { 
                    name: "Bots",
                    value: `${role2.join('\n') || 'Not Set'}`
                }
            ])

            message.reply({ embeds: [embed] })
        }
    }
}