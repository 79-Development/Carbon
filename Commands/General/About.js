const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, version } = require("discord.js");
const config = require('../../config.json');
const prettyMilliseconds = require('pretty-ms');
const os = require("os");

module.exports = {
    name: 'about',
    aliases: ['stats'],
    description: 'Get information about the bot.',
    category: 'Utility',
    usage: 'help',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        const cpus = os.cpus();
        let idleCpu = 0;
        let totalCpu = 0;
        for (const cpu of cpus) {
            for (const type in cpu.times) {
                totalCpu += cpu.times[type];
            }
            idleCpu += cpu.times.idle;
        }
        const percentageCpu = Math.round(((totalCpu - idleCpu) / totalCpu) * 100);

        let count = 0;

        client.guilds.cache.forEach((guild) => {
            count += guild.memberCount;
        });

        const embed = new EmbedBuilder()
        .setColor(config.Success)
        .setAuthor({ name: `${client.user.username} Information`, iconURL: client.user.displayAvatarURL()})
        .setThumbnail(client.user.displayAvatarURL())
        .addFields([
            {
                name: "__General Informations__", 
                value: `**Server Count:** ${client.guilds.cache.size}
**Users:** ${count}
**Commands:** ${client.commands.size}
**Verison:** 2.4.6
**Shards:** ${client.shard.count}  (Current: #${message.guild.shard.id} Shard)
**Total Channels:** ${client.channels.cache.size}
**Online Since:** ${prettyMilliseconds(client.uptime, {verbose: true})} `
            }
        ])
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})


        let embed1 = new EmbedBuilder()
        .setColor(config.Success)
        .setAuthor({ name: `${client.user.username} Information`, iconURL: client.user.displayAvatarURL()})
        .setThumbnail(client.user.displayAvatarURL())
        .addFields([
            {
                name: "__Developers__", 
                value: `[\`1\`] <:offline:1134387574039908433> [seek.0](https://discord.com/users/847770840266833961)`
            }
        ])
        .addFields([
            {
                name: "__Core Team__", 
                value: `[\`1\`] <:offline:1134387574039908433> [notsikey](https://discord.com/users/322457387141300234)`
            }
        ])
        .addFields([
            {
                name: "__Contributors__", 
                value: `[\`1\`] <:offline:1134387574039908433> [yaho.](https://discord.gg/users/815875674711523438)`
            }
        ])
        
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})


        let embed2 = new EmbedBuilder()
        .setColor(config.Success)
        .setAuthor({ name: `${client.user.username} Information`, iconURL: client.user.displayAvatarURL()})
        .setThumbnail(client.user.displayAvatarURL())
        .addFields([
            {
                name: "__System Informations__", 
                value: `**System Latency:** ${client.ws.ping}ms
**Platform:** ${os.platform()}
**Architecture:** x64
**Memory Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB/${(
    os.totalmem() /
    1024 /
    1024 /
    1024
    ).toFixed(2)}GB
**CPU Usage:** ${percentageCpu}%
**Processor 1:**
> **Discord.js:** ${version}
> **Node.js:** ${process.version}
> **Model:** ${os.cpus().map((i) => `${i.model}`)[0]}`
            }
        ])
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})





        const but1 = new ButtonBuilder().setCustomId("button1").setLabel('Team Info').setStyle(ButtonStyle.Secondary);
        const but2 = new ButtonBuilder().setCustomId("button2").setLabel('General Info').setStyle(ButtonStyle.Secondary).setDisabled(true);
        const but3 = new ButtonBuilder().setCustomId("button3").setLabel('System Info').setStyle(ButtonStyle.Secondary);

        const but4 = new ButtonBuilder().setCustomId("button1").setLabel('Team Info').setStyle(ButtonStyle.Secondary).setDisabled(true);
        const but5 = new ButtonBuilder().setCustomId("button2").setLabel('General Info').setStyle(ButtonStyle.Secondary);
        const but6 = new ButtonBuilder().setCustomId("button3").setLabel('System Info').setStyle(ButtonStyle.Secondary);

        const but7 = new ButtonBuilder().setCustomId("button1").setLabel('Team Info').setStyle(ButtonStyle.Secondary);
        const but8 = new ButtonBuilder().setCustomId("button2").setLabel('General Info').setStyle(ButtonStyle.Secondary);
        const but9 = new ButtonBuilder().setCustomId("button3").setLabel('System Info').setStyle(ButtonStyle.Secondary).setDisabled(true);
         
        const button = new ActionRowBuilder().addComponents(but1, but2, but3);
        const button01 = new ActionRowBuilder().addComponents(but4, but5, but6);
        const button02 = new ActionRowBuilder().addComponents(but7, but8, but9);

        const Message = await message.reply({ embeds: [embed], components: [button], fetchReplay: true })


        const collector = Message.createMessageComponentCollector({
            filter: (b) => {
                if(b.user.id === message.author.id) return true;
                 else {
               b.reply({ ephemeral: true, content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`}); return false;
                     };
                },
                time : 300000,
                idle: 300000/2

              });


              collector.on("collect", async (cld) => {
                if(cld.customId === "button1"){
                  cld.update({ embeds: [embed1], components: [button01]})
                }

                if(cld.customId === "button2"){
                  cld.update({ embeds: [embed], components: [button]})
                }

                if(cld.customId === "button3"){
                  cld.update({ embeds: [embed2], components: [button02]})
                }
            })

    }
}