const { Collection, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const client = require('../../index.js');
const db = require('../../Schema/Prefix.js');
const config = require('../../config.json');
const prettyMilliseconds = require('pretty-ms');
let User = require("../../Schema/User.js");
const cooldowns = new Map()

client.on('messageCreate', async message => {

  if(!message.guild || message.author.bot) return;

  //PREFIX SYSTEM
  let px;
  const data = await db.findOne({ Guild: message.guild.id });
  if (!data || !data.Prefix) {
    px = config.PREFIX;
  } else {
    px = data.Prefix;
  } 

  const mentionRegex = new RegExp(`^<@!?${client.user.id}>`);
  const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

  const but1 = new ButtonBuilder().setURL(config.inviteURL).setLabel('Invite').setStyle(ButtonStyle.Link);
  const but2 = new ButtonBuilder().setURL(config.supportURL).setLabel('Support Server').setStyle(ButtonStyle.Link);

  const button = new ActionRowBuilder().addComponents(but1, but2);

    if (message.content.match(mention)) {
      await message.channel.send({
        content: `My prefix for this Server is \`${px}\``,
        components: [button]
      })
    };

    let user = await User.findOne({ userId: message.author.id }) || await User.create({userId : message.author.id});

    if (user.noprefix) {
    if (user.userId == message.author.id && !message.content.startsWith(px)) px = "";
    }

  const prefix = message.content.match(mentionRegex) ? message.content.match(mentionRegex)[0] : px;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
 
  if(message.content.startsWith(prefix)){
    //console.log(prefix)
        if(!message.member) message.member = await message.guild.members.fetch(message.author.id);
        const cmd = args.shift()?.toLowerCase();
        if(cmd.length == 0 ) return;
        
        let command = client.commands.get(cmd)
        
        if(!command) command = client.commands.get(client.aliases.get(cmd));
        
        if (command) {
            //COOLDOWN HANDLER
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }
            const current_time = Date.now();
            const time_stamps = cooldowns.get(command.name);
            const cooldown_amount = (command.cooldown) * 1000;

            //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
            if (time_stamps.has(message.author.id)) {
                const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

                if (current_time < expiration_time) {
                    const time_left = (expiration_time - current_time);

                    return message.channel.send({ 

                      content: `You are being ratelimited. Please wait ${prettyMilliseconds(time_left)} before using this command again.`
                     
                    }).then(msg => setTimeout(() => { msg.delete().catch(e => null) }, time_left));
                }
              }
              //If the author's id is not in time_stamps then add them with the current time.
              time_stamps.set(message.author.id, current_time);
              //Delete the user's id once the cooldown is over.
              setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

              //OWNERONLY HANDLER
              if (command.owner && command.owner == true) {
                if (!config.OWNER) return;
                const allowedUsers = [];
          
                config.OWNER.forEach(user => {
                  const fetchOwner = message.guild.members.cache.get(user);
                  if (!fetchOwner) return allowedUsers.push(`**[Unknown#0000]**`)
                  allowedUsers.push(`${fetchOwner.user.tag}`);
                });
          
                if (!config.OWNER.some(ID => message.member.id.includes(ID))) return;
                }

                //USERPERMISSION HANDLER
                if (command.userPermissions) {

                    if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPermissions || []))) return message.channel.send({

                      content: `<:cross:1114823672163729490> | You Are Missing The Following Permissions:\`${command.userPermissions || []}\``

                    }).then(msg => setTimeout(() => { msg.delete().catch(e => null) }, 5000));
                  }

                  //BOTPERMISSION HANDLER
                  if (command.botPermissions) {
        
                    if (!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.resolve(command.botPermissions || []))) return message.channel.send({
                      
                      content: `<:cross:1114823672163729490> | I am missing \`${command.botPermissions || []}\` permission to execute the provided task!`

                    }).then(msg => setTimeout(() => { msg.delete().catch(e => null) }, 5000));
                  }
                  
                  //DM PERMISSION HANDLER
                  if(!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.SendMessages)){
                    message.author.send(`<:cross:1114823672163729490> | I don't have \`SendMassge\` Permission in that Channel.`).catch(()=> null);
                    return;
                  }
                  if(!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.EmbedLinks)){
                    message.author.send(`<:cross:1114823672163729490> | I don't have \`EmbedLinks\` Permission in that Channel.`).catch(()=> null);
                    return;
                  }
                  if(!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.UseExternalEmojis)){
                    message.author.send(`<:cross:1114823672163729490> | I don't have \`UseExternalEmojis\` Permission in that Channel.`).catch(()=> null);
                    return;
                  }
                  
            try {
                command.run(client, message, args);
            } catch (err) {
                console.log(err);
            }
        }
      }
});