const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const guildSettings = require("../models/guild-settings.js");
const { CooldownTypes } = require("wokcommands");

module.exports = {
    description: "Sets the channel where the leaderboard is sent",

    type: "SLASH",
    guildOnly: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],

    options: [
        {
            name: "lb-channel",
            description: "The channel to set for leaderboards",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "approve-channel",
            description: "The channel to set for approvals",
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    callback: async ({ interaction }) => {
        const LBChannel = interaction.options.getChannel("lb-channel", true)
        const approveChannel = interaction.options.getChannel("approve-channel", true)

        // Update the database

        await guildSettings.findByIdAndUpdate(interaction.guild.id, {
            lbChannel: LBChannel.id,
            approveChannel: approveChannel.id,
        }, {
            new: true,
            upsert: true
        }).catch(error => {
            console.log(error)
            return "An error occurred, Please try again later"
        })

        return "Config has been updated"
    }
}