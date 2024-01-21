const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'roleinfo',
    aliases: ['ri'],
    description: 'Shows you all information about a role.',
    category: 'Utility',
    usage: 'roleinfo <role>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    run: async (client, message, args) => {

        if (!args[0]) {
            return message.reply('Please Provide A Role.')
        }

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!role) {
            return message.reply('Please Provide A Valid Role.')
        }

        let icon = message.guild.iconURL({ dynamic: true }) || null  

        if (role.icon) {
            ic = `[Click Here](https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.png)`
        } else {
            ic = `No icon`
        }

        await message.guild.members.fetch()

        let rolemembers;
        if(role.members.size > 20) rolemembers = role.members.map(e => `<@${e.id}>`).slice(0,20).join(", ") + ` and ${role.members.size - 20} more members...`
        if(role.members.size < 20) rolemembers = role.members.map(e => `<@${e.id}>`).join(", ")

        function aaap(words) {
            var separateWord = words.toLowerCase().split(' ');
            for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
        separateWord[i].substring(1);
    }
     return separateWord.join(' ');
  }
        
        let ap = role.permissions.toArray().map(p => `${p}`).join(", ").toLowerCase()


        let embed = new EmbedBuilder()
        .setColor(role.hexColor)
        .setThumbnail(icon)
        .setAuthor({ name: `Role Information`, iconURL: icon})

        .addFields([
            { 
                name: "Name", 
                value: `${role.name}`,
                inline: true 
            },
            { 
                name: "Icon", 
                value: `${ic}`,
                inline: true 
            }
        ])

        .addFields([{ name: "ID", value: `${role.id}` }])

        .addFields([{ name: "Created At", value: `<t:${Math.floor(role.createdTimestamp / 1000)}:f> | <t:${Math.floor(role.createdTimestamp / 1000)}:R>` }])

        .addFields([{ name: "Hex Code", value: `${role.hexColor}` }])

        .setTimestamp()




        let embed1 = new EmbedBuilder()
        .setColor(role.hexColor)
        .setThumbnail(icon)
        .setAuthor({ name: `Role Information`, iconURL: icon})

        .setDescription(`**Role Posting**
${role.position}\n
**Allowed Permissions**
${aaap(ap).replace(/_/g, " ")}`)

        .setTimestamp()


        let embed2 = new EmbedBuilder()
        .setColor(role.hexColor)
        .setThumbnail(icon)
        .setAuthor({ name: `Role Information`, iconURL: icon})
        
        .setDescription(`**Role Members [ ${role.members.size} ]**\n${rolemembers || "No one is in this role.."}`)

        .setTimestamp()



        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("help-cmd")
			.setPlaceholder("Role Info Panel")
			.addOptions([
                {
                    label: 'Home',
                    emoji: '<:home:1120236497967263784>',
					value: `home`,
				},
                {
                    label: 'Permissons',
                    emoji: '<:security:1114819663998763048>',
					value: `permission`,
				},
				{
					label: 'Members',
                    emoji: '<:people:1117827191254827018>',
					value: `members`,
				}
			])
		)

        const Message = await message.channel.send({ embeds: [embed], components: [row]})

        
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
                let value = cld.values ? cld.values[0] : null;

                if(value === "home"){
                  cld.update({ embeds: [embed], components: [row]})
                }
                if(value === "permission"){
                    cld.update({ embeds: [embed1], components: [row]})
                }
                if(value === "members"){
                    cld.update({ embeds: [embed2], components: [row]})
                }
            })
        }
    }