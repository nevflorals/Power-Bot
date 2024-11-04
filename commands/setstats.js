const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const isValidStat = require("../util/isValidStat.js")
const guildSettings = require("../models/guild-settings.js")
const { omitUndefined } = require("mongoose")

module.exports = {
    description: "Sets your stats for the leaderboard",

    type: "SLASH",
    guildOnly: true,
    
    cooldowns: {
        type: "perUser",
        duration: 30
    },

    options: [
        {
            name: "fist-strength",
            description: "Your amount of Fist Strength. Example: 29.3Sx",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "body-toughness",
            description: "Your amount of Body Toughness. Example: 29.3Sx",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "movement-speed",
            description: "Your amount of Movement Speed. Example: 29.3Sx",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "jump-force",
            description: "Your amount of Jump Force. Example: 29.3Sx",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "psychic-power",
            description: "Your amount of Psychic Power. Example: 29.3Sx",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "screenshot",
            description: "Attach a screenshot for approval",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        }
    ],

    callback: async ({ interaction, guild, client }) => {
        const fist = interaction.options.getString("fist-strength", true)
        const body = interaction.options.getString("body-toughness", true)
        const move = interaction.options.getString("movement-speed", true)
        const jump = interaction.options.getString("jump-force", true)
        const psychic = interaction.options.getString("psychic-power", true)
        const screenshot = interaction.options.getAttachment("screenshot", true)

        // Check if all values are valid numbers

        if(!isValidStat(fist)) return "Your Fist Strength is not a valid number"
        if(!isValidStat(body)) return "Your Body Toughness is not a valid number"
        if(!isValidStat(move)) return "Your Movement Speed is not a valid number"
        if(!isValidStat(jump)) return "Your Jump Force is not a valid number"
        if(!isValidStat(psychic)) return "Your Psychic Power is not a valid number"

        // Check if attachment is an image

        const validImageTypes = ["image/png", "image/jpeg", "image/webp"];
        
        if (!validImageTypes.includes(screenshot.contentType)) {
            return interaction.reply("The uploaded file must be a valid image format (PNG, JPEG, WebP).");
        }

        // See if guildSettings are configured

        const settings = await guildSettings.findById(guild.id)
        if (!settings) return "This server hasn't setup guild settings yet"

        // Get approval channel

        const channel = await client.channels.fetch(settings.approveChannel)
        if(!channel) return "This server hasn't setup guild settings yet"

        // Create approval embed to send to channel

        const embed = new EmbedBuilder()
        .setTitle(`Stats Approval for ${interaction.user.displayName}`)
        .setColor("Yellow")
        .setFields([
            {name: "Fist Strength", value: fist},
            {name: "Body Toughness", value: body},
            {name: "Movement Speed", value: move},
            {name: "Jump Force", value: jump},
            {name: "Psychic Power", value: psychic}
        ])
        .setImage(screenshot.url)
        .setFooter({
            text: "Status: Awaiting approval"
        })

        const approveButton = new ButtonBuilder()
            .setCustomId(`${interaction.user.id}-approve`)
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success)

        const declineButton = new ButtonBuilder()
            .setCustomId(`${interaction.user.id}-decline`)
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(approveButton, declineButton)

        await channel.send({
            embeds: [embed],
            components: [row]
        })

        return "Your stats have been sent for approval!"
    }
}