// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS

const { codeBlock } = require("@discordjs/builders");

/*
    MESSAGE CLEAN FUNCTION
    "Clean" removes @everyone pings, as well as tokens, and makes code blocks
    escaped so they're shown more easily. As a bonus it resolves promises
    and stringifies objects!
    This is mostly only used by the Eval and Exec commands.
*/
async function clean(client, text) {
    if (text && text.constructor.name == "Promise")
        text = await text;
    if (typeof text !== "string")
        text = require("util").inspect(text, {depth: 1});

    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

    text = text.replaceAll(client.token, "[REDACTED]");

    return text;
}

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
    const code = args.join(" ");
    const evaled = eval(code);
    const cleaned = await clean(client, evaled);
    const output = cleaned.match(/(.|[\r\n]){1,1536}/g);
    if (flags.length && flags.includes("no-output")) {
        return;
    } else if (flags.length && flags.includes("no-limit")) {
        output.forEach(chunk => message.channel.send(codeBlock("js", chunk)));
    } else {
        for (a=0; a < output.slice(0, 9).length; a++) { //output.length omitted
            message.channel.send(codeBlock("js", output[a]));
        };
    };
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "1s",
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "eval",
    category: "System",
    description: "Evaluates arbitrary javascript.",
    usage: "eval <...code>"
};
