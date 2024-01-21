const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const config = require('../../config.json')
const db = require('../../Schema/Prefix.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'To get information about all commands.',
    category: 'Utility',
    usage: 'help',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

      let px;
      const data = await db.findOne({ Guild: message.guild.id });
      if (!data || !data.Prefix) {
        px = config.PREFIX;
      } else {
        px = data.Prefix;
      } 

      if (!args[0]) {
          
          const embed = new EmbedBuilder()
          .setColor(config.Success)
          .setAuthor({ name: `${client.user.username} HelpDesk`, iconURL: client.user.displayAvatarURL()})
          .setDescription(`\`${px}help [command/category]\` - View specific command/category.
Click on the dropdown for more information.
\`\`\`ml
[] - Required Argument | () - Optional Argument\`\`\``)

          .addFields([
            {
            name: "Categories:", 
            value: `> <:stolen_emoji:1114819606184472576> [**Giveaways**](${config.websiteURL})\n> <:stolen_emoji:1114819731468324894> [**Security**](${config.websiteURL})`,
            inline: true
            },
            {
          name: "** **", 
          value: `> <:stolen_emoji:1114819731468324894> [**Utility**](${config.websiteURL})\n> <:stolen_emoji:1114819827811491851> [**Moderation**](${config.websiteURL})`,
          inline: true
            }])

          .addFields([{name:"<:Links:1115536454056153128> Links:", value:`> **[Purchase Premium](${config.websiteURL}) | [Support Server](${config.supportURL}) | [Invite Me](${config.inviteURL}) | [Website](${config.websiteURL})**\n> **[Documentation](${config.websiteURL}) | [Privacy Policy](${config.websiteURL}) | [Vote Me](${config.websiteURL})**`}])

        
        
          let embed1 = new EmbedBuilder()
          .setColor(config.Success)
          .setAuthor({ name: `Giveaways`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
          .setThumbnail('https://cdn.discordapp.com/emojis/1108738071349956638.png')
          .setDescription(`\`gdelete\` - Deletes a giveaway.
\`gend\` - Ends a giveaway.
\`greroll\` - Rerolls a giveaway.
\`gstart\` - Start a giveaway.
\`glist\` - Show the list of all running giveaways.`)
          .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})




          let embed2 = new EmbedBuilder()
          .setColor(config.Success)
          .setAuthor({ name: `Moderation`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
          .setThumbnail('https://cdn.discordapp.com/emojis/1108729507113873478.png')
          .setDescription(`\`ban\` - Bans a User from server.
\`hide\` - Hides a channel.
\`kick\` - Kicks a User from server.
\`lock\` - Locks a perticular channel.
\`nickname\` To change someone's nickname.
\`nuke\` - Nuke a channel.
\`prefix\` - Set the prefix for the bot.
\`purge\` - Clears number of messages in perticular channel.
\`roleicon\` - Edits the role icon to provided icon.
\`steal\` - Steal emojis and stickers to the server.
\`timeout\` - Mutes a user.
\`unban\` - Unban a user.
\`unhide\` - unhide a channel.
\`unlock\` - unlock a channel.
\`unmute\`- unmute a user.`)
          .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})






          let embed3 = new EmbedBuilder()
          .setColor(config.Success)
          .setAuthor({ name: `Security`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
          .setThumbnail('https://cdn.discordapp.com/emojis/1107189242196656168.png')
          .setDescription(`\`antinuke\` - Enable/Disable Anti Nuke.
\`settings\` - Show the setting of antinuke.
\`whitelist\` - Whitelist A User.
\`extraowner\` - add some extra owners.`)
          .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})





          let embed4 = new EmbedBuilder()
          .setColor(config.Success)
          .setAuthor({ name: `Utility`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
          .setThumbnail('https://cdn.discordapp.com/emojis/1108738129143275673.png')
          .setDescription(`\`about\` - Get information about the bot.
\`afk\` - Set your afk status
\`avatar\` - Shows the avatar of the user.
\`banner\` - Shows the banner of the user and server.
\`help\` - To get information about all commands.
\`server icon\` - Shows the icon of the server.
\`server banner\` - Shows the banner of the server.
\`invite\` - Get the invite link for the bot.
\`inviteinfo\` - Show information about an invite
\`membercount\` - Shows the membercount of the server.
\`ping\` - Shows bot ping.
\`roleinfo\` - Shows you all information about a role.
\`serverinfo\` - Shows you all information about the server.
\`userinfo\` - Shows you all information about the user.`)
          .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})





          const embed5 = new EmbedBuilder()
          .setColor(config.Success)
          .setAuthor({ name: `${client.user.username} HelpDesk`, iconURL: client.user.displayAvatarURL()})
          .setDescription(`\`${px}help [command/category]\` - View specific command/category.
Click on the dropdown for more information.
\`\`\`ml
[] - Required Argument | () - Optional Argument\`\`\``)

          .addFields([{name: "Giveaways", value: `\`gdelete\`, \`gend\`, \`greroll\`, \`gstart\`, \`glist\``}])

          .addFields([{name: "Moderation", value: `\`ban\`, \`hide\`, \`kick\`, \`lock\`, \`nickname\`, \`nuke\`, \`prefix\`, \`purge\`, \`roleicon\`, \`steal\`, \`timeout\`, \`unban\`, \`unhide\`, \`unlock\`, \`unmute\`.`}])

          .addFields([{name: "Security", value: `\`antinuke\`, \`setting\`, \`whitelist\`, \`extraowner\``}])

          .addFields([{name: "Utility", value: `\`about\`, \`afk\`, \`avatar\`, \`banner\`, \`help\`, \`about\`, \`server icon\`, \`server banner\`, \`invite\`, \`inviteinfo\`, \`membercount\`, \`ping\`, \`roleinfo\`, \`serverinfo\`, \`userinfo\`.`}])


          const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("help-cmd")
            .setPlaceholder("Choose a Category")
            .addOptions([
              {
                label: 'Giveaways',
                emoji: '<:stolen_emoji:1114819606184472576>',
                value: `giveaways`,
              },
              {
                label: 'Moderation',
                emoji: '<:stolen_emoji:1114819827811491851>',
                value: `moderation`,
              },
              {
                label: 'Security',
                emoji: '<:stolen_emoji:1114819663998763048>',
                value: `security`,
              },
              {
                label: 'Utility',
                emoji: '<:stolen_emoji:1114819731468324894>',
                value: `utility`,
              }
            ])
          )

          const but1 = new ButtonBuilder().setCustomId("button1").setEmoji('<:home:1115897647165886554>').setLabel('Home').setStyle(ButtonStyle.Secondary).setDisabled(true);
          const but2 = new ButtonBuilder().setCustomId("button2").setEmoji('<:slash:1115896092433850398>').setLabel('Commands List').setStyle(ButtonStyle.Secondary);
          const but3 = new ButtonBuilder().setCustomId("button3").setEmoji('<:list:1115322512423780372>').setLabel('Buttons Menu').setStyle(ButtonStyle.Secondary);

          const but4 = new ButtonBuilder().setCustomId("button1").setEmoji('<:home:1115897647165886554>').setLabel('Home').setStyle(ButtonStyle.Secondary);
          const but5 = new ButtonBuilder().setCustomId("button2").setEmoji('<:slash:1115896092433850398>').setLabel('Commands List').setStyle(ButtonStyle.Secondary).setDisabled(true);
          const but6 = new ButtonBuilder().setCustomId("button3").setEmoji('<:list:1115322512423780372>').setLabel('Buttons Menu').setStyle(ButtonStyle.Secondary);

          const but7 = new ButtonBuilder().setCustomId("button1").setEmoji('<:home:1115897647165886554>').setLabel('Home').setStyle(ButtonStyle.Secondary);
          const but8 = new ButtonBuilder().setCustomId("button2").setEmoji('<:slash:1115896092433850398>').setLabel('Commands List').setStyle(ButtonStyle.Secondary);
          const but9 = new ButtonBuilder().setCustomId("button3").setEmoji('<:list:1115322512423780372>').setLabel('Buttons Menu').setStyle(ButtonStyle.Secondary).setDisabled(true);

          const but10 = new ButtonBuilder().setCustomId("button1").setEmoji('<:home:1115897647165886554>').setLabel('Home').setStyle(ButtonStyle.Secondary);
          const but11 = new ButtonBuilder().setCustomId("button2").setEmoji('<:slash:1115896092433850398>').setLabel('Commands List').setStyle(ButtonStyle.Secondary);
          const but12 = new ButtonBuilder().setCustomId("button3").setEmoji('<:list:1115322512423780372>').setLabel('Buttons Menu').setStyle(ButtonStyle.Secondary);

          const but13 = new ButtonBuilder().setCustomId("button4").setEmoji('<:stolen_emoji:1114819606184472576>').setStyle(ButtonStyle.Secondary);
          const but14 = new ButtonBuilder().setCustomId("button5").setEmoji('<:stolen_emoji:1114819827811491851>').setStyle(ButtonStyle.Secondary);
          const but15 = new ButtonBuilder().setCustomId("button6").setEmoji('<:stolen_emoji:1114819663998763048>').setStyle(ButtonStyle.Secondary);
          const but16 = new ButtonBuilder().setCustomId("button7").setEmoji('<:stolen_emoji:1114819731468324894>').setStyle(ButtonStyle.Secondary);

          const button1 = new ActionRowBuilder().addComponents(but1, but2, but3);
          const button2 = new ActionRowBuilder().addComponents(but4, but5, but6);
          const button3 = new ActionRowBuilder().addComponents(but7, but8, but9);
          const button4 = new ActionRowBuilder().addComponents(but10, but11, but12);
          const button5 = new ActionRowBuilder().addComponents(but13, but14, but15, but16);

          const Message = await message.reply({ embeds: [embed], components: [button1, row], fetchReplay: true })

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
            if(cld.customId === "button1"){
              cld.update({ embeds: [embed], components: [button1, row]})
            }
            if(cld.customId === "button2"){
              cld.update({ embeds: [embed5], components: [button2]})
            }
            if(cld.customId === "button3"){
              cld.update({ embeds: [embed], components: [button3, button5]})
            }


            if(cld.customId === "button4"){
              cld.update({ embeds: [embed1], components: [button3, button5]})
            }
            if(cld.customId === "button5"){
              cld.update({ embeds: [embed2], components: [button3, button5]})
            }
            if(cld.customId === "button6"){
              cld.update({ embeds: [embed3], components: [button3, button5]})
            }
            if(cld.customId === "button7"){
              cld.update({ embeds: [embed4], components: [button3, button5]})
            }


            let value = cld.values ? cld.values[0] : null;

            if(value === "giveaways"){
              cld.update({ embeds: [embed1], components: [button4, row]})
            }
            if(value === "moderation"){
              cld.update({ embeds: [embed2], components: [button4, row]})
            }
            if(value === "security"){
              cld.update({ embeds: [embed3], components: [button4, row]})
            }
            if(value === "utility"){
              cld.update({ embeds: [embed4], components: [button4, row]})
            }
          })

        } else {

          const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(
            (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
            );

            if (!command) {
              let embed6 = new EmbedBuilder()
              .setColor(config.Success)
              .setDescription(`Invalid Command! Use \`${px}help\` For All Of My Commands.`)
              return message.reply({ embeds: [embed6]})
            }

            let embed7 = new EmbedBuilder()
            .setColor(config.Success)
            .setAuthor({ name: `${command.category ? `${command.category}` : "NaN"}`, iconURL: client.user.displayAvatarURL()})
            .setDescription(`> ${command.description ? `${command.description}` : "NaN"}`)

            .addFields([
              {name: "Aliases", value: `\`${command.aliases
                ? `${px}${command.aliases.join(`, ${px}`)}`
                : "No aliases for this command."}\``}])

            .addFields([
              {name: "Usage", value: `\`${command.usage 
                ? `${command.usage}` 
                : "No Usage for this command."}\``}])

                return message.reply({embeds: [embed7]})
              }
         }
    }