const userStats = require("../../models/user-stats")

module.exports = async (member) => {
    // Delete the member from the database if they leave the server

    await userStats.findByIdAndDelete(`${member.guild.id}-${member.id}`)
}