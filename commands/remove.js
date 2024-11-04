const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const userStats = require("../models/user-stats.js");
const updateLB = require("../util/updateLB.js")

module.exports = {
    description: "Allows mods to remove stats that aren't real",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    
    type: "SLASH",
    guildOnly: true,
    deferReply: "ephemeral",

    options: [
        {
            name: "user",
            description: "The user whose stats you want to remove",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    callback: async ({ interaction, guild, client }) => {
        const user = interaction.options.getUser("user", true)

        // If exists in the database remove them and update the LB

        const stats = await userStats.findById(`${guild.id}-${user.id}`)

        if (stats) {
            await userStats.findByIdAndDelete(`${guild.id}-${user.id}`)

            updateLB(client, guild.id)

            return `Removed ${user.username} from the database`
        } else {
            return `${user.username} isn't in the database`
        }
    }
}