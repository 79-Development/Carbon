const client = require('../../index');
const { Events } = require('discord.js');

client.on(Events.GuildMemberAdd, async (member) => {

    try {
        if (member.user.bot === false) {
            let humans = await client.db.get(`${member.guild.id}_humans`)
            const id = humans.id
    
            id.forEach((roleId) => {
                const role = member.guild.roles.cache.get(roleId);

                member.roles.add(role)
            });
        } else if (member.user.bot === true) {
            let bots = await client.db.get(`${member.guild.id}_bots`)
            const id = bots.id

            id.forEach((roleId) => {
                const role = member.guild.roles.cache.get(roleId);

                member.roles.add(role)
            });
        }
    } catch (e) {
        return;
    }
})