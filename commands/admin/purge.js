// purge.js, purges the number of messages in any channel
const { MessageType } = require("discord.js")
const logger = require("../../modules/logger.js");
exports.run = async (client, message, args, level) => {
    const user = message.mentions.users.first();

    if (!args[0] && message.type === MessageType.Reply) {
        let msg = await message.fetchReference();
        message.channel.send("\"" + msg.content + "\" holy shit this works too")
            .then(m => setTimeout(() => { m.delete() }, 2069));
        msg.delete();
        return message.delete()
    };

    if (!/^\d+$/.test(args[0])) return message.reply('Please provide a valid number');
    // Check if the provided argument is completely a number. We run this because parseInt can parse numbers like this 564gb, leading to some undesirable results

    // Parse Amount
    const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])

    if (!amount) return message.reply("Must specify an amount to delete!");
    if (!amount && !user) return message.reply("Must specify a user and amount, or just an amount, of messages to purge!");

    const delmsg = (amount) => {
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

    if (amount >= 10) {
        await message.channel.send("You sure you wanna delete more than 10 msgs? (type 'yes' to confirm)").then(msg => {
            const filter = m => {
                return m.author.id === message.author.id && m.reference.messageId === msg.id
            };
            message.channel.awaitMessages({
                filter: filter,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {
                msg = collected.first();
                if (msg.content.toLowerCase() == 'yes') {
                    delmsg(amount + 3)
                } else {
                    return message.channel.send(`Terminated`)
                }
            }).catch(collected => {
                return message.channel.send('Timeout')
            })
        })
    } else {
        delmsg(amount + 1)
    }
};

// command's default config
exports.conf = {
    enabled: true,
    guildOnly: true,
    cooldown: "5 sec",
    aliases: ["purge"],
    permLevel: "Moderator",
    perms: ["ManageMessages"]
};

// command's help texts
exports.help = {
    name: "purge",
    category: "Admin",
    description: "Purges the number of messages by given amount in any channel.",
    usage: `purge <amount> [mention]`
};
