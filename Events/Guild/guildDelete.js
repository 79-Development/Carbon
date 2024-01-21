const client = require('../../index')
const { EmbedBuilder, Events } = require('discord.js');
const config = require('../../config.json');

client.on(Events.GuildDelete, async (guild) => {
    const embed = new EmbedBuilder()
    .setColor(config.EmbedColor)
    .setAuthor({ name: `SERVER LEAVED!`, iconURL: guild.iconURL({ dynamic: true })})
    .setDescription(`**Name:** ${guild.name}
**ID:** ${guild.id}
**Members:** ${guild.memberCount + 1}
**Created At:** <t:${Math.round(guild.createdTimestamp/1000)}>
**joined At:** <t:${Math.round(guild.joinedTimestamp/1000)}>`)
    .setTimestamp()

    const web = await client.fetchWebhook('1134332011453091931', 'j4aNiSiuU0zxTTxskwx9rI1Ckit1Pn8o1ZZgnwc_a8_2dzmGWksokkAm5pX_rbDcjdVD');
    web?.send({ embeds: [embed] })  
});