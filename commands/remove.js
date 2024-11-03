const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const userStats = require("../models/user-stats.js");
const updateLB = require("../util/updateLB.js")

module.exports = {
    description: "Allows mods to remove stats that aren't real",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    
    type: "SLASH",
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "The user whose stats you want to remove",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    callback: async ({ interaction, guild }) => {
        const user = interaction.options.getUser("user", true)

        // If exists in the database remove them and update the LB

        if (userStats.findById(`${member.guild.id}-${member.id}`)) {
            await userStats.findByIdAndDelete(`${member.guild.id}-${member.id}`)

            updateLB()

            return `Removed ${user.username} from the database`
        } else {
            return `${user.username} isn't in the database`
        }
    }
}