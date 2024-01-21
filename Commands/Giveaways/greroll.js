const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const gawModel = require('../../Schema/Giveaway.js');
const config = require('../../config.json');
const db = require('../../Schema/Prefix.js');

module.exports = {
    name: 'greroll',
    aliases: ['giveawayreroll'],
    description: 'Rerolls a giveaway.',
    category: 'Giveaways',
    usage: 'greroll <giveaway message id>',
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
        .setDescription(`Please mention the Giveaway ID when should the giveaway reroll!
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
            await message.reply({ embeds: [err2] })
            return;
        }

        if(entry.status){
            let err3 = new EmbedBuilder()
            .setColor(config.Danger)
            .setDescription(`Giveaway is still running. Wanna roll winner(s)?, try to end the giveaway`)
            await message.reply({ embeds: [err3] });
            return;
        }

        await message.guild.channels.cache.get(entry.chId).messages.fetch(entry.msgid).catch(e => null)

        let msg = message.guild.channels.cache.get(entry.chId).messages.cache.get(entry.msgid);
        if(!msg){
            await message.reply({content: `There is no such giveaway running with this ID`})
            return;
        }
            
        if(entry.winners?.length > 0){
            let role1 = message.guild.roles.cache.get(config.winrole);
            if(role1){
                entry.winners.forEach(async i => {
                    await message.guild.members.fetch(i).catch(e => null);
                    await message.guild.members.cache.get(i).roles.remove(role, 'Giveaway Re rolled').catch(e => null);
                });
            }
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

        let newLabel = [... new Set(entry.entries)].length;
        let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`${newLabel} Entries`).setDisabled(true);
        
        await msg.edit({
            components: [new ActionRowBuilder().addComponents(button)],
            content: `🎉 **GIVEAWAY ENDED** 🎉`,
            embeds: [new EmbedBuilder(msg.embeds[0].data)
            .setDescription(`Winners: ${winnerId.length != 0?winnerId.concat(' *(rerolled)*'):'\`Error came\`'}
Hosted By: <@${entry.host}>`)]});

            entry.status = false;
            entry.save();

            message.reply([ new EmbedBuilder().setColor(config.Success).setDescription(`<:tick:1114819476689539114> | Successfully Rerolled Giveaway.`) ])
            
            msg.reply({content: `Congratulations ${winnerId}! You won the **${entry.prize}**!`}).catch(e => null);
        }
    }