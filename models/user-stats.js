const { Schema, models, model } = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const userStatsSchema = new Schema({
    _id: reqString, // User ID & Guild ID
    fist_strength: reqString, // Fist Strength
    body_toughness: reqString, // Body Toughness
    movement_speed: reqString, // Movement Speed
    jump_force: reqString, // Jump Force
    psychic_power: reqString, // Psychic Power
})

module.exports = models["user-stats"] || model("user-stats", userStatsSchema)