const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
const config = require('../../config.json')

module.exports = {
  name: 'invite',
  aliases: ['inv'],
  description: 'Get the invite link for the bot.',
  category: 'Utility',
  usage: 'invite',
  cooldown: 3,
  userPermissions: [''],
  botPermissions: [''],
  run: async (client, message, args) => {


    const but1 = new ButtonBuilder().setURL(config.inviteURL).setLabel('Invite').setStyle(ButtonStyle.Link);
    const but2 = new ButtonBuilder().setURL(config.supportURL).setLabel('Support Server').setStyle(ButtonStyle.Link);

    const button1 = new ActionRowBuilder().addComponents(but1, but2);

      await message.channel.send({
        content: `Here You Go!`,
        components: [button1]
      });
  }
};