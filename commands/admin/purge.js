// purge.js, purges the number of messages in any channel
const logger = require("../../modules/logger.js");
exports.run = async (client, message, args, level) => {
    const user = message.mentions.users.first();

    if (!/^\d+$/.test(args[0])) return message.reply('Please provide a valid number');
    // Check if the provided argument is completely a number. We run this because parseInt can parse numbers like this 564gb, leading to some undesirable results

    // Parse Amount
    const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])

    if (!amount) return message.reply("Must specify an amount to delete!");
    if (!amount && !user) return message.reply("Must specify a user and amount, or just an amount, of messages to purge!");
    // Fetch 100 messages (will be filtered and lowered up to max amount requested)
    message.channel.messages.fetch({
        limit: 100,
    }).then((messages) => {
        if (user) {
            const filterBy = user ? user.id : client.user.id;
            messages = messages.filter(m => m.author.id === filterBy);
        }
        messages = Array.from(messages.values())
        message.channel.bulkDelete(messages.slice(0, amount)).catch(error => logger.error(error.stack));
    });
};

// command's default config
exports.conf = {
    enabled: true,
    guildOnly: true,
    cooldown: "5 sec",
    aliases: ["purge"],
    permLevel: "Moderator"
};

// command's help texts
exports.help = {
    name: "purge",
    category: "Admin",
    description: "Purges the number of messages by given amount in any channel.",
    usage: `purge <amount> [mention]`
};
