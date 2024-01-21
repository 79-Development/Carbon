const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const gawModel = require('../../Schema/Giveaway.js');
const config = require('../../config.json');
const db = require('../../Schema/Prefix.js');
const ms = require('ms');

module.exports = {
    name: 'gstart',
    aliases: ['giveawaystart'],
    description: 'Start a giveaway.',
    category: 'Giveaways',
    usage: 'gstart <duration> <winner> <prize>',
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
        .setDescription(`You have missed an option \`time\`. Example:
\`\`\`${px}gstart <time> <winners> <prize>\`\`\``)

        if(!args || args.length == 0) {
            return message.reply({ embeds: [err1] });
        }

        var sendMsg = true;
        var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.channel;
        if(!message.guild.channels.cache.get(args[2]) && channel == message.channel){
            sendMsg = false;

            if(!args[0]) {
                return message.reply({ embeds: [err2] });
            }
    
            var time = ms(args[0]);

            let err2 = new EmbedBuilder()
            .setColor(config.Danger)
            .setDescription(`You have missed an option \`winners\`. Example:
\`\`\`${px}gstart <time> <winners> <prize>\`\`\``)

            var winnerCount
            if(!args[1]) return message.reply({ embeds: [err2] })
            if(args[1].endsWith('w')) winnerCount = Number(args[1].slice(0, -1));
            else winnerCount = Number(args[1]);
            if(!winnerCount)
            return message.reply({ embeds: [err2] });

            let err3 = new EmbedBuilder()
            .setColor(config.Danger)
            .setDescription(`You have missed an option \`prize\`. Example:
\`\`\`${px}gstart <time> <winners> <prize>\`\`\``)

            var prize = args.slice(2).join(" ");
            if(prize.length == 0)
            return message.reply({ embeds: [err3] });

            
            if (time > 21*24*60*60*1000) {
                let err4 = new EmbedBuilder()
                .setColor(config.Danger)
                .setDescription(`You cannot keep the duration longer than 21 Days.`)
                return message.reply({ embeds: [err4] })
            }

            if(time < 10*1000) time = 60*1000;
            var host = message.member;
            if(winnerCount < 0 || !Number.isInteger(winnerCount)) winnerCount = 1;
        }else {
            if(!args[0])
            return message.reply({embeds: [err1]});
            var time = ms(args[0]);

            var winnerCount
            if(!args[1]) return message.reply({ embeds: [err2] });
            if(args[1].endsWith('w')) winnerCount = Number(args[1].slice(0, -1));
            else winnerCount = Number(args[1])
            
            if(!winnerCount)
            return message.reply({ embeds: [err2] });

            var prize = args.slice(3).join(" ");
            if(prize.length == 0)
            return message.reply({ embeds: [err3] });

            if(time < 10*1000) time = 60*1000;
            var host = message.member;
            if(winnerCount < 0 || !Number.isInteger(winnerCount)) winnerCount = 1;
        }
        
        
        var canc = false;

        let icon = message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL()
        let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setEmoji('🎉').setLabel('0');
        
        let embed1 = new EmbedBuilder()
        .setColor(config.EmbedColor)
        .setAuthor({ name: `${prize}`, iconURL: icon})
        .setDescription(`Ends: <t:${((Date.now() + time)/1000).toFixed(0)}:R> (<t:${((Date.now() + time)/1000).toFixed(0)}>)
Hosted by: ${host}`)
        .setFooter({ text: `${winnerCount} Winner | End At`})
        .setTimestamp(Date.now() + time)
        
        let gmsg = await channel.send({
            content: `🎉 **GIVEAWAY STARTED** 🎉`,
            embeds: [embed1], 
            components: [new ActionRowBuilder().addComponents(button)]
        })

        if(canc) return;

        let gentry = await gawModel.create({
            msgid: gmsg.id,
            serverID: message.guildId,
            status: true,
            chId: channel.id,
            host: host.id,
            prize: prize,
            winCount: winnerCount,
            endtime: Date.now() + time,
            entrylimit: 'infinite'
        }); // CHANGES ON YOUR OWN RISK

        gentry.save();

        if(sendMsg) message.reply({ content: `Giveaway Started in <#${channel.id}>`, components: [] });
        else message.delete().catch(() => null);

        // Ending..
        setTimeout(async () => {
            let id = gmsg.id;
            if(!id) return;

            let entry = await gawModel.findOne({msgid: id, serverID: message.guildId});
            if(!entry) return;

            if(!entry.status) return;
            
            let newLabel = [... new Set(entry.entries)].length;

            await message.guild.channels.cache.get(entry.chId).messages.fetch(entry.msgid).catch(e => null);

            let msg = message.guild.channels.cache.get(entry.chId).messages.cache.get(entry.msgid);
            if(!msg) return;

            if(!entry.entries || entry.entries?.length == 0){
                let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`0 Entries`).setDisabled(true);

                await msg.edit({
                    components: [new ActionRowBuilder().addComponents(button)],
                    content: `🎉 **GIVEAWAY ENDED** 🎉`, 
                    embeds: [new EmbedBuilder(msg.embeds[0].data)
                    .setDescription(`I couldn't pick a winner because there is no valid participant.`)
                    .setFooter({ text: `${winnerCount} Winner | Ended At`}) ]});
                    
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

                let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`${newLabel} Entries`).setDisabled(true);
        
                await msg.edit({
                    components: [new ActionRowBuilder().addComponents(button)], 
                    content: `🎉 **GIVEAWAY ENDED** 🎉`,
                    embeds: [new EmbedBuilder(msg.embeds[0].data)
                    .setDescription(`Winners: ${winnerId.length != 0?winnerId:'\`Error came\`'}
Hosted by: <@${entry.host}>`)
                    .setFooter({ text: `${winnerCount} Winner | Ended At`}) ]});

                    entry.status = false;
                    entry.save();

                    msg.reply({content: `Congratulations ${winnerId}! You won the **${entry.prize}**!`}).catch(e => null);
                }, time)
            }
        };