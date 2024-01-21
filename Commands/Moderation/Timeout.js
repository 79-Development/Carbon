const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'timeout',
    aliases: ['mute'],
    description: 'Mutes a User',
    category: 'Moderation',
    usage: 'timeout <user> <time>',
    cooldown: 3,
    userPermissions: ['ModerateMembers'],
    botPermissions: ['ModerateMembers'],
    run: async (client, message, args) => {

        let user;
        if (message.mentions.members.first()) {
            user = message.mentions.members.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]);
        }

        if (!args[0]) {
            return message.reply('Please provide a user to timeout!')
        }

        if (!user) {
            return message.reply(`That user isn't in this guild!`)
        }

        if (user.id === message.guild.ownerId) {
            return message.reply(`You can't timeout the server owner!`)
        }

        if (user.id === message.author.id) {
            return message.reply(`You can't timeout yourself!`)
        }

        if (user.id === client.user.id) {
            return message.reply(`You can't timeout me!`)
        }

        if (message.member.roles.highest.position <= message.guild.members.cache.get(client.user.id).roles.highest.position) {
            return message.reply(`You need to be higher than me in the role hierarchy to timeout this user!`)
        }

        if (message.member.roles.highest.position < user.roles.highest.position) {
            return message.reply(`You can't timeout a user with same or higher roles as you!`)
        }

        let muteTime = 60;
        let maxMuteTime = 2332800000;
        let timeArg = args[1];
        if (!timeArg) timeArg = "600";
        else if (timeArg.includes("s")) timeArg = timeArg.replace("s", "");
        else if (timeArg.includes("m")) timeArg = timeArg.replace("m", "") * 60;
        else if (timeArg.includes("h")) timeArg = timeArg.replace("h", "") * 60 * 60;
        else if (timeArg.includes("d")) timeArg = timeArg.replace("d", "") * 60 * 60 * 24;
        muteTime = timeArg * 1000;

        if (isNaN(muteTime) || 0 > muteTime)
            return message.reply({ content: "Please provide a valid time." });

        muteTime = muteTime;
        if (muteTime > maxMuteTime) {
            muteTime = maxMuteTime;
            displayMuteTime = maxMuteTime;
        }

        let reason = args.slice(2).join(" ") || "No Reason Provided";

        if (user.communicationDisabledUntil)
            return message.reply({
                content: "That user is already timed out!",
            });

            await user.timeout(muteTime, reason).catch((_) => { });

            let embed = new EmbedBuilder()
            .setColor(config.Success)
            .setDescription(`Successfully timed out ${user}`)

            message.reply({ embeds: [embed] });
    }
}