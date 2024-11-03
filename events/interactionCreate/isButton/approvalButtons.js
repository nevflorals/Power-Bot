const { EmbedBuilder } = require("discord.js")
const updateLB = require("../../../util/updateLB.js")
const userStats = require("../../../models/user-stats.js")

module.exports = async (interaction, instance) => {
    const { customId, member, guild,  } = interaction

    if(customId.endsWith("approve")) {
        const id = customId.split("-")[0]

        if (!id) return "An error occurred"

        const user = await guild.members.fetch(id)
        if (!user) {
            try {
                interaction.message.delete()
            } catch (err) {

            }

            return "That user is not longer in the server"
        }

        const message = await interaction.message.fetch()
        if (!message) return "An error occorred"

        const fields = message.embeds[0].fields.reduce((acc, field) => {
            acc[field.name.toLowerCase().replace(' ', '_')] = field.value;
            return acc;
        }, {});

        await userStats.findByIdAndUpdate(`${interaction.guild.id}-${id}`, fields, {
            new: true,
            upsert: true
        })

        const updatedEmbed = EmbedBuilder.from(message.embeds[0])
        .setColor('Green')
        .setFooter({ text: `Status: Approved` });

        await interaction.message.edit({
            embeds: [updatedEmbed],
            components: []
        })

        interaction.reply({
            content: "Stats have been approved",
            ephemeral: true
        })
    } else if (customId.endsWith("decline")) {
        const message = await interaction.message.fetch()
        if (!message) return "An error occorred"
        
        const updatedEmbed = EmbedBuilder.from(message.embeds[0])
        .setColor('Red')
        .setFooter({ text: `Status: Declined` });

        await interaction.message.edit({
            embeds: [updatedEmbed],
            components: []
        })

        interaction.reply({
            content: "Stats have been declined",
            ephemeral: true
        })
    }

    updateLB(instance.client, guild.id)
}