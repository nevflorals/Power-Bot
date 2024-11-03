const userStats = require("../../models/user-stats")

module.exports = async (member) => {
    await userStats.findByIdAndDelete(`${member.guild.id}-${member.id}`)
}