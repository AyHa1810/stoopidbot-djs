// changeNickname.js changes the prefix of the bot in the server the command is run
const { settings } = require("../../modules/settings.js");

exports.run = async (client, message, [...values], level) => {
    // Retrieve current guild settings (merged) and overrides only.
    const serverSettings = message.settings;
    const defaults = settings.get("default");
    const overrides = settings.get(message.guild.id);
    const replying = serverSettings.commandReply;
    if (!settings.has(message.guild.id)) settings.set(message.guild.id, {});

    const prefix = values.join(" ");

    if (!prefix) {
        // Checks if the prefix has any overrides in the guild
        if (!overrides["prefix"]) return message.reply({
            content: "The perfix is already set to default, `" + defaults["prefix"] + "` , maybe try giving a prefix the next time!",
            allowedMentions: { repliedUser: (replying === "true") }
       });

        // We delete the prefix key here.
        settings.delete(message.guild.id, "prefix");
        message.reply({
            content: `Prefix has been successfully reset to default.`,
            allowedMentions: { repliedUser: (replying === "true") }
        });
    } else {
        if (prefix === serverSettings["prefix"]) return message.reply({
            content: "The prefix has the same one as the given one!",
            allowedMentions: { repliedUser: (replying === "true") }
        });

        // If the guild does not have any overrides, initialize it.
        if (!settings.has(message.guild.id)) settings.set(message.guild.id, {});

        // Modify the guild overrides directly.
        settings.set(message.guild.id, prefix, "prefix");

        // Confirm everything is fine!
        message.reply({
            content: "Prefix successfully changed to `" + prefix + "`",
            allowedMentions: { repliedUser: (replying === "true") }
        });
    };
};

// command's default config
exports.conf = {
    enabled: true,
    guildOnly: true,
    cooldown: "5 sec",
    aliases: [],
    permLevel: "Administrator"
};

// command's help texts
exports.help = {
    name: "prefix",
    category: "Admin",
    description: "Changes the bot's prefix in the guild. Leave the field blank to reset to default.",
    usage: "prefix [new prefix]"
};
