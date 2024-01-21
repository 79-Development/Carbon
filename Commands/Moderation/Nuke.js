const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'nuke',
    aliases: ['clone'],
    description: 'Nuke A Channel',
    category: 'Moderation',
    usage: 'nuke',
    cooldown: 3,
    userPermissions: ['Administrator'],
    botPermissions: ['ManageChannels'],
    run: async (client, message, args) => {

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(
            (r) =>
            r.name.toLowerCase() ==
            args.slice(0).join(" ").toLowerCase()
            ) ||
            message.channel;
        
            if (!channel) {
                return message.reply({ content: "Please provide a valid channel." });
            }

            if (!channel.deletable) {
                return message.reply({ content: "This channel is not deleteable." });
            }


            const position = channel.rawPosition;

            const but1 = new ButtonBuilder().setCustomId("button1").setLabel('Yes').setStyle(ButtonStyle.Success);
            const but2 = new ButtonBuilder().setCustomId("button2").setLabel('No').setStyle(ButtonStyle.Danger);


            const button1 = new ActionRowBuilder().addComponents(but1, but2);

            const Message = await message.reply({ 
                content: `Are you sure you want to clone this channel?`,
                components: [button1],
                fetchReplay: true 
            })

            const collector = Message.createMessageComponentCollector({
                filter: (b) => {
                 if(b.user.id === message.author.id) return true;
                 else {
                   b.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`}); return false;
                 };
               },
               time : 25000,
               idle: 25000/2
             });


             collector.on("collect", async (cld) => {
                if(cld.customId === "button1"){
                    await channel.clone({ position }).then(ch => ch.send(`Nuked by \`${message.author.tag}\``)).catch((_) => { });
                    await channel.delete().catch((_) => { });
                } 
                if(cld.customId === "button2"){
                    cld.update({
                        content: `Cancelled the command.`,
                        components: []
                    })
                }
            })

            collector.on("end", async (collected) => {
                if (collected.size === 0) {
                Message.edit({
                    content: `Timed out.`,
                    components: []})
                }
            })

    }
}