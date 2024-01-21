const db = require('../../Schema/Prefix.js');
const config = require(`../../config.json`)

module.exports = {
    name: 'prefix',
    aliases: ['setprefix', 'changeprefix'],
    description: 'Set the prefix for the bot',
    category: 'Moderation',
    usage: 'prefix <prefix>',
    cooldown: 3,
    userPermissions: ['ManageGuild'],
    botPermissions: ['ManageGuild'],
    run : async(client, message, args, prefix)=> {  
  
        const data = await db.findOne({ Guild: message.guildId });
        const pre = await args.join(' ');

        let px;
        if (!data || !data.Prefix) {
          px = config.PREFIX;
        } else {
          px = data.Prefix;
        } 
        
        if (!pre[0]) {
            return message.channel.send(`The current prefix is \`${px}\``);
        }
    
        if (pre[0].length > 3) {
            return message.channel.send(`Prefix can only be 3 characters long`);
        }

        if (data) {
            data.oldPrefix = prefix;
            data.Prefix = pre;
            await data.save();
            return message.reply(`Prefix has been set to \`${pre}\``);
        } else {
            const newData = new db({
                Guild: message.guildId,
                Prefix: pre,
                oldPrefix: prefix,
            });
            await newData.save();
            return message.reply(`Prefix has been set to \`${pre}\``);
        }

  },
};
