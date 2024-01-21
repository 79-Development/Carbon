const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const gawModel = require('../../Schema/Giveaway.js');
const config = require('../../config.json');
const db = require('../../Schema/Prefix.js');


module.exports = {
    name: 'gend',
    aliases: ['giveawayend'],
    description: 'Ends a giveaway.',
    category: 'Giveaways',
    usage: 'gend <giveaway message id>',
    cooldown: 3,
    userPermissions: ['Administrator'],
    botPermissions: ['Administrator'],
    run: async (client, message, args) => {

        let px;
        const data = await db.findOne({ Guild: message.guild.id });
        if (!data || !data.Prefix) {
          px = config.PREFIX;
        } else {
          px = data.Prefix;
        } 
 
        let err1 = new EmbedBuilder()
        .setColor(config.Danger)
        .setDescription(`Please mention the Giveaway ID when should the giveaway end!
Example: \`${px}gend <giveaway id>\``)

        let id = args[0];
        if(!id) {
            await message.reply({embeds :[err1]});
            return;
        }

        let entry = await gawModel.findOne({msgid: id, serverID: message.guildId});
        if(!entry){
            let err2 = new EmbedBuilder()
            .setColor(config.Danger)
            .setDescription(`There is no such giveaway running with this ID`)
            await message.reply({ embeds: [err2] });
            return;
        }

        if(!entry.status){
            let err3 = new EmbedBuilder()
            .setColor(config.Danger)
            .setDescription(`Giveaway already Ended.`)
            await message.reply({ embeds: [err3] });
            return;
        }

        await message.guild.channels.cache.get(entry.chId).messages.fetch(entry.msgid).catch(e => null);

        let msg = message.guild.channels.cache.get(entry.chId).messages.cache.get(entry.msgid);

        if(!msg){
            let err4 = new EmbedBuilder()
            .setColor(config.Danger)
            .setDescription(`There is no such giveaway running with this ID.`)
            await message.reply({ embeds: [err4]});
            return;
        }

        let newLabel = [... new Set(entry.entries)].length;
        let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`${newLabel} Entries`).setDisabled(true);
        
        if(!entry.entries || entry.entries?.length == 0){
            await msg.edit({
                components: [new ActionRowBuilder().addComponents(button)],
                content: `🎉 **GIVEAWAY ENDED** 🎉`,
                embeds: [new EmbedBuilder(msg.embeds[0].data)
                .setDescription(`I couldn't pick a winner because there is no valid participant.`)
                .setFooter({ text: `${entry.winCount} Winner | Ended At`}) ]});

                entry.status = false;
                entry.save();         
                return;
            }

            // Drawing winner(s)
            let list = entry.entries;
            var winnerId = ``;
            let winners = [];
            let no = Number(entry.winCount) || 1;
            try{
                for (let i = 0; i < no && list?.length != 0; i++){
                    let rid = list[Math.floor(Math.random() * list?.length)];
                    if(winnerId.length == 0) winnerId = winnerId + `<@${rid}>`;
                    else winnerId = winnerId + `, <@${rid}>`;
                    winners.push(rid);
                    entry.winners.push(rid);
                    let r = [];
                    list.forEach(x => {
                        if(x != rid) r.push(x)
                    });
                    list = r;
                };
            } catch (error){};
            
            let button1 = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`${newLabel} Entries`).setDisabled(true);
        
            await msg.edit({
                components: [new ActionRowBuilder().addComponents(button1)],
                content: `🎉 **GIVEAWAY ENDED** 🎉`,
                embeds: [new EmbedBuilder(msg.embeds[0].data)
                .setDescription(`Winners: ${winnerId.length != 0 ? winnerId : '\`Error came\`'}
Hosted by: <@${entry.host}>`)
                .setFooter({ text: `${entry.winCount} Winner | Ended At`})
                .setTimestamp(Date.now())]});

                entry.status = false;
                entry.save();

                message.reply([ new EmbedBuilder().setColor(config.Success).setDescription(`<:tick:1114819476689539114> | Successfully Ended Giveaway.`) ])
                
                msg.reply({content: `Congratulations ${winnerId}! You won the **${entry.prize}**!`}).catch(e => null);
            }
        }