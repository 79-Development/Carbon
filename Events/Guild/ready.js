const client = require('../../index.js');

client.once('ready', async client => {

    await client.db.connect();
    console.log(`[READY] ${client.user.tag} is up and ready to go.`.bold)
    console.log("----------------------------------------".white);

    client.webhook = await client.fetchWebhook('1134333630961963108', 'm8GovjBDMS57Kc8DZ9Vopkex6VDIml_FJ1qLZEvElhpyLbe2oLnefO0p193U2E3h1Xfl');
    
});