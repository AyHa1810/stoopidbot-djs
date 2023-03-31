// changeNickname.js changes the nickname of the bot
exports.run = async (client, message, args, level) => {
    const nick = args.join(" ");
    //if (!nick) return message.channel.send("bruh specify a nickname to set!")
    if (!nick) {
        message.guild.members.me.setNickname("");
        return message.channel.send("Nickname removed")
    } else if (nick.length > 32) {
        message.guild.members.me.setNickname(nick.substring(0, 32));
        return message.channel.send("Nickname changed to `" + nick.substring(0, 32) + "`. However, please note that characters must not exceed 32 characters.")
    } else {
        message.guild.members.me.setNickname(nick.substring(0, 32));
        return message.channel.send("Nickname changed to `" + nick + "`")
    };
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
