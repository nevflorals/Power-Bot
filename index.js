const { Client, IntentsBitField } = require('discord.js')
const WOK = require('wokcommands')
const { join } = require('path')
const { default: mongoose } = require('mongoose')
const updateLB = require('./util/updateLB.js')
require('dotenv/config')

// Create new discord client
const client = new Client({
    "intents": [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers
    ],
})

client.once('ready', async () => {
    console.log("Bot is now online") // Log that the bot is online

    mongoose.connect(process.env.MONGO_URI)

    // Initialize Command Handler
    new WOK({
        client,

        botOwners: ["512753044190920711"],
        testServers: ["1295033956273754262"],
        
        commandsDir: join(__dirname, "commands"),
        featuresDir: join(__dirname, "features"),
        events: {
            dir: join(__dirname, 'events'),
            interactionCreate: {
                isButton: (interaction) => interaction.isButton(),
            }
        },

        mongoUri: process.env.MONGO_URI,

        disabledDefaultCommands: [
            WOK.DefaultCommands.ChannelCommand,
            WOK.DefaultCommands.CustomCommand,
            WOK.DefaultCommands.Prefix,
            WOK.DefaultCommands.RequiredPermissions,
            WOK.DefaultCommands.RequiredRoles,
            WOK.DefaultCommands.ToggleCommand
        ],
    })
})

// Login to the client
client.login(process.env.TOKEN)