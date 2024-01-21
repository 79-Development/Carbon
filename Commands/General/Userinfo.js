const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'userinfo',
    aliases: ['ui'],
    description: 'Shows you all information about the user.',
    category: 'Utility',
    usage: 'userinfo <user>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => { 
      try {
        let user;
        if (message.mentions.users.first()) {
          user = message.mentions.members.first() || args[0];
        } else if (args[0]) {
          user = await message.guild.members.fetch(args[0], { force: true })
        } else {
          user = message.member;
        }

        const badgeNames = {
          ActiveDeveloper: '<:ActiveDeveloper:1123298875785089154>',
          PremiumEarlySupporter: '<:EarlySupporter:1120633651311415419>',
          VerifiedBot: '<:verified_bot:1123475096997208064>',
          Partner: '<:Partner:1120671777165672498>',
          Hypesquad: '<:HypeSquadEvents:1120677387970019429>',
          CertifiedModerator: '<:staff:1123318975821009017>',
          Staff: '<:Staff:1123319002773602401>',
          VerifiedDeveloper: '<:VerifiedDeveloper:1120671696152707092>',
          BugHunterLevel1: '<:BugHunterLevel1:1120677621588570192>',
          BugHunterLevel2: '<:BugHunterLevel2:1120677514809966602>',
          HypeSquadOnlineHouse1: '<:HypeSquardBrilliance:1120669414933663755>',
          HypeSquadOnlineHouse2: '<:HypeSquardBravery:1120669214513053747>',
          HypeSquadOnlineHouse3: '<:HypeSquardBalance:1120669145013440612>',
        };

        let akaBadge = user.user.discriminator === '0' ? ' <:Originally_known_as:1123298642799898665>' : '';

        let badges = user.user.flags.toArray()
        .map((flag) => badgeNames[flag])
        .filter((name) => name !== 'undefined')
        .join(` `) || '** **';

        var permissions = [];
        if (user.permissions.has("Administrator")) {
          permissions.push("Administrator");
        }

        if (user.permissions.has("KickMembers")) {
          permissions.push("Kick Members");
        }

        if (user.permissions.has("BanMembers")) {
          permissions.push("Ban Members");
        }

        if (user.permissions.has("ManageGuild")) {
          permissions.push("Manage Server");
        }

        if (user.permissions.has("ManageRoles")) {
          permissions.push("Manage Roles");
        }

        if (user.permissions.has("ManageChannels")) {
          permissions.push("Manage Channels");
        }

        if (user.permissions.has("ManageMessages")) {
          permissions.push("Manage Messages");
        }

        if (user.permissions.has("ManageEmojisAndStickers")) {
          permissions.push("Manage Emojis And Stickers");
        }

        if (user.permissions.has("MentionEveryone")) {
          permissions.push("Mention Everyone");
        }

        if (user.permissions.has("ManageNicknames")) {
          permissions.push("Manage Nicknames");
        }

        if (permissions.length == 0) {
          permissions.push("No Key Permissions Found");
        }


        if (user.user.id == message.guild.ownerId) {
          acknowledgements = "Server Owner";
        } else if (user.permissions.has("Administrator")) {
          acknowledgements = "Administrator";
        } else if (user.permissions.has("ManageGuild")) {
          acknowledgements = "Moderator";
        } else {
          acknowledgements = "Member"
        }

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `${user.user.username}'s Information`, iconURL: user.user.displayAvatarURL({ dynamic: true })})

        .addFields([
          { 
            name: "Username", 
            value: user.user.username,
            inline: true 
          },
          { 
            name: "Badges", 
            value: `${badges}${akaBadge}`,
            inline: true
          } 
        ])

        .addFields([{ name: "ID", value: `${user.user.id}` }])

        .addFields([{ name: "Created At", value: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:f> | <t:${Math.floor(user.user.createdTimestamp / 1000)}:R>` }])

        .addFields([
          { 
            name: "Joined At", 
            value: `<t:${Math.floor(user.joinedTimestamp / 1000)}:R>`,
            inline: true 
          },
          { 
            name: "Bot?", 
            value: `${user.user.bot ? "<:tick:1114819476689539114> Yes" : "<:crosszz:1124281794670362644> No"}`,
            inline: true
          } 
        ])


        const embed1 = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `${user.user.username}'s Information`, iconURL: user.displayAvatarURL({ dynamic: true })})

        .addFields([{ name: "Highest Role", value: `${user.roles.highest.id === message.guild.id ? 'None' : user.roles.highest}`}])

        .addFields([{ name: "Role Color", value: `${user.roles.highest.hexColor === message.guild.id ? 'None' : user.roles.highest.hexColor}` }])

        .addFields([
          { 
            name: "Total Roles", 
            value: `${user.roles.cache.size - 1}`,
            inline: true 
          },
          { 
            name: "Boosting Since", 
            value: `${user.premiumSince ? `<t:${Math.floor(user.premiumSinceTimestamp / 1000.0)}:R>` : "None"}`,
            inline: true
          } 
        ])

        .addFields([{ name: "Roles", value: `${user.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id}>`).join(", ") || "No Roles"}` }])

        const embed2 = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `${user.user.username}'s Information`, iconURL: user.displayAvatarURL({ dynamic: true })})

        .addFields([{ name: "Acknowledgements", value: `${acknowledgements ? acknowledgements : "Member"}`}])

        .addFields([{ name: "Voice Channel", value: `${user.voice.channel ? user.voice.channel : "None"}`}])

        .addFields([{ name: "Key Permissions", value: `${permissions.join(', ')}`}])
        
        const row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
          .setCustomId("user-cmd")
          .setPlaceholder("User Info Panel")
          .addOptions([
            {
              label: 'information',
              emoji: '<:star:1117828033366196244>',
              value: `information`,
            },
            {
              label: 'Overview',
              emoji: '<:security:1114819663998763048>',
              value: `overview`,
            },
            {
              label: 'Extra',
              emoji: '<:list:1115322512423780372>',
              value: `extra`,
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
            
            if(value === "information"){
              cld.update({ embeds: [embed], components: [row]})
            }
            if(value === "overview"){
              cld.update({ embeds: [embed1], components: [row]})
            }
            if(value === "extra"){
              cld.update({ embeds: [embed2], components: [row]})
            }
          })
      } catch (e) {
        let user = await client.users.fetch(args[0], { force: true })

        const badgeNames = {
          ActiveDeveloper: '<:ActiveDeveloper:1123298875785089154>',
          PremiumEarlySupporter: '<:EarlySupporter:1120633651311415419>',
          VerifiedBot: '<:verified_bot:1123475096997208064>',
          Partner: '<:Partner:1120671777165672498>',
          Hypesquad: '<:HypeSquadEvents:1120677387970019429>',
          CertifiedModerator: '<:staff:1123318975821009017>',
          Staff: '<:Staff:1123319002773602401>',
          VerifiedDeveloper: '<:VerifiedDeveloper:1120671696152707092>',
          BugHunterLevel1: '<:BugHunterLevel1:1120677621588570192>',
          BugHunterLevel2: '<:BugHunterLevel2:1120677514809966602>',
          HypeSquadOnlineHouse1: '<:HypeSquardBrilliance:1120669414933663755>',
          HypeSquadOnlineHouse2: '<:HypeSquardBravery:1120669214513053747>',
          HypeSquadOnlineHouse3: '<:HypeSquardBalance:1120669145013440612>',
        };

        let akaBadge = user.discriminator === '0' ? ' <:Originally_known_as:1123298642799898665>' : '';
      
        let badges = user.flags.toArray()
        .map((flag) => badgeNames[flag])
        .filter((name) => name !== 'undefined')
        .join(` `) || '** **';

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `${user.username}'s Information`, iconURL: user.displayAvatarURL({ dynamic: true })})
    
        .addFields([
          { 
            name: "Username", 
            value: user.username,
            inline: true 
          },
          { 
            name: "Badges", 
            value: `${badges}${akaBadge}`,
            inline: true
          } 
        ])

        .addFields([{ name: "ID", value: `${user.id}` }])
    
        .addFields([{ name: "Created At", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f> | <t:${Math.floor(user.createdTimestamp / 1000)}:R>` }])
    
        .addFields([
          { 
            name: "Mention", 
            value: `<@!${user.id}>`,
            inline: true 
          },
          { 
            name: "Bot?", 
            value: `${user.bot ? "<:tick:1114819476689539114> Yes" : "<:crosszz:1124281794670362644> No"}`,
            inline: true
          } 
        ])
          .setFooter({ text: `${user.username} is not in this server.` })

          message.reply({ embeds: [embed] })
        }
    }
}