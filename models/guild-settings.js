const { Schema, models, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const guildSettingsSchema = new Schema({
    _id: reqString, // Guild ID
    lbChannel: reqString, // Leaderboard channel ID
    approveChannel: reqString, // Approve channel ID

    messageId: { // The leaderboard message ID
        type: String
    },
})

module.exports = models["guild-settings"] || model("guild-settings", guildSettingsSchema)