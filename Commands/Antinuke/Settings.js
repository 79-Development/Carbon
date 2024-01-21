const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'settings',
    aliases: ['config', 'setting'],
    description: '',
    usage: '',
    cooldown: 3,
    userPermissions: ['Administrator'],
    botPermissions: ['Administrator'],
    run: async (client, message, args) => {

        const antinuke = await client.db.get(`${message.guild.id}_antinuke`);

        let avatar = message.author.displayAvatarURL({ dynamic: true }) || client.user.displayAvatar()

            if (!antinuke) {
                return message.reply(`Anti-Nuke is not enabled.`)
            } else {

                if (await client.db.get(`${message.guild.id}_antiChannel`) === true) {
                    antichannel = `<:On:1131591983803142264>`
                } else {
                    antichannel = `<:OFF:1131591852026499202>`
                }

                if (await client.db.get(`${message.guild.id}_antiRole`) === true) {
                    antirole = `<:On:1131591983803142264>`
                } else {
                    antirole = `<:OFF:1131591852026499202>`
                }

                if (await client.db.get(`${message.guild.id}_antiGuild`) === true) {
                    antiguild = `<:On:1131591983803142264>`
                } else {
                    antiguild = `<:OFF:1131591852026499202>`
                }

                if (await client.db.get(`${message.guild.id}_antiBot`) === true) {
                    antibot = `<:On:1131591983803142264>`
                } else {
                    antibot = `<:OFF:1131591852026499202>`
                }

                if (await client.db.get(`${message.guild.id}_antiBan`) === true) {
                    antiban = `<:On:1131591983803142264>`
                } else {
                    antiban = `<:OFF:1131591852026499202>`
                }

                if (await client.db.get(`${message.guild.id}_antiKick`) === true) {
                    antikick = `<:On:1131591983803142264>`
                } else {
                    antikick = `<:OFF:1131591852026499202>`
                }

                if (await client.db.get(`${message.guild.id}_antiWebhook`) === true) {
                    antiwebhook = `<:On:1131591983803142264>`
                } else {
                    antiwebhook = `<:OFF:1131591852026499202>`
                }
                
                let chan = await client.db.get(`${message.guild.id}_logschannel`)
                let channel = chan.channel[0]

                let whitelist = await client.db.get(`${message.guild.id}_wl`)
				let wlist = whitelist.whitelisted.length || '0'
                let owner = await client.db.get(`${message.guild.id}_owner`)
				let ownerlist = owner.ExtraOwner.length || '0'

                const embed = new EmbedBuilder()
                .setColor(config.Success)
                .setAuthor({ name: message.author.tag, iconURL: avatar})
                .setDescription(`**Features:**
**Anti Channel** ${antichannel}
**Anti Role** ${antirole}
**Anti Guild** ${antiguild}
**Anti Bot add** ${antibot}
**Anti Ban** ${antiban}
**Anti Kick** ${antikick}
**Anti Webhook** ${antiwebhook}

**Log Channel:** <#${channel}>
**Extra Owners:** ${ownerlist}
**Whitelisted Users:** ${wlist}`)

                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                .setTimestamp()

                message.channel.send({embeds: [embed]})       
        }
    }
}