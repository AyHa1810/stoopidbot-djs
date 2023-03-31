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
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    const option = interaction.options.getString("options");
    console.log(option);

    const code = interaction.options.getString("input");
    const evaled = eval(code);
    const cleaned = await clean(client, evaled);
    const output = cleaned.match(/(.|[\r\n]){1,1536}/g);
    if (option === "noOutput") {
        return;
    } else if ( option === "noLimit") {
        output.forEach(chunk => interaction.channel.send(codeBlock("js", chunk)));
    } else {
        for (a=0; a < output.slice(0, 9).length; a++) { //output.length omitted
            interaction.channel.send(codeBlock("js", output[a]));
        };
    };

    const { SlashCommandBuilder } = require('@discordjs/builders');

    const data = new SlashCommandBuilder()
	    .setName('ping')
	    .setDescription('Replies with Pong!')
	    .addStringOption(option => option.setName('input').setDescription('Enter a string'))
	    .addIntegerOption(option => option.setName('int').setDescription('Enter an integer'))

};

exports.commandData = {
    name: "eval",
    description: "Evaluates arbitrary javascript.",
    options: [
        {
            name: 'input',
            description: 'Enter code to execute',
            type: 3,
            //autocomplete: undefined,
            //choices: undefined,
            required: true
        },
        {
            name: 'options',
            description: 'Enter an option',
            type: 3,
            //autocomplete: undefined,
            choices: [ 
                { name: 'No Output', value: 'noOutput' },
                { name: 'No Limit',  value: 'noLimit' }
            ],
            required: false
        }
    ],
    defaultPermission: true
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    category: "System",
    permLevel: "Bot Owner"
};