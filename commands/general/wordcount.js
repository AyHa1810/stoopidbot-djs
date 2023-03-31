const { QuickDB } = require("quick.db");
const db = new QuickDB();

exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    if (!args[0]) {
        let count = await db.get(`countWord_${message.guild.id}_${message.author.id}`);
        if (!count) return message.channel.send(`bruh you never said 'ok'! say it to count`)
        return message.channel.send(`you have said 'ok' ${count} times till now xd`)
    }

    if (args[0] === "reset") {
        await db.delete(`countWord_${message.guild.id}_${message.author.id}`);
        return message.channel.send("successfully resetted the word count")
    } 
    
    let userID = "";
    try {
        userID = message.mentions.users.first().id;
    } catch (e) {
        userID = args[0];
    };

    try {
        if (args[0] != "" && client.users.cache.has(userID)) {
            let count = db.fetch(`countWord_${message.guild.id}_${userID}`);
            if (!count) return message.channel.send(`that user never said 'ok'`)
            return message.channel.send(`that user said 'ok' ${count} times till now xd`)
        } 
    } catch (e) {
        return message.channel.send(`either that user doesnt exists in the database, or the given user isnt valid`)
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "1s",
    aliases: ["wcount"],
    permLevel: "User"
};

exports.help = {
    name: "wordcount",
    category: "General",
    description: "Tells you how many times the user said 'ok'",
    usage: "wordcount [<user mention>/reset]"
};