const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const gawModel = require('../../Schema/Giveaway.js');
const config = require('../../config.json');

module.exports = {
    name: 'glist',
    aliases: ['giveawaylist'],
    description: 'Show the list of all running giveaways.',
    category: 'Giveaways',
    usage: 'glist',
    cooldown: 3,
    userPermissions: ['Administrator'],
    botPermissions: ['Administrator'],
    run: async (client, message, args) => {
        
        let allgaws = await gawModel.find({ serverID: message.guildId, status: true }).then(gaws => gaws.map(entry => `| ${entry.prize} | [Giveaway Link](https://discord.com/channels/${message.guildId}/${entry.chId}/${entry.msgid}) | <t:${((entry.endtime) / 1000).toFixed(0)}:R> | **${[... new Set(entry.entries)].length}** Entries`));

        if(allgaws.length == 0){
            message.reply({ content: `There is no Giveaway running` });
            return;
        }

        let currentPage = 0;
        let embeds = [];
        let icon = message.guild.iconURL() || client.user.displayAvatarURL()
            
        if(Array.isArray(allgaws)){
            let jo = 1;
            let newL = [];
            allgaws.forEach(em => {
                let koi = `\`${jo}.\``.concat(em);
                newL.push(koi);
                jo++;
            });
            allgaws = newL;
            let k = 20;
            let n = 0;
            for (let i = 0; i < allgaws.length; i += 20) {
                const current = allgaws.slice(i, k);
                k += 20;
                n++;
                const embed = new EmbedBuilder()
                .setDescription(current.join("\n"))
                .setAuthor({ name: `${message.guild.name}'s Giveaway List`, iconURL: icon})
                .setFooter({ text: `${allgaws.length} Giveaway Running... Page ${n}/${Math.ceil((allgaws.length)/20)} ` })
                .setColor(config.EmbedColor)
                embeds.push(embed);
            }
        }

        if (embeds.length === 1) return message.reply({embeds: [embeds[0]]}).catch(e => null);

        let button_back = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId('ba1')
        .setLabel("Back")
        .setDisabled(false)
        let button_forward = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId('ba3')
        .setLabel("Next")
        .setDisabled(false)
        let button_stop = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId('bastop')
        .setEmoji("<:crosszz:1124281794670362644>")
        
        let swapmsg = await message.reply({
            embeds: [embeds[0]], 
            components: [new ActionRowBuilder().addComponents([button_back.setDisabled(), button_stop, button_forward])]
        });
        
        const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.message.author.id == client.user.id, time: 30e3 }); //collector for 5 seconds
            //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
            collector.on('collect', async b => {
                collector.resetTimer();
                if(b?.user.id !== message.author.id)
                return b?.reply({content: `You are not allowed to use these Buttons!`, ephemeral: true})
                    //page forward
                if(b?.customId == "ba1") {
                    if (currentPage !== 0) {
                        currentPage -= 1
                        await swapmsg.edit({embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents([button_back.setDisabled(false), button_stop, button_forward.setDisabled(false)])]}).catch(() => {});
                        if(currentPage == 0) await swapmsg.edit({components: [new ActionRowBuilder().addComponents([button_back.setDisabled(), button_stop, button_forward.setDisabled(false)])]}).catch(() => {});
                        await b?.deferUpdate();
                    } else {
                        b?.deferUpdate();
                    }
                } else if(b?.customId == "ba2"){
                    currentPage = embeds.length - 1;
                    await swapmsg.edit({embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents([button_back.setDisabled(false), button_stop, button_forward.setDisabled()])]}).catch(() => {});
                    await b?.deferUpdate();
                } else if(b?.customId == "ba4"){
                    currentPage = 0;
                    await swapmsg.edit({embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents([button_back.setDisabled(), button_stop, button_forward.setDisabled(false)])]}).catch(() => {});
                    await b?.deferUpdate();
                } else if(b?.customId == "ba3"){
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        await swapmsg.edit({embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents([button_back.setDisabled(false), button_stop, button_forward.setDisabled(false)])]}).catch(() => {});
                        if(currentPage == embeds.length - 1) await swapmsg.edit({components: [new ActionRowBuilder().addComponents([button_back.setDisabled(false), button_stop, button_forward.setDisabled()])]}).catch(() => {});
                        await b?.deferUpdate();
                    } else {
                        await b?.deferUpdate();
                    }
                    
                } else if(b?.customId == "bastop"){
                    await b?.deferUpdate();
                    collector.stop();
                }
            });
            collector.on("end", async (collected, reason) => {
                await swapmsg.edit({embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents([button_back.setDisabled(), button_stop.setDisabled(), button_forward.setDisabled()])]}).catch(() => {});
            });
        
    }
}