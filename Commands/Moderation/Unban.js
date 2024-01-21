const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'unban',
    aliases: [''],
    description: 'UnBan A User',
    category: 'Moderation',
    usage: 'ban <user> [reason]',
    cooldown: 3,
    userPermissions: ['ManageGuild'],
    botPermissions: ['ManageGuild'],
    run: async (client, message, args) => {

        if (!args[0]) {
            return message.reply(`Please provide a user to unban!`)
        }

        let user = await client.users.fetch(args[0].replace(/[\\<>@#&!]/g, ""))

        if (!user) {
            return message.reply(`Please provide a valid user to unban!`)
        }

        const reason = args.slice(1).join(" ") || "No reason provided";
        const bans = await message.guild.bans.fetch();

        if (!bans.has(user.id)) {
            return message.reply(`That user isn't banned!`)
        }

        await message.guild.members.unban(user.id, reason).catch((_) => { });

        let embed = new EmbedBuilder()
        .setColor(config.Success)
        .setDescription(`**${user.username}** has been unbanned!`)

        message.reply({ embeds: [embed] })
    }
}