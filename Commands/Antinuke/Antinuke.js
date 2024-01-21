const { EmbedBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder } = require("discord.js");
const config = require('../../config.json')
const db = require('../../Schema/Prefix.js');

module.exports = {
    name: 'antinuke',
    aliases: [''],
    description: 'Enable/Disable Anti Nuke.',
    category: 'AntiNuke',
    usage: 'antinuke <enable/disable>',
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

        const owners = await client.db.get(`${message.guild.id}_owner.ExtraOwner`)  || []
        
        if (!owners.includes(message.author.id) && message.author.id !== message.guild.ownerId) {
            return message.reply({ content: `Only the server owner can use this command.` })
        }
        

        if(!args[0]) {
            message.reply({ content: `Please provide a valid action. (enable, disable)` })
        }

        const antinuke = await client.db.get(`${message.guild.id}_antinuke`);

        if (args[0] === 'enable') {
            if (antinuke === true) {
                return message.reply(`Antinuke is already enabled for this server. To disable it, use \`${px}antinuke disable\`.`)
            }

            let avatar = message.author.displayAvatarURL({ dynamic: true }) || client.user.displayAvatar()

            const embed = new EmbedBuilder()
            .setColor(config.Success)
            .setAuthor({ name: message.author.tag, iconURL: avatar})
            .setDescription(`Proceed with the steps to continue with the setup.`)
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
            .setTimestamp()
            
            const but1 = new ButtonBuilder().setCustomId("button1").setEmoji('<:tick:1114819476689539114>').setLabel('Enable').setStyle(ButtonStyle.Success);
            const but2 = new ButtonBuilder().setCustomId("button2").setEmoji('<:crosszz:1124281794670362644> ').setLabel('Cancel').setStyle(ButtonStyle.Danger);
       
            const button = new ActionRowBuilder().addComponents(but1, but2);
            const Message = await message.channel.send({ embeds: [embed], components: [button]})

            const embed1 = new EmbedBuilder()
            .setColor(config.Success)
            .setAuthor({ name: message.author.tag, iconURL: avatar})
            .setDescription(`Select the options you want to enable.`)
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
            .setTimestamp()

            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("antinuke")
                .setMinValues(1)
                .setMaxValues(7)
                .setPlaceholder("Select a option")
                .addOptions([
                    {
                        label: 'Anti Channel',
                        value: `Anti-Channel`,
                    },
                    {
                        label: 'Anti Role',
                        value: `Anti-Role`,
                    },
                    {
                        label: 'Anti Guild',
                        value: `Anti-Guild`,
                    },
                    {
                        label: 'Anti Bot Add',
                        value: `Anti-Bot-Add`,
                    },
                    {
                        label: 'Anti Ban',
                        value: `Anti-Ban`,
                    },
                    {
                        label: 'Anti Kick',
                        value: `Anti-Kick`,
                    },
                    {
                        label: 'Anti Webhook',
                        value: `Anti-Webhook`,
                    }
                ])
            )

            const collector = Message.createMessageComponentCollector({
                filter: (b) => {
                    if(b.user.id === message.author.id) return true;
                     else {
                   b.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`}); return false;
                         };
                    },
                    time : 600000,
                    idle: 600000/2   
              });


            collector.on("collect", async (cld) => {

                if (cld.customId === "button1") {
                    client.db.set(`${cld.guild.id}_antiBan`, null);
                    client.db.set(`${cld.guild.id}_antiKick`, null);
                    client.db.set(`${cld.guild.id}_antiRole`, null);
                    client.db.set(`${cld.guild.id}_antiChannel`, null);
                    client.db.set(`${cld.guild.id}_antiWebhook`, null);
                    client.db.set(`${cld.guild.id}_antiGuild`, null);
                    client.db.set(`${cld.guild.id}_antiBot`, null);

                    client.db.set(`${cld.guild.id}_logschannel`, { channel: [] })
                    client.db.set(`${cld.guild.id}_wl`, { whitelisted: [] })
                    client.db.set(`${cld.guild.id}_punishment`, `none`);
                    
                    cld.update({ embeds: [embed1], components: [row]})
                }
                if (cld.customId === "button2") {
                    cld.update({ content: `Cancelled the command.`, embeds: [], components: [] })
                }


                if(cld.customId == "antinuke") {
                    const but3 = new ButtonBuilder().setCustomId("button3").setEmoji('<:discotoolsxyzicon4:1128592521589690429>').setLabel('Back').setStyle(ButtonStyle.Danger);
                    const but4 = new ButtonBuilder().setCustomId("button4").setEmoji('<:discotoolsxyzicon3:1128592544310251591>').setLabel('Next').setStyle(ButtonStyle.Success);
                    const button1 = new ActionRowBuilder().addComponents(but3, but4);

                    await cld.values.forEach(async value => {
                        if (value === "Anti-Ban") {
                            await client.db.set(`${message.guild.id}_antiBan`, true);
                        } 
                        if (value === "Anti-Kick") {
                            await client.db.set(`${message.guild.id}_antiKick`, true);
                        } 
                        if (value === "Anti-Role") {
                            await client.db.set(`${message.guild.id}_antiRole`, true);
                        }
                        if (value === "Anti-Channel") {
                            client.db.set(`${message.guild.id}_antiChannel`, true);
                        } 
                        if (value === "Anti-Bot-Add") {
                            client.db.set(`${message.guild.id}_antiBot`, true);
                        } 
                        if (value === "Anti-Webhook") {
                            client.db.set(`${message.guild.id}_antiWebhook`, true);
                        }
                        if (value === "Anti-Guild") {
                            client.db.set(`${message.guild.id}_antiGuild`, true);
                        }
                    })

                    let value = cld.values;

                    let embed2 = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Anti Nuke has been enabled with the following options:\n\n${value.map(i => `<:tick:1114819476689539114>  **• ` + i[0] + i.slice(1).replace(/-/g, " ") + `**`).join("\n")}`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()
                    cld.update({ embeds: [embed2], components: [button1]})
                }

                if(cld.customId === "button3"){ 
                    client.db.set(`${message.guild.id}_antiBan`, null);
                    client.db.set(`${message.guild.id}_antiKick`, null);
                    client.db.set(`${message.guild.id}_antiRole`, null);
                    client.db.set(`${message.guild.id}_antiChannel`, null);
                    client.db.set(`${message.guild.id}_antiWebhook`, null);
                    client.db.set(`${message.guild.id}_antiGuild`, null);
                    client.db.set(`${message.guild.id}_antiBot`, null);
                    cld.update({ embeds: [embed1], components: [row]})
                }

                if(cld.customId === "button4"){
                    const but5 = new ButtonBuilder().setCustomId("button5").setLabel('Timeout').setStyle(ButtonStyle.Secondary);
                    const but6 = new ButtonBuilder().setCustomId("button6").setLabel('Ban').setStyle(ButtonStyle.Secondary);
                    const but7 = new ButtonBuilder().setCustomId("button7").setLabel('Kick').setStyle(ButtonStyle.Secondary);
                    const but8 = new ButtonBuilder().setCustomId("button8").setLabel('RemoveRoles').setStyle(ButtonStyle.Secondary);

                    const button2 = new ActionRowBuilder().addComponents(but5, but6, but7, but8); 

                    const embed3 = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Select the punishment you want to set.`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()
                    
                    cld.update({ embeds: [embed3], components: [button2]})
                }

                if(cld.customId === "button5"){ 

                    const duration_modal = new ModalBuilder({
                        customId: `timeout_duration`,
                        title: 'Punishment Duration',
                    })

                    const durationInput = new TextInputBuilder({
                        custom_id: `duration`,
                        label: `Duration`,
                        style: TextInputStyle.Short,
                        Required: true,
                    })

                    const durationRow = new ActionRowBuilder().addComponents(durationInput)
                    duration_modal.addComponents(durationRow)
                    cld.showModal(duration_modal)
                }


                if(cld.customId === "button6"){ 
                    await client.db.set(`${message.guild.id}_punishment`, `ban`);

                    const but5 = new ButtonBuilder().setCustomId("button5").setLabel('Timeout').setStyle(ButtonStyle.Secondary).setDisabled(true);
                    const but6 = new ButtonBuilder().setCustomId("button6").setLabel('Ban').setStyle(ButtonStyle.Success).setDisabled(true);
                    const but7 = new ButtonBuilder().setCustomId("button7").setLabel('Kick').setStyle(ButtonStyle.Secondary).setDisabled(true);
                    const but8 = new ButtonBuilder().setCustomId("button8").setLabel('RemoveRoles').setStyle(ButtonStyle.Secondary).setDisabled(true);

                    const but9 = new ButtonBuilder().setCustomId("button9").setEmoji('<:discotoolsxyzicon4:1128592521589690429>').setLabel('Back').setStyle(ButtonStyle.Danger);
                    const but10 = new ButtonBuilder().setCustomId("button10").setEmoji('<:discotoolsxyzicon3:1128592544310251591>').setLabel('Next').setStyle(ButtonStyle.Success);

                    const butt = new ActionRowBuilder().addComponents(but5, but6, but7, but8);
                    const button3 = new ActionRowBuilder().addComponents(but9, but10);

                    let emb = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Punishment has been set to **ban**.`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()
                    
                    cld.update({ embeds: [emb], components: [butt, button3]})
                }

                if(cld.customId === "button7"){ 
                    await client.db.set(`${message.guild.id}_punishment`, `kick`);

                    const but5 = new ButtonBuilder().setCustomId("button5").setLabel('Timeout').setStyle(ButtonStyle.Secondary).setDisabled(true);
                    const but6 = new ButtonBuilder().setCustomId("button6").setLabel('Ban').setStyle(ButtonStyle.Secondary).setDisabled(true);
                    const but7 = new ButtonBuilder().setCustomId("button7").setLabel('Kick').setStyle(ButtonStyle.Success).setDisabled(true);
                    const but8 = new ButtonBuilder().setCustomId("button8").setLabel('RemoveRoles').setStyle(ButtonStyle.Secondary).setDisabled(true);

                    const but9 = new ButtonBuilder().setCustomId("button9").setEmoji('<:discotoolsxyzicon4:1128592521589690429>').setLabel('Back').setStyle(ButtonStyle.Danger);
                    const but10 = new ButtonBuilder().setCustomId("button10").setEmoji('<:discotoolsxyzicon3:1128592544310251591>').setLabel('Next').setStyle(ButtonStyle.Success);

                    const butt = new ActionRowBuilder().addComponents(but5, but6, but7, but8);
                    const button3 = new ActionRowBuilder().addComponents(but9, but10);

                    const emb = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Punishment has been set to **kick**.`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()
                    
                    cld.update({ embeds: [emb], components: [butt, button3]})
                }

                if(cld.customId === "button8"){ 
                    await client.db.set(`${message.guild.id}_punishment`, `removeroles`);

                    const but5 = new ButtonBuilder().setCustomId("button5").setLabel('Timeout').setStyle(ButtonStyle.Secondary).setDisabled(true);
                    const but6 = new ButtonBuilder().setCustomId("button6").setLabel('Ban').setStyle(ButtonStyle.Secondary).setDisabled(true);
                    const but7 = new ButtonBuilder().setCustomId("button7").setLabel('Kick').setStyle(ButtonStyle.Secondary).setDisabled(true);
                    const but8 = new ButtonBuilder().setCustomId("button8").setLabel('RemoveRoles').setStyle(ButtonStyle.Success).setDisabled(true);

                    const but9 = new ButtonBuilder().setCustomId("button9").setEmoji('<:discotoolsxyzicon4:1128592521589690429>').setLabel('Back').setStyle(ButtonStyle.Danger);
                    const but10 = new ButtonBuilder().setCustomId("button10").setEmoji('<:discotoolsxyzicon3:1128592544310251591>').setLabel('Next').setStyle(ButtonStyle.Success);

                    const butt = new ActionRowBuilder().addComponents(but5, but6, but7, but8);
                    const button3 = new ActionRowBuilder().addComponents(but9, but10);

                    const emb = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Punishment has been set to **removeroles**.`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()

                    cld.update({ embeds: [emb], components: [butt, button3]})
                }

                if(cld.customId === "button9") {
                    await client.db.set(`${message.guild.id}_punishment`, `none`);

                    const but5 = new ButtonBuilder().setCustomId("button5").setLabel('Timeout').setStyle(ButtonStyle.Secondary);
                    const but6 = new ButtonBuilder().setCustomId("button6").setLabel('Ban').setStyle(ButtonStyle.Secondary);
                    const but7 = new ButtonBuilder().setCustomId("button7").setLabel('Kick').setStyle(ButtonStyle.Secondary);
                    const but8 = new ButtonBuilder().setCustomId("button8").setLabel('RemoveRoles').setStyle(ButtonStyle.Secondary);

                    const button2 = new ActionRowBuilder().addComponents(but5, but6, but7, but8); 

                    const embed3 = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Select the punishment you want to set.`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()
                    
                    cld.update({ embeds: [embed3], components: [button2]})
                }
              
                if(cld.customId === "button10") {

                    await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
                    
                    const embed4 = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Select whitelist user by clicking drop-down`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()

                    const row2 = new ActionRowBuilder().addComponents(
                        new UserSelectMenuBuilder()
                        .setCustomId('whitelist')
                        .setPlaceholder('Select a user')
                        .setMinValues(1)
                        .setMaxValues(10)
                    )

                    cld.update({ embeds: [embed4], components: [row2]})
                    })
                }

                if(cld.customId == "whitelist") {

                    let value = cld.values;
                    let Guild = message.guild

                    await client.db.push(`${message.guild.id}_wl.whitelisted`, value);
                  
                    const embed4 = new EmbedBuilder()
                    .setColor(config.Success)
                    .setAuthor({ name: message.author.tag, iconURL: avatar})
                    .setDescription(`Users have been added to the whitelist:\n
${value.map(value => `<:tick:1114819476689539114>  **• ` + Guild.members.cache.get(value).user.tag + `**`).join("\n")}\n
**The Antinuke Setup Has Been Completed!**`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTimestamp()

                    cld.update({ embeds: [embed4], components: [] })   
                    
                    let x = await message.guild.channels.create({
                        name : `${client.user.username}-logs`,
                        type: ChannelType.GuildText,
                        topic : ``,
                        reason : ``
                  })

                  client.db.set(`${message.guild.id}_logschannel`, { channel: [`${x.id}`] })
                  client.db.set(`${message.guild.id}_antinuke`, true)
                }
            })

        } else if (args[0] === 'disable') {
            if (antinuke === null) {
                return message.reply(`Security is disabled for this server. To enable it, use \`${px}antinuke enable\`.`)
            }

            let avatar = message.author.displayAvatarURL({ dynamic: true }) || client.user.displayAvatar()
            
             client.db.set(`${message.guild.id}_antinuke`, false);
             client.db.set(`${message.guild.id}_logschannel`, { channel: [] })

             client.db.set(`${message.guild.id}_antiBan`, null);
             client.db.set(`${message.guild.id}_antiKick`, null);
             client.db.set(`${message.guild.id}_antiRole`, null);
             client.db.set(`${message.guild.id}_antiChannel`, null);
             client.db.set(`${message.guild.id}_antiWebhook`, null);
             client.db.set(`${message.guild.id}_antiGuild`, null);
             client.db.set(`${message.guild.id}_antiBot`, null);

             client.db.set(`${message.guild.id}_timeout`, null);
             client.db.set(`${message.guild.id}_ban`, null);
             client.db.set(`${message.guild.id}_kick`, null)
             client.db.set(`${message.guild.id}_removeroles`, null);

            const embed = new EmbedBuilder()
            .setColor(config.Success)
            .setAuthor({ name: message.author.tag, iconURL: avatar})
            .setDescription(`Anti Nuke has been disabled.`)
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
            .setTimestamp()
            message.channel.send({ embeds: [embed] })
            
        }
    }
}