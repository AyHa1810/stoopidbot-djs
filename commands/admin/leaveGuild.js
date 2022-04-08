// leaveGuild.js leaves the server the command is run on
exports.run = async (client, message, level) => {
    let guildID = client.guilds.cache.get(message.guild.id).id; // gets guild id from the message
    if (!guildID) return // returns if it doesnt gets any guild id
    message.channel.send("ok bye");
    client.guilds.cache.get(guildID).leave(); // leaves the guild with the id
};

// command's default config
exports.conf = {
    enabled: true,
    guildOnly: true,
    cooldown: "1 min",
    aliases: ["leaveserver", "leave"],
    permLevel: "Administrator"
};

// command's help texts
exports.help = {
    name: "leaveguild",
    category: "Admin",
    description: "Leaves the bot from the guild.",
    usage: "leaveguild"
};
