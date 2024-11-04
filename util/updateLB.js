const { EmbedBuilder } = require("discord.js");
const guildSettings = require("../models/guild-settings");
const userStats = require("../models/user-stats");

const suffixMap = {
    "k": BigInt(1e3),    // Thousand (1,000)
    "m": BigInt(1e6),    // Million (1,000,000)
    "b": BigInt(1e9),    // Billion (1,000,000,000)
    "t": BigInt(1e12),   // Trillion (1,000,000,000,000)
    "qa": BigInt(1e15),  // Quadrillion (1,000,000,000,000,000)
    "qi": BigInt(1e18),  // Quintillion (1,000,000,000,000,000,000)
    "sx": BigInt(1e21),  // Sextillion (1,000,000,000,000,000,000,000)
    "sp": BigInt(1e24),  // Septillion (1,000,000,000,000,000,000,000,000)
    "oc": BigInt(1e27),  // Octillion (1,000,000,000,000,000,000,000,000,000)
    "no": BigInt(1e30),  // Nonillion (1,000,000,000,000,000,000,000,000,000,000)
    "dc": BigInt(1e33),  // Decillion (1,000,000,000,000,000,000,000,000,000,000,000)
    "ud": BigInt(1e36),  // Undecillion (1,000,000,000,000,000,000,000,000,000,000,000,000)
    "dd": BigInt(1e39),  // Dodacillion (1,000,000,000,000,000,000,000,000,000,000,000,000)
    "td": BigInt(1e42),  // Tredecillion (1,000,000,000,000,000,000,000,000,000,000,000,000)
    "qad": BigInt(1e45), // Quattuordecillion (1,000,000,000,000,000,000,000,000,000,000,000,000,000)
    "qid": BigInt(1e48), // Quindecillion (1,000,000,000,000,000,000,000,000,000,000,000,000,000,000)
    "sxd": BigInt(1e51), // Sexdecillion (1,000,000,000,000,000,000,000,000,000,000,000,000,000,000)
    "spd": BigInt(1e54), // Septendecillion (1,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000)
};

const propertyTitles = {
    fist_strength: "Fist Strength",
    body_toughness: "Body Toughness",
    movement_speed: "Movement Speed",
    jump_force: "Jump Force",
    psychic_power: "Psychic Power"
}

const colors = {
    fist_strength: "Red",
    body_toughness: "Orange",
    movement_speed: "Green",
    jump_force: "Yellow",
    psychic_power: "Blue"
}

function extractValueWithSuffix(value) {
    const match = value.match(/^(\d*\.?\d+)([a-zA-Z]+)?$/);
    if (match) {
        const numberPart = BigInt(Math.floor(parseFloat(match[1])));
        const suffixPart = match[2] || '';
        const suffixValue = suffixMap[suffixPart.toLowerCase()] || BigInt(1);
        return {
            bigIntValue: numberPart * suffixValue, // Store BigInt value
            originalValue: value // Store original string value
        };
    }
    return { bigIntValue: BigInt(0), originalValue: value }; // Return original value for invalid input
}

async function leaderboards(client, guildId) {
    const leaderboard = { fist_strength: [], body_toughness: [], movement_speed: [], jump_force: [], psychic_power: [] }

    const settings = await guildSettings.findById(guildId)
    if (!settings) return

    const stats = await userStats.find({ _id: { $regex: `^${guildId}-` } });

    stats.forEach(result => {
        const [_, id] = result._id.split("-")

        for (const property of Object.keys(leaderboard)) {
            const { bigIntValue, originalValue } = extractValueWithSuffix(result[property])

            leaderboard[property].push({ id: id, value: bigIntValue, originalValue })
        }
    })

    for (const property of Object.keys(leaderboard)) {
        leaderboard[property].sort((a, b) => {
            if (b.value > a.value) return 1
            if (b.value < a.value) return -1
            return 0;
        })

        leaderboard[property] = leaderboard[property].slice(0, 5)
    }

    const embeds = []

    for (const property in leaderboard) {
        const embed = new EmbedBuilder()
            .setColor(colors[property])
            .setTitle(`${propertyTitles[property]} Leaderboard`)

        const entries = leaderboard[property].map((entry, index) => `**${index + 1}.** <@${entry.id}> - **${entry.originalValue}**`).join('\n')

        embed.setDescription(entries || 'No entries available.')

        embeds.push(embed)
    }

    const channel = await client.channels.fetch(settings.lbChannel)
    if (!channel) return

    if (!settings.messageId) {
        const message = await channel.send({
            embeds: embeds
        })

        await guildSettings.findByIdAndUpdate(guildId, {
            messageId: message.id
        })
    } else {
        let message = await channel.messages.fetch(settings.messageId)

        if (!message) {
            try {
                message = await channel.send({
                    embeds: embeds
                })
            } catch (error) {
                
            }

            if(!message) return

            await guildSettings.findByIdAndUpdate(guildId, {
                messageId: message.id
            })

            return
        }

        message.edit({
            embeds: embeds
        })
    }
}

module.exports = leaderboards