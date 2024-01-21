const mongoose = require('mongoose')
const User = mongoose.Schema({
   userId: String,
   noprefix: { type: Boolean, default: false },
   guildId: String,
   afk: {type: Array, default: []},

})

module.exports = mongoose.model("user", User)