const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const config = require('./config.json');
const { Database } = require("quickmongo");
const fs = require('fs');
const OS = require('os');
const Events = require('events');   
require('colors');

// Initialzing Client   
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ],
    presence: {
        activities: [{name: `.help`, type: 2}],
        status: "online" //online/idle/dnd
    },
    allowedMentions:{
        repliedUser: false,
        parse: ['users','roles','everyone']
    }
});

// Increasing Event Listener Size
client.setMaxListeners(0);
Events.defaultMaxListeners = 0;
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;

module.exports = client;
    client.afk = new Collection();
    client.slashCommands = new Collection();
    client.commands = new Collection();
    client.aliases = new Collection();
    client.categories = fs.readdirSync("./Commands/");
    client.context = new Collection();
    client.events = new Collection(); 
    client.db = new Database(config.DB);
    client.db.connect();
    
    //CONNECT TO DATABASE
    (async () => {
        await require("./Database/connect")();
    })();

  
    
    //connecting handlers
    ["command", "event"].forEach(handler => {
        require(`./handlers/bot/${handler}`)(client);
    });

    


// Crash - Prevention
process.on('unhandledRejection', (err, cause) => {
    //console.log(`[Uncaught Exception]: ${err}`.bold.brightGreen);
    client.webhook?.send({embeds: [
        new EmbedBuilder()
        .setAuthor({name: `Unhandled Rejection`})
        .setDescription(`\`\`\`js\n${err.message}\n\`\`\`\n**Stack**\n\`\`\`\n${err.stack}\n\`\`\``)
    ]}).catch(e => {});
});

process.on('uncaughtException', err => {
    // console.log(`[Uncaught Exception] ${err.message}`.bold.brightGreen);
    client.webhook?.send({embeds: [
        new EmbedBuilder()
        .setAuthor({name: `Unhandled Rejection`})
        .setDescription(`\`\`\`js\n${err.message}\n\`\`\`\n**Stack**\n\`\`\`\n${err.stack}\n\`\`\``)
    ]}).catch(e => {});
});

console.log()


// Logging in Discord
client.login(config.TOKEN)
.catch(e => console.log(`[DISCORD API] ${e}`.red))
