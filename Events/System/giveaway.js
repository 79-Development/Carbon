const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../../index');
const gawModel = require('../../Schema/Giveaway.js');

client.on('interactionCreate', async interaction => {
    
    if(!interaction.isButton()) return;
    if(!interaction.customId.startsWith('gaw')) return;

    if(interaction.customId == 'gaw-enter'){
        let gentry = await gawModel.findOne({msgid: interaction.message.id, serverID: interaction.guildId});
        if(!gentry.status) {
            await interaction.reply({content:'This giveaway has been ended', ephemeral: true});
            return;
        }

        if(gentry.entries.includes(interaction.member.id)) {
            let mg = await interaction.reply({ content: 'Do you want to leave the Giveaway', components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('gawentry-yes').setLabel('Yes').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('gawentry-no').setLabel('No').setStyle(ButtonStyle.Secondary)
                )], fetchReply: true, ephemeral: true });
            
    
                await mg.awaitMessageComponent({filter: (i) => i.isButton() && i.user.id == interaction.user.id, idle: 30000})
                .then(async i => {
                    if(i.customId == 'gawentry-yes') {
                    var newList = [];
                    gentry.entries.forEach(i => {
                        if(i != interaction.member.id) newList.push(i)
                    });
                    gentry.entries = newList;
                    gentry.save();

                    i.reply({content: 'Successfuly opted out of the Giveaway', ephemeral: true});
                } else i.deferUpdate()
                await interaction.deleteReply().catch(e => null);
            })
            .catch(e => {
                interaction.deleteReply().catch(e => null);
            });

            let newLabel = [... new Set(gentry.entries)].length;
            let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setEmoji('🎉').setLabel(`${newLabel}`);

            await interaction.message.edit({
                components: [new ActionRowBuilder().addComponents(button)],
                embeds: [new EmbedBuilder(interaction.message.embeds[0].data).setDescription(`Ends: <t:${(gentry.endtime/1000).toFixed(0)}:R> (<t:${(gentry.endtime/1000).toFixed(0)}>)
Hosted by: <@${gentry.host}>`)]})
                return;
            }

            await interaction.deferReply({ephemeral: true, fetchReply: true});
            
            gentry.entries.push(interaction.member.id); 
            await gentry.save();

            interaction.editReply('Successfully taken part in the Giveaway.');

            let newLabel = [... new Set(gentry.entries)].length;
            let button = new ButtonBuilder().setCustomId('gaw-enter').setStyle(ButtonStyle.Secondary).setEmoji('🎉').setLabel(`${newLabel}`);

            interaction.message.edit({
                components: [new ActionRowBuilder().addComponents(button)],
                embeds: [new EmbedBuilder(interaction.message.embeds[0].data).setDescription(`Ends: <t:${(gentry.endtime/1000).toFixed(0)}:R> (<t:${(gentry.endtime/1000).toFixed(0)}>)
Hosted by: <@${gentry.host}>`) ]});
    }
})