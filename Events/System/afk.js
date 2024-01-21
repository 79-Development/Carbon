const client = require('../../index')
const moment = require('moment');
const ms = require('ms')
const model = require('../../Schema/User.js');

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;
  
  const mentionedMember = message.mentions.members.first();
  if (mentionedMember) {
    let data = await model.findOne({userId: mentionedMember.id, guildId: message.guild.id});
    //const data = afk.get(mentionedMember.id);

    let user = message.mentions.users.first() || args[0];

    if (Array.isArray(data?.afk)) {
      const [timestamp, reason] = data.afk;
      const timeAgo = moment(timestamp).fromNow();
            
      if(timestamp && reason) message.channel.send({
        content: `**${user.tag}** went AFK <t:${(timestamp/1000).toFixed(0)}:R>: **${reason}**`
      });
    }
  }

  let getData = await model.findOne({userId: message.author.id, guildId: message.guild.id});
  if (Array.isArray(getData?.afk)) {

    const [timestamp, reason] = getData.afk;
    await model.findOneAndUpdate({userId: message.author.id, guildId: message.guild.id}, {$set:{afk: null}});
    const timeAgo = moment(timestamp).fromNow();

    message.channel.send({
      content: `Welcome back! You went afk ${timeAgo} with the reason - **${reason}**`
    });
  }
})