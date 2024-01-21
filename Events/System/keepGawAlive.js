const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const client = require('../../index');
const gawModel = require('../../Schema/Giveaway.js');

client.on('ready', async client => {await gaw(client)});

async function gaw(client){
    let l = await gawModel.find({status: true});
    
    l.forEach(async i => {
        if(Date.now() - Number(i.endtime) > 0 || Date.now() - Number(i.endtime) == 0){
            let guild = client.guilds.cache.get(i.serverID);
            if(!guild  || !guild.available) await client.guilds.fetch(i.serverID).catch(e => null);
            guild = client.guilds.cache.get(i.serverID);
            if(!guild || !guild.available) return;

            let id = i.msgid;
            if(!id) return;

            if(!i.status) return;

            await guild.channels.cache.get(i.chId).messages.fetch(i.msgid).catch(e => null);

            let msg = guild.channels.cache.get(i.chId).messages.cache.get(i.msgid);
            if(!msg) return;

            if(!i.entries || i.entries?.length == 0){
                let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`0 Entries`).setDisabled(true);
                
                await msg.edit({
                    components: [new ActionRowBuilder().addComponents(button)],
                    content: `🎉 **GIVEAWAY ENDED** 🎉`,
                    embeds: [new EmbedBuilder(msg.embeds[0].data)
                    .setDescription(`I couldn't pick a winner because there is no valid participant.`)
                    .setFooter({ text: `${l.winCount} Winner | Ended At`}) ]}).catch(e => null); 

                    i.status = false;                   
                    i.save();         
                    return;
                }

                // Drawing winner(s)
                let list = i.entries;
                var winnerId = ``;
                let winners = [];
                let no = Number(i.winCount) || 1;
                try{
                    for (let i = 0; i < no && list?.length != 0; i++){
                        let rid = list[Math.floor(Math.random() * list?.length)];
                        if(winnerId.length == 0) winnerId = winnerId + `<@${rid}>`;
                        else winnerId = winnerId + `, <@${rid}>`;

                        winners.push(rid);
                        i.winners.push(rid);

                        let r = [];
                        list.forEach(x => {
                            if(x != rid) r.push(x)
                        });
                        list = r;
                    };
                } catch (error){};

                let newLabel = [... new Set(i.entries)].length;
                let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`${newLabel} Entries`).setDisabled(true);
        
                await msg.edit({
                    components: [new ActionRowBuilder().addComponents(button)],
                    content: `🎉 **GIVEAWAY ENDED** 🎉`,
                    embeds: [new EmbedBuilder(msg.embeds[0].data)
                    .setDescription(`Winners: ${winnerId}
Hosted By: <@${i.host}>`)
                    .setFooter({ text: `${l.winCount} Winner | Ended At`}) ]});

                    i.status = false;
                    i.save();
                    
                    msg.channel.send({content: `Congratulations ${winnerId}! You won the **${i.prize}**!`}).catch(e => null);
                } else {
                    
                    let time = Number(i.endtime) - Date.now();
                    setTimeout(async () => {
                        let guild = client.guilds.cache.get(i.serverID);
                        if(!guild  || !guild.available) await client.guilds.fetch(i.serverID).catch(e => null);
                        guild = client.guilds.cache.get(i.serverID);
                        if(!guild || !guild.available) return;

                        let id = i.msgid;
                        if(!id) return;
                        if(!i.status) return;
    
                        await guild.channels.cache.get(i.chId).messages.fetch(i.msgid).catch(e => null);
    
                        let msg = guild.channels.cache.get(i.chId).messages.cache.get(i.msgid);
                        if(!msg) return;

                        if(!i.entries || i.entries?.length == 0){
                            let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`0 Entries`).setDisabled(true);
        
                            await msg.edit({
                                components: [new ActionRowBuilder().addComponents(button)],
                                content: `🎉 **GIVEAWAY ENDED** 🎉`,
                                embeds: [new EmbedBuilder(msg.embeds[0].data)
                                .setDescription(`I couldn't pick a winner because there is no valid participant.`)
                                .setFooter({ text: `${l.winCount} Winner | Ended At`})]});  

                                i.status = false;
                                i.save();         
                                return;
                            }
    
                            // Drawing winner(s)
                            let list = i.entries;
                            var winnerId = ``;
                            let winners = [];
                            let no = Number(i.winCount) || 1;
                            try{
                                for (let i = 0; i < no && list?.length != 0; i++){
                                    let rid = list[Math.floor(Math.random() * list?.length)];
                                    if(winnerId.length == 0) winnerId = winnerId + `<@${rid}>`;
                                    else winnerId = winnerId + `, <@${rid}>`;

                                    winners.push(rid);
                                    i.winners.push(rid);
    
                                    let r = [];
                                    list.forEach(x => {
                                        if(x != rid) r.push(x)
                                    });
                                    list = r;
                                };
                            } catch (error){};

                            let newLabel = [... new Set(i.entries)].length;
                            let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setLabel(`${newLabel} Entries`).setDisabled(true);
        
                            await msg.edit({
                                components: [new ActionRowBuilder().addComponents(button)],
                                content: `🎉 **GIVEAWAY ENDED** 🎉`,
                                embeds: [new EmbedBuilder(msg.embeds[0].data)
                                .setDescription(`Winners: ${winnerId.length != 0?winnerId:'\`Error came\` :skull:'}
Hosted By: <@${i.host}>`) 
                                .setFooter({ text: `${l.winCount} Winner | Ended At`}) ]});
    
                                i.status = false;
                                i.save();
    
                                msg.channel.send({content: `Congratulations ${winnerId}! You won the **${i.prize}**!`}).catch(e => null);
                            }, time)
                        }
                    })
                }