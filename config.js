// config.js : sets the default bot configuration

// sets the required dependencies
const { GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');

// default configuration for the bot
const config = {
    bot: {
        name: "AyHa1810Bot",
        version: "0.1-alpha"
    },

    // array of user IDs that sets the user as the bot admin
    admins: [],
    // array of user IDs that sets the user as the bot support staff
    support: [],

    //idk lol
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel],

    // default settings for the bot
    defaultSettings: {
        prefix: '.dev ',
        systemNotice: 'true',
        commandReply: 'true',
        welcomeMessage: [
            '{{user}} has joined this server! Welcome!',
            'Say hello to our new member {{user}}!',
            '{{user}} just hopped into our server!'
        ],
        welcomeEnabled: 'false',
        NSFWEnabled: 'false'
    },

    // Permission Levelling System
    // It is a useful system that categorises the bot users into levels depending on
    // which permissions they have or user type. You can use this to limit which command users can use
    permLevels: [
        {
            level: 0,
            name: 'User',
            check: () => true,
            exception: []
        },

        {
            level: 2,
            name: 'Moderator',
            check: message => {
                try {
                    const perms = [
                        PermissionsBitField.Flags.ManageRoles,
                        PermissionsBitField.Flags.ManageNicknames,
                        PermissionsBitField.Flags.ManageChannels,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.ManageThreads,
                        PermissionsBitField.Flags.MuteMembers,
                        PermissionsBitField.Flags.KickMembers,
                        PermissionsBitField.Flags.BanMembers,
                        PermissionsBitField.Flags.ReadMessages,
                        PermissionsBitField.Flags.SendMessages
                    ];
                    if (
                        message.member.permissions.has(perms) &&
                        message.member.permissions.has(PermissionsBitField.Flags.Administrator)
                    )
                        return true;
                } catch (e) {
                    return false;
                }
            },
            exception: []
        },

        {
            level: 3,
            name: 'Administrator',
            check: message => {
                try {
                    const perms = [PermissionsBitField.Flags.Administrator];
                    if (message.member.permission.has(perms)) return true;
                } catch (e) {
                    return false;
                }
            },
            exception: []
        },

        {
            level: 4,
            name: 'Server Owner',
            check: message => {
                const serverOwner = message.author ?? message.author;
                return message.guild?.ownerId === serverOwner.id;
            },
            exception: []
        },

        {
            level: 8,
            name: 'Bot Support',
            check: message => {
                const botSupport = message.author ?? message.user;
                return config.support.includes(botSupport.id);
            },
            exception: []
        },

        {
            level: 9,
            name: 'Bot Admin',
            check: message => {
                const botAdmin = message.author ?? message.user;
                return config.admins.includes(botAdmin.id);
            },
            exception: []
        },

        {
            level: 10,
            name: 'Bot Owner',
            check: message => {
                const owner = message.author ?? message.user;
                return owner.id === process.env.owner;
            },
            exception: []
        }
    ]
};

// exports functions and variables from this file as a module to use anywhere in the client
module.exports = config;
