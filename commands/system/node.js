// test.js, testing area
const logger = require("../../modules/logger.js");
const { codeBlock } = require("@discordjs/builders");
const repl = require('node:repl');
const { PassThrough } = require('stream');

exports.run = async (client, message, args, level) => {
    const input = new PassThrough();
    const output = new PassThrough();
    const writer = (writer) => {
        return writer;
    };
    const session = repl.start({ prompt: '', input, output, writer });
    const listener = async (msg) => {
        if (
            msg.channel.id !== message.channel.id ||
            msg.author.bot ||
            msg.author.id === client.user.id ||
            msg.author.id !== message.author.id
            ) return;
        if (msg.content === "exit()") {
            session.close();
            client.off("messageCreate", listener);
            logger.log(`User ${message.author.id} has exitted Node session!`);
            return msg.channel.send("Exitted.")
        };
        //msg.channel.send(msg.content);
        input.write(`${msg.content}\n`)
    }
    client.on("messageCreate", listener);
    output.on("data", (chunk) => {
        let output = '';
        output += chunk.toString();
        const outputArr = output.match(/(.|[\r\n]){1,1536}/g);
        outputArr.forEach(chunk => message.channel.send(codeBlock("js", chunk)))
    });
    message.channel.send("node REPL session commenced. Be aware of code that you enter!");
    logger.log(`User ${message.author.id} has entered Node session!`)
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
    name: "node",
    category: "System",
    description: "Test command",
    usage: `node <required> [optional]`
};
