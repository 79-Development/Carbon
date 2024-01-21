const client = require('../../index');
const { EmbedBuilder } = require('discord.js');

client.rest.on('rateLimited', async data => {
    const embed = new EmbedBuilder()
    .setColor(config.EmbedColor)
    .setTitle(`Ratelimited:`)
    .setDescription(new String(data.number))

    const web = await client.fetchWebhook('1137662974572646450', 'vqUrX-PFSRkWGyncSO7MrzYel3zANE7ONTcqqfL3CB1iC4iM4Ha9rEzWwPMqQu5gFKJu');
    web?.send({ embeds: [embed] })  
});