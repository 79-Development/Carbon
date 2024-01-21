const mongoose = require('mongoose');
const config = require('../config.json');

async function connect() {
    if(!config.DB){
        console.warn(`[DATABASE] For database access, MongoDB URI, is required in .env file.`)
        return
    }
    mongoose.connect(config.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(e => console.log('No Database added'));

    mongoose.connection.once("open", () => {
        console.log('[DATABASE] Connected To Database')
        console.log("----------------------------------------".white);
    })
    return;
}

module.exports = connect;