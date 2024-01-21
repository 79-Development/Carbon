const model = require(`../../Schema/User.js`);

module.exports = {
    name: 'afk',
    aliases: [],
    description: 'Set your afk status.',
    category: 'Utility',
    usage: 'afk <reason>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        const reason = args.join(" ") || `None`;

        let data = await model.findOne({guildId: message.guild.id, userId: message.author.id});
        
        if(!data){
          let ent = await model.create({guildId: message.guild.id, userId: message.author.id, afk: [Date.now(), reason]});
          ent.save();
        } else {
          data.afk = [Date.now(), reason];
          data.save();
        }

        //afk.set(message.author.id, [Date.now(), reason]);

        message.channel.send({
          content: `<:stolen_emoji:1114819476689539114> Your afk status has been set to - **${reason}**!`
        })
    }
}