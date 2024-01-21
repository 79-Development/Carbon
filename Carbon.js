const { ShardingManager } = require('discord.js');
const config = require('./config.json');
require('dotenv').config();

let manager = new ShardingManager('./index.js', {
    token: config.TOKEN
});

manager.on('shardCreate', shard => {
    console.log(`[SHARD MANAGER]: Launched shard #${shard.id}`);
});

manager.spawn({timeout: -1});