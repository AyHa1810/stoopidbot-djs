// reboot.js : kills the bot

const config = require("../../config.js");
const { settings } = require("../../modules/settings.js");
const { getFiles } = require("../../modules/functions.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const replying = settings.ensure(message.guild.id, config.defaultSettings).commandReply;
    await message.reply({ content: "Bot is shutting down.", allowedMentions: { repliedUser: (replying === "true") }});
    await Promise.all(client.container.commands.map(cmd => {
       // the path is relative to the *current folder*, so just ./filename.js
       const cmdDel = getFiles("./commands").filter(item => item.endsWith(cmd.help.name + ".js"));
       delete require.cache[require.resolve('../' + cmdDel[0])];
       // We also need to delete and reload the command from the container.commands Enmap
       client.container.commands.delete(cmd.help.name);
    }));
    process.exit(0);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "1m",
    aliases: [ "restart" ],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "reboot",
    category: "System",
    description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
    usage: "reboot"
};