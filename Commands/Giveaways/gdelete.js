const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const gawModel = require('../../Schema/Giveaway.js');
const config = require('../../config.json');
const db = require('../../Schema/Prefix.js');

module.exports = {
    name: 'gdelete',
    aliases: ['giveawaydelete'],
    description: 'Deletes a giveaway.',
    category: 'Giveaways',
    usage: 'gdelete <giveaway message id>',
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
        .setColor('#ee1717')
        .setDescription(`Please mention the Giveaway ID when should the giveaway delete!
Example: \`${px}gdelete <giveaway id>\``)

        let id = args[0];
        if(!id) {
            await message.reply({embeds :[err1]});
            return;
        }

        let entry = await gawModel.findOne({msgid: id, serverID: message.guildId});
        if(!entry){
            await message.reply({content: `There is no such giveaway running with this ID`});
            return;
        }

        await message.guild.channels.cache.get(entry.chId).messages.fetch(entry.msgid).catch(e => null);

        let msg = message.guild.channels.cache.get(entry.chId).messages.cache.get(entry.msgid);
        if(!msg){
            await message.reply({content: `There is no such giveaway running with this ID`});
            return;
        }

        const but1 = new ButtonBuilder().setCustomId("button1").setLabel('Yes').setStyle(ButtonStyle.Success);
        const but2 = new ButtonBuilder().setCustomId("button2").setLabel('No').setStyle(ButtonStyle.Danger);
        const button = new ActionRowBuilder().addComponents(but1, but2);

        const Message = await message.reply({ 
            components: [button],
            content: `Are you sure you want to delete this giveaway.`,
            fetchReplay: true
        })

        const collector = Message.createMessageComponentCollector({
            filter: (b) => {
                if(b.user.id === message.author.id) return true;
                 else {
               b.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`}); return false;
                     };
                },
                time : 60000,
                idle: 60000/2
            });

            collector.on("collect", async (cld) => {
                if(cld.customId === "button1"){
                    await msg.delete();
                  cld.update({ content: `<:tick:1114819476689539114> | Successfully Deleted Giveaway.`, components: []})
                }

                if(cld.customId === "button2"){
                  cld.update({ content: `Cancelled the command.`, components: [] })
                }
            })
    }
}