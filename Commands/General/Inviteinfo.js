const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'inviteinfo',
    aliases: ['fetchserver', 'fetchinvite'],
    description: 'Show information about an invite',
    category: 'Utility',
    usage: 'invite <invitecode>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        try {

        if(!args[0]) {
            return message.reply('Please provide a invite link')
        }

        const invite = await client.fetchInvite(args[0]);

        if (invite.guild.iconURL({ dynamic: true })) {
            icon = `[Click Here](${invite.guild.iconURL({ dynamic: true })})`
        } else {
            "No Icon"
        }

        if (invite.guild.bannerURL({ dynamic: true, size: 4096 })) {
            banner = `[Click Here](${invite.guild.bannerURL({ dynamic: true, size: 4096 })})`
        } else {
            banner = "No Banner"
        }

        if (invite.guild.splash){
            sp = `[Click Here](https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.webp)`
        } else {
            sp = `No splash`
        }


        let ic = invite.guild.iconURL({ dynamic: true }) || null
        let ba = invite.guild.bannerURL({ dynamic: true, size: 4096 }) || null
        let description = invite.guild.description || "No Description"
        let va = invite.guild.vanityURLCode || "No vanity URL"
        let online = invite.guild.members?.cache.filter(member => member.presence?.status === 'online').size;
        let dnd  = invite.guild.members?.cache.filter(member => member.presence?.status === 'dnd').size;
        let ldle = invite.guild.members?.cache.filter(member => member.presence?.status === 'idle').size;

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setTitle(`Invite Information For ${invite.guild.name}`)
        .setThumbnail(ic)
        .setImage(ba)
        .setDescription(`**Invite Code:** ${invite.code}
**Server Name:** ${invite.guild.name}
**Server ID:** ${invite.guild.id}
**Description:** ${description}
**Icon:** ${icon}
**Banner:** ${banner}
**Vanity URL:** ${va}
**Splash:** ${sp}
**Verification Level:** ${invite.guild.verificationLevel}
**Member Count:** ${invite.memberCount}
**Online Member Count:** ${online + dnd + ldle}
**Boost Count:** ${invite.guild.premiumSubscriptionCount}

**__Server Features__**
${invite.guild.features.map(i => `<:tick:1114819476689539114> ` + i[0] + i.slice(1).toLowerCase().replace(/_/g, " ")).join("\n")}`)

        

        message.reply({ embeds: [embed]})
        } catch (e) {
            message.reply(`Please Provide A Vaild Url.`)
        }
    }
}