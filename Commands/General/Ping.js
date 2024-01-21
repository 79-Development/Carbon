const ms = require('ms');

module.exports = {
    name: 'ping',
    aliases: ['ms'],
    description: 'Shows bot ping.',
    category: 'Utility',
    usage: 'ping',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        let xd = await client.db.ping(ms)

        message.channel.send('Pinging...').then(Message => {
            Message.edit(`Pong! Bot Latency is **${Message.createdTimestamp - message.createdTimestamp}ms**. Api Latency is **${client.ws.ping}ms**
Database Latency is **${xd}ms**. Message Latency is **${Date.now() - message.createdTimestamp}ms**`);
          })
    }
}