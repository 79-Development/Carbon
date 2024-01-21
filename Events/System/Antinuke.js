const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
const config = require('../../config.json')
const client = require('../../index');

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isModalSubmit()) return;
    let duration = interaction.fields.getTextInputValue('duration')

    const but1 = new ButtonBuilder().setCustomId("button1").setLabel('Timeout').setStyle(ButtonStyle.Success).setDisabled(true);
    const but2 = new ButtonBuilder().setCustomId("button2").setLabel('Ban').setStyle(ButtonStyle.Secondary).setDisabled(true);
    const but3 = new ButtonBuilder().setCustomId("button3").setLabel('Kick').setStyle(ButtonStyle.Secondary).setDisabled(true);
    const but4 = new ButtonBuilder().setCustomId("button4").setLabel('RemoveRoles').setStyle(ButtonStyle.Secondary).setDisabled(true);

    const but01 = new ButtonBuilder().setCustomId("button9").setEmoji('<:discotoolsxyzicon4:1128592521589690429>').setLabel('Back').setStyle(ButtonStyle.Danger);
    const but02 = new ButtonBuilder().setCustomId("button10").setEmoji('<:discotoolsxyzicon3:1128592544310251591>').setLabel('Next').setStyle(ButtonStyle.Success);

    const butt = new ActionRowBuilder().addComponents(but1, but2, but3, but4);
    const button3 = new ActionRowBuilder().addComponents(but01, but02);

    let emb = new EmbedBuilder()
    .setColor(config.Success)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
    .setDescription(`Punishment has been set to **timeout**.`)
    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
    .setTimestamp()

    interaction.update({ embeds: [emb], components: [butt, button3]})

    let muteTime = 60;
        let maxMuteTime = 2332800000;
        let timeArg = duration;
        if (!timeArg) timeArg = "600";
        else if (timeArg.includes("s")) timeArg = timeArg.replace("s", "");
        else if (timeArg.includes("m")) timeArg = timeArg.replace("m", "") * 60;
        else if (timeArg.includes("h")) timeArg = timeArg.replace("h", "") * 60 * 60;
        else if (timeArg.includes("d")) timeArg = timeArg.replace("d", "") * 60 * 60 * 24;
        muteTime = timeArg * 1000;

        muteTime = muteTime;
        if (muteTime > maxMuteTime) {
            muteTime = maxMuteTime;
            displayMuteTime = maxMuteTime;
        }

    client.db.set(`${interaction.guild.id}_punishment`, `timeout`)
    client.db.set(`${interaction.guild.id}_timeout`, { time: [muteTime] })
});