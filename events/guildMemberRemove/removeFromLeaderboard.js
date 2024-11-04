const userStats = require("../../models/user-stats.js")
const updateLB = require("../../util/updateLB.js")

module.exports = async (member, instance) => {
    // Delete the member from the database if they leave the server

    await userStats.findByIdAndDelete(`${member.guild.id}-${member.id}`)

    updateLB(instance.client, member.guild.id)
}