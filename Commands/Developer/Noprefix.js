const { EmbedBuilder } = require('discord.js');
const User = require('../../Schema/User.js');
const config = require('../../config.json');

module.exports = {
    name: 'noprefix',
    aliases: ['np'],
    description: '',
    usage: '',
    category: 'Developer',
    cooldown: 3,
    owner: true,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {
        
        if (!args[0]) {
            let err = new EmbedBuilder()
            .setColor(config.EmbedColor)
            .setTitle(`Noprefix Commands`)
            .setDescription(`\`noprefix add\` - Add user to no prefix.\n\`nopreix remove\` - Remove user from no prefix.`)
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTimestamp()

            return message.reply({ embeds: [err]})
        }

        let member;
        if (message.mentions.users.first()) {
            member = message.mentions.users.first() || args[1];
        } else if (args[1]) {
            member = await client.users.fetch(args[1], { force: true }).catch(err => { return undefined; })
        } else {
            member = message.author;
        }

        if (!member) {
            return message.reply(`Please provide a vaild user.`)
        }
        
        const user = await User.findOne({ userId: member.id }) || await User.create({ userId : member.id });

        if (!user) {
            return message.reply(`Please provide a vaild users.`)
        }

        if (args[0].toLowerCase() === 'add') {
            
            if (user.noprefix) {
                let err1 = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setDescription(`This user is already in my noprefix.`)

                return message.reply({ embeds: [err1]})  
            } else { 

                user.noprefix = true;
                await user.save();

                let embed = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setDescription(`<:codez_tick:1138104082377216023> | Added no prefix to ${member.tag} for all`)
        
                return message.reply({ embeds: [embed] })
            }
        } else if (args[0].toLowerCase() === 'remove') {
            if (!user.noprefix) {
                let err2 = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setDescription(`<:zzcross64:1138105630348025986> | ${member.tag} is not in no prefix!`)
                
                return message.reply({ embeds: [err2]})  
            } else { 

                user.noprefix = false;
                await user.save();

                let embed2 = new EmbedBuilder()
                .setColor(config.EmbedColor)
                .setDescription(`<:codez_tick:1138104082377216023> | Removed no prefix to ${member.tag} for all`)
        
                return message.reply({ embeds: [embed2] })
            }
        }
    }
}