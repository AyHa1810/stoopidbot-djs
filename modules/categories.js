// categories.js, this file stores data of command categories for the
// use in help menu and enabling/disabling commands by categories.
const categories = [
    {
        name: 'All',
        id: 0,
        enabled: true,
        permLevel: '',
        description: 'All commands of this bots.'
    },
    {
        name: 'General',
        id: 1,
        enabled: true,
        permLevel: '',
        description: 'General commands of this bot'
    },
    {
        name: 'Fun',
        id: 2,
        enabled: true,
        permLevel: '',
        description: 'funni commands to play around with.'
    },
    {
        name: 'Miscellaneous',
        id: 3,
        enabled: true,
        permLevel: '',
        description: 'Miscellaneous commandd.'
    },
    {
        name: 'NSFW',
        id: 4,
        enabled: false,
        permLevel: '',
        description: 'Not safe for work commands. Doesn\'t mean that you should use them at home either.'
    },
    {
        name: 'Admin',
        id: 5,
        enabled: true,
        permLevel: 'Administrator',
        description: 'Admin commands, don\'t abuse lol'
    }
],

modules.exports = categories;
