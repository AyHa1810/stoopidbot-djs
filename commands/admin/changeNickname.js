// changeNickname.js changes the nickname of the bot
exports.run = async (client, message, args, level) => {
    const nick = args[0];
    if (!nick) return message.channel.send("bruh specify a nickname to set!")
    message.guild.members.me.setNickname(nick);
    return message.channel.send("Nickname changed to " + nick)
};

// command's default config
exports.conf = {
    enabled: true,
    guildOnly: true,
    cooldown: "5 sec",
    aliases: ["nickname", "botnick"],
    permLevel: "Administrator"
};

// command's help texts
exports.help = {
    name: "changenickname",
    category: "Admin",
    description: "Changes the bot's nickname in the guild.",
    usage: "botnick [new nickname]"
};
