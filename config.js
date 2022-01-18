const { Intents } = require('discord.js');

const config = {
	admins: [],
	support: [],

	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES
	],
	partials: ['CHANNEL'],

	defaultSettings: {
		prefix: 'ok',
		systemNotice: 'true',
		commandReply: 'true',
		welcomeMessage: [
			'{{user}} has joined this server! Welcome!',
			'Say hello to our new member {{user}}!',
      '{{user}} just hopped into our server!'		],
		welcomeEnabled: 'false',
		NSFWEnabled: 'false'
	},

	permLevels: [
		{
			level: 0,
			name: 'User',
			check: () => true
		},

		{
			level: 2,
			name: 'Moderator',
			check: message => {
				try {
					const perms = [
						'MANAGE_ROLES',
						'MANAGE_NICKNAMES',
						'MANAGE_CHANNELS',
						'MANAGE_MESSAGES',
						'MANAGE_THREADS',
						'MUTE_MEMBERS',
						'KICK_MEMBERS',
						'BAN_MEMBERS',
						'READ_MESSAGES',
						'SEND_MESSAGES'
					];
					if (
						message.member.permission.has(perms) &&
						message.member.permission.has('ADMINISTRATOR')
					)
						return true;
				} catch (e) {
					return false;
				}
			}
		},

		{
			level: 3,
			name: 'Administrator',
			check: message => {
				try {
					const perms = ['ADMINISTRATOR'];
					if (message.member.permission.has(perms)) return true;
				} catch (e) {
					return false;
				}
			}
		},

		{
			level: 4,
			name: 'Server Owner',
			check: message => {
				const serverOwner = message.author ?? message.user;
				return message.guild?.ownerId === serverOwner.id;
			}
		},

		{
			level: 8,
			name: 'Bot Support',
			check: message => {
				const botSupport = message.author ?? message.user;
				return config.support.includes(botSupport.id);
			}
		},

		{
			level: 9,
			name: 'Bot Admin',
			check: message => {
				const botAdmin = message.author ?? message.user;
				return config.admins.includes(botAdmin.id);
			}
		},

		{
			level: 10,
			name: 'Bot Owner',
			check: message => {
				const owner = message.author ?? message.user;
				return owner.id === process.env.owner;
			}
		}
	]
};

module.exports = config;
