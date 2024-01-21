const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'serverinfo',
    aliases: ['si'],
    description: 'Shows you all information about the server.',
    category: 'Utility',
    usage: 'serverinfo',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        let description = message.guild.description || "No Description"
        let icon = message.guild.iconURL({ dynamic: true }) || null
 
        if (message.guild.afkChannel) {
            afkchannel = `<#!${message.guild.afkChannel.id}>`
        } else {
            afkchannel = `None`
        }

        await message.guild.members.fetch()

        let boosters;
        if (message.guild.members.cache.filter((m) => m.premiumSince).size > 7) boosters = message.guild.members.cache.filter((m) => m.premiumSince != null).map((m) => `<@!${m.user.id}>`).slice(0, 7).join(", ") + ` **and ${message.guild.members.cache.filter((m) => m.premiumSince).size - 7} more members...**`
        if (message.guild.members.cache.filter((m) => m.premiumSince).size < 7) boosters = message.guild.members.cache.filter((m) => m.premiumSince != null).map((m) => `<@!${m.user.id}>`).slice(0, 7).join(", ")
        
        const verificationLevels = {
            0: "None",
            1: "Low",
            2: "Medium",
            3: "High",
            4: "Very High",
        };
        const verificationLevelsStage = {
            0: "Unrestricted",
            1: "Must Have Verified Email On Account",
            2: "Must Be Registered On Discord For Longer Than 5 Minutes",
            3: "Must Be A Member Of The Guild For Longer Than 10 Minutes",
            4: "Must Have A Verified Phone Number",
        };
        const explicitContentFilter = {
            0: "Off",
            1: "Member With Role",
            2: "All Members",
        };
        const defaultMessageNotifications = {
            0: "All Messages",
            1: "Only @mentions",
        };
        const mfaLevels = {
            0: "No",
            1: "Yes",
        };

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(icon)
        .setAuthor({ name: message.guild.name, iconURL: icon})

        .addFields([{ name: "Server Information", value: `${description}` }])
        .addFields([{ name: "ID", value: `${message.guild.id}` }])
        .addFields([{ name: "Created At", value: `<t:${Math.floor(message.guild.createdTimestamp / 1000)}:f> | <t:${Math.floor(message.guild.createdTimestamp / 1000)}:R>` }])
        .addFields([{ name: "Owner", value: `<@!${message.guild.ownerId}>` }])

        .setTimestamp()


        let embed1 = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(message.guild.iconURL({ dynamic: true}))
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})

        .addFields([{ name: "Members", value: `Total Members: ${message.guild.memberCount}
Humans: ${message.guild.members.cache.filter(member => !member.user.bot).size}
Bots: ${message.guild.members.cache.filter(member => member.user.bot).size}` }])


        let embed2 = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(message.guild.iconURL({ dynamic: true}))
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})

        .addFields([{ name: "Text Channels", value: `Total Channels: ${message.guild.channels.cache.size}
Text Channels: ${message.guild.channels.cache.filter( (c) => c.type === 0 ).size}
Voice Channels: ${message.guild.channels.cache.filter( (c) => c.type === 2 ).size}
Categories: ${message.guild.channels.cache.filter( (c) => c.type === 4 ).size}` }])

        .addFields([{ name: "AFK Channel", value: afkchannel }])

        .addFields([{ name: "Hidden Channels", value: `Total Channels: ${message.guild.channels.cache.filter( (c) => !c .permissionsFor(message.guild.id).has("ViewChannel")).size}
Text Channels: ${message.guild.channels.cache.filter( (c) => c.type === 0 && !c .permissionsFor(message.guild.id).has("ViewChannel") ).size}
Voice Channels: ${message.guild.channels.cache.filter( (c) => c.type === 2 && !c .permissionsFor(message.guild.id) .has("ViewChannel") ).size}
Categories: ${message.guild.channels.cache.filter( (c) => c.type === 4 && !c .permissionsFor(message.guild.id) .has("ViewChannel") ).size}` }])

        .setTimestamp()


        let embed3 = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(message.guild.iconURL({ dynamic: true}))
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})

        .addFields([{ name: "Boosts", value: `${message.guild.premiumSubscriptionCount + " Boosts"}` }])
        .addFields([{ name: "Level", value: `Level ${message.guild.premiumTier}` }])
        .addFields([{ name: "Boosters", value: `${boosters}` }])
        .addFields([{ name: "Latest Boosters", value: `${message.guild.members.cache.filter((m) => m.premiumSince != null).sort((a, b) => b.premiumSinceTimestamp - a.premiumSinceTimestamp).map((m) => `<@!${m.user.id}>`).slice(0, 5).join(", ") || "None"}` }])

        .setTimestamp()


        let embed4 = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(message.guild.iconURL({ dynamic: true}))
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})

        .setDescription(`**Server Information**\n${description}
**ID**\n${message.guild.id}
**Created At**\n<t:${Math.floor(message.guild.createdTimestamp / 1000)}:f> | <t:${Math.floor(message.guild.createdTimestamp / 1000)}:R>
**Owner**\n<@!${message.guild.ownerId}>\n
**Features**\n${message.guild.features.map(i => `<:stolen_emoji:1114819476689539114> ` + i[0] + i.slice(1).toLowerCase().replace(/_/g, " ")).join("\n")}`)

        .setTimestamp()

        let embed5 = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(message.guild.iconURL({ dynamic: true}))
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})

        .addFields([{ name: `Verifaction Level: ${verificationLevels[message.guild.verificationLevel] || "None"}`, value: `${verificationLevelsStage[message.guild.verificationLevel] || "None"}` }])
        .addFields([{ name: "Explicit Content Filter", value: `${explicitContentFilter[message.guild.explicitContentFilter] || "None"}` }])
        .addFields([{ name: "Default Notifications", value: `${defaultMessageNotifications[message.guild.defaultMessageNotifications] || "None"}` }])
        .addFields([{ name: "Moderators Require 2FA?", value: `${mfaLevels[message.guild.mfaLevel] || "No"}` }])

        .setTimestamp()


        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("help-cmd")
			.setPlaceholder("Server Info Panel")
			.addOptions([
                {
                    label: 'Members',
                    emoji: '<:icons_people:1117827191254827018>',
					value: `members`,
				},
				{
					label: 'Channels',
                    emoji: '<:icons_channel:1117827387799904266>',
					value: `channels`,
				},
				{
					label: 'Boosts',
                    emoji: '<:icons_colorboostnitro:1117827903263080463>',
					value: `boosts`,
				},
				{
					label: 'Features',
                    emoji: '<:icons_star:1117828033366196244>',
					value: `features`,
				},
				{
					label: 'Moderation',
                    emoji: '<:stolen_emoji:1114819663998763048>',
					value: `moderation`,
				}
			])
		)

        const Message = await message.channel.send({ embeds: [embed], components: [row]})

        const collector = Message.createMessageComponentCollector({
            filter: (b) => {
                if(b.user.id === message.author.id) return true;
                 else {
               b.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`}); return false;
                     };
                },
                time : 300000,
                idle: 300000/2
              });


              collector.on("collect", async (cld) => {
                let value = cld.values ? cld.values[0] : null;

                if(value === "members"){
                  cld.update({ embeds: [embed1], components: [row]})
                }
                if(value === "channels"){
                    cld.update({ embeds: [embed2], components: [row]})
                }
                if(value === "boosts"){
                    cld.update({ embeds: [embed3], components: [row]})
                }
                if(value === "features"){
                    cld.update({ embeds: [embed4], components: [row]})
                }
                if(value === "moderation"){
                    cld.update({ embeds: [embed5], components: [row]})
                }
            }) 
        }
    }