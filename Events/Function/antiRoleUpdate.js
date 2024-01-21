const { AuditLogEvent, EmbedBuilder } = require('discord.js');
const client = require('../../index')
const config = require('../../config.json')

client.on("roleUpdate", async (o, n) => {
    const auditLogs = await n.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate }).catch((_) => { });
    const logs = auditLogs?.entries?.first();
    if(!logs) return;
    const { executor } = logs;

    await client.db.get(`${n.guild.id}_wl`).then(async (data) => {
        await client.db.get(`${n.guild.id}_owner`).then(async (data2) => {
            if(!data) return;
            const antinuke = await client.db.get(`${n.guild.id}_antiRole`);
            const trusted = data.whitelisted.includes(executor.id);
            const owner = data2.ExtraOwner.includes(executor.id);
 
            if (executor.id === n.guild.ownerId) return;
            if (executor.id === client.user.id) return;
            if (antinuke !== true) return;  
            if (owner === true) return;
            if (trusted === true) return;

            let enable = client.db.get(`${n.guild.id}_antinuke`)
    
            if (enable === `true`) return;
    
            let set = await client.db.get(`${n.guild.id}_punishment`);

            if (set == `timeout`) {
                let m = n.guild.members.cache.get(executor.id);
                m.roles.cache.forEach((x) => m.roles.remove(x).catch(e => null));
      
                let duration = await client.db.get(`${n.guild.id}_timeout`)
                let dura = duration.time
                let timeout = dura[0]
                let reason = `Unwhitelisted user`
            
                await m.timeout(timeout, reason).catch((_) => { });
                punish = `Timeout`
            } else if (set == `ban`) {
                await n.guild.members.ban(executor.id, { reason: `Unwhitelisted user` }).catch((_) => { });
                punish = `Banned`
            } else if (set == `kick`) {
                await n.guild.members.kick(executor.id, { reason: `Unwhitelisted user` }).catch((_) => { });
                punish = `Kicked`
            } else if (set == `removeroles`) {
                let m = n.guild.members.cache.get(executor.id);
                m.roles.cache.forEach((x) => m.roles.remove(x).catch(e => null))
                punish = `Removed Roles`
            }
            const oldName = o.name;
            const newName = n.name;

            if (oldName !== newName) {
                await n.setName(oldName).catch((_) => { });
            }
            await n.setPermissions(o.permissions).catch((_) => { });
        });
    });
});