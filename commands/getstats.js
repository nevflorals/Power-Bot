const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const userStats = require("../models/user-stats");

module.exports = {
    description: "View a users stats",
    
    type: "SLASH",

    options: [
        {
            name: "user",
            description: "The user whose stats you want to get",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    callback: async ({ interaction, guild }) => {
        const user = interaction.options.getUser("user", true)

        // Get the users stats for that server

        const data = await userStats.findById(`${guild.id}-${user.id}`)

        if (data) {

            // Display them in an embed
            
            const embed = new EmbedBuilder()
            .setTitle(`${user.displayName}'s Stats`)
            .setThumbnail(user.avatarURL())
            .setColor("Random")
            .setFields([
                {name: "Fist Strength", value: data.fist_strength},
                {name: "Body Toughness", value: data.body_toughness},
                {name: "Movement Speed", value: data.movement_speed},
                {name: "Jump Force", value: data.jump_force},
                {name: "Psychic Power", value: data.psychic_power}
            ])
            .setFooter({
                text: "Made by Nevflorals"
            })

            return {
                embeds: [embed]
            }
        } else {
            return `${user.username} hasn't inputted any stats`
        }
    }
}