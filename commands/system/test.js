// test.js, testing area
const logger = require("../../modules/logger.js");
exports.run = async (client, message, args, level) => {
    // Parse Amount
    const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])

    if (!amount) return message.reply("Must specify an amount");
   
    if (amount > 10) {
        await message.channel.send("reply test").then(msg => {
            const filter = m => {
                return m.author.id === message.author.id && m.reference.messageId === msg.id
            };
            message.channel.awaitMessages({
                filter: filter,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {
                console.log(collected)
                msg = collected.first();
                if (msg.content.toLowerCase() == 'yes') {
                    message.channel.send(`Worked`)
                } else {
                    return message.channel.send(`Terminated`)
                }
            }).catch(collected => {
                return message.channel.send('Timeout');
            })
        })
    }
    message.channel.send(`${amount}`)
}

// command's default config
exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "5 sec",
    aliases: [],
    permLevel: "Bot Owner"
};

// command's help texts
exports.help = {
    name: "test",
    category: "System",
    description: "Test command",
    usage: `test <required> [optional]`
};
