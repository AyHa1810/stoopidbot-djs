/**
    messageCreate.js triggers at everytime someone messages and applies jobs to do
    before the actual command executes
*/

// Required constants and dependencies
const logger = require("../modules/logger.js");
const { getSettings, permlevel, msConvert, timer } = require("../modules/functions.js");
const config = require("../config.js");
const { codeBlock } = require("@discordjs/builders");
const db = require("quick.db");
const convToMs = require("ms");
const talkedRecently = new Set();

// Jobs to do at message create event
module.exports = async (client, message) => {
    const { container } = client; // creates a container of the client

    if (message.author.bot) return; // if the author is a bot, then return

    if(message.content.toLowerCase() == 'ok') {
        let count = db.fetch(`countWord_${message.guild.id}_${message.author.id}`);
        db.set(`countWord_${message.guild.id}_${message.author.id}`, count + 1);
    }

    const settings = message.settings = getSettings(message.guild); // gets bot settings from the message's guild

    // if an user pings the bot, it replies the bot's given prefix
    const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this server is \`${settings.prefix}\``);
    }

    const prefix = new RegExp(`^<@!?${client.user.id}> |^\\${settings.prefix}`).exec(message.content);
    if (!prefix) return; // returns if the message doesnt starts with bot's prefix

    // separate prefix from the message
    const noPrefixMsg = message.content.slice(prefix[0].length).trim();

    //const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
    var args = [];
    var regexp = /[^\s"]+|"([^"]*)"/gi;
    do {
        //Each call to exec returns the next regex match as an array
        var match = regexp.exec(noPrefixMsg);
        if (match != null)
        {
            //Index 1 in the array is the captured group if it exists
            //Index 0 is the matched text, which we use if no captured group exists
            args.push(match[1] ? match[1] : match[0]);
        }
    } while (match != null);
    //var void1 = args.shift();
    const command = args.shift().toLowerCase(); //shifts the args to all lower case and separates the first arg from the array as the command

    // fetches the message author if the bot doesn't finds the author as a member of the guild
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    const level = permlevel(message); // fetches and sets the permission level of the used command

    const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));
    if (!cmd) return; // returns if the command doesnt exists

    // returns and sends the error message if the command is guildOnly
    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (!cmd.conf.enabled) return; // returns if the command is disabled

    // returns and sends error message if the command used doesn't meets message author's permission level
    if (level < container.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === "true") {
            /**return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${config.permLevels.find(l => l.level === level).name})
This command requires level ${container.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);*/
            return message.channel.send(`You don't have required permissions to use this command. You must be a ${config.permLevels.find(l => l.level === level).name} to use this command.`);
        } else {
            return;
        }
    }

    // returns if the command is in a cooldown for the user
    const cooldownTime = convToMs(cmd.conf.cooldown);
    if (talkedRecently.has(message.author.id + "-" + cmd.help.name)) {
        return message.channel.send("bruh wait " + msConvert(a.getTimeLeft()) + " before using that command");
    } else {
        talkedRecently.add(message.author.id + "-" + cmd.help.name);
        setTimeout(() => {

            talkedRecently.delete(message.author.id + "-" + cmd.help.name);
        }, cooldownTime);
        a = new timer(function() {}, cooldownTime)
    }


    message.author.permLevel = level; // idk how to explain this one lol

    message.flags = [];
    while (args[1] && args[1][1] === "-") {
        message.flags.push(args.shift().slice(1));
    }

    // logging command input for debugging
    logger.log("cmd: " + command + "; args: [" + args + "]; flags: [" + message.flags + "]", "debug");

    // runs the command after the jobs is applied, throws error message if an error occurs
    try {
        await cmd.run(client, message, args, level);
        logger.log(`${config.permLevels.find(l => l.level === level).name} ${message.author.id} ran command ${cmd.help.name}`, "cmd");
    } catch (e) {
        console.error(e);
        message.channel.send({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\`` })
            .catch(e => console.error("An error occurred replying on an error", e));
    };
/**
    if (debugging = true) {
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
        //const code = args.join(" ");
        const evaled = eval(code);
        const cleaned = await clean(client, evaled);
        //message.channel.send(codeBlock("js", cleaned));
    } */
};
