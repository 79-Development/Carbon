const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'hide',
    aliases: [''],
    description: 'Hides a channel',
    category: 'Moderation',
    usage: 'hide <channel> <role>',
    cooldown: 3,
    userPermissions: ['ManageChannels'],
    botPermissions: ['ManageChannels'],
    run: async (client, message, args) => {
        
        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]) ||
        message.guild.channels.cache.find( (r) => r.name.toLowerCase() == args.slice(0).join(" ").toLowerCase()) ||
        message.channel;

        if (!channel) {
            return message.reply({ content: `Please provide a valid channel.` })
        }

        let role = message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]) ||
        message.guild.roles.cache.find((r) => r.name.toLowerCase() ==
        args.slice(1).join(" ").toLowerCase()
        );
        
        if (role) {

            if (!role) {
                return message.reply({ content: `Please provide a valid role.` })
            }

              await channel.permissionOverwrites.create(role.id, { ViewChannel: false }); 
              
              let embed = new EmbedBuilder()
              .setColor(config.Success)
              .setDescription(`<:tick:1114819476689539114> | ${channel} has been hidden from <@&${role.id}> role.`)
              
              
              message.reply({ embeds: [embed] })  
        } else {

            if(channel.permissionsFor(message.guild.id).has(`ViewChannel`) === false){
                let emb = new EmbedBuilder()
                .setColor(config.Danger)
                .setDescription(`<:cross:1114823672163729490> | already channel has been hidden from @everyone role.`)
                return message.reply({ embeds: [emb] })
            }

            await channel.permissionOverwrites.create(message.guild.id, { ViewChannel: false }).catch((_) => { });

            let embed = new EmbedBuilder()
            .setColor(config.Success)
            .setDescription(`<:tick:1114819476689539114> | ${channel} has been hidden from @everyone role.`)
            
            message.reply({ embeds: [embed] })
        }
    }
}