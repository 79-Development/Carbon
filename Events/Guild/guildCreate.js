const client = require('../../index')
const { EmbedBuilder, Events } = require('discord.js');
const config = require('../../config.json');

client.on(Events.GuildCreate, async (guild) => {

    const embed = new EmbedBuilder()
    .setColor(config.EmbedColor)
    .setAuthor({ name: `NEW SERVER JOINED`, iconURL: guild.iconURL({ dynamic: true })})
    .setDescription(`**Name:** ${guild.name}
**ID:** ${guild.id}
**Members:** ${guild.memberCount + 1}
**Created At:** <t:${Math.round(guild.createdTimestamp/1000)}>
**Joined At:** <t:${Math.round(guild.joinedTimestamp/1000)}>`)
    .setTimestamp()

    const web = await client.fetchWebhook('1134330051534528574', '5pIK3vAg0TUmydr1E8v3P0dGz1-EmSnuhb7z5RP04f5Eb38M34bd04cw9WWZC2gJnC0W');
    web?.send({ embeds: [embed] })
});
