const { parse } = require("twemoji-parser");
const { toProperCase, testImage } = require("../../modules/functions.js");
const { EmbedBuilder: MessageEmbed, parseEmoji } = require("discord.js");
const Color = `RANDOM`;

exports.run = async (client, message, args) => {
    const emoji = args[0];
    if (!emoji) return message.channel.send("Bruh give an emoji to steal!");

    let customemoji = parseEmoji(emoji);

    if (customemoji.id) {
        const link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
            customemoji.animated ? "gif" : "png"
        }`;
        const name = args.slice(1).join(" ");
        message.guild.emojis.create(
            `${link}`,
            `${name || `${customemoji.name}`}`
        );
        return message.channel.send("aight emoji added xd")
    } else if (testImage(Attachment[0].link)) {
        const link = Attachment[0].link;
        const name = args.slice(1).join(" ");
        message.guild.emojis.create(
            `${link}`,
            `${name || `${Attachment[0].filename}`}`
        );
        return message.channel.send("aight emoji added xd")
    } else {
        let CheckEmoji = parse(emoji, { assetType: "png" });
        if (!CheckEmoji[0])
            return message.channel.send("Bruh give an emoji to steal");
        message.channel.send("That emoji is a stock emoji, and doesn\'t requires to be added");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    cooldown: "5s",
    aliases: ["stealemoji", "semo"],
    permLevel: "Administrator"
};

exports.help = {
    name: "stealemoji",
    category: "Admin",
    description: "Steals emoji from other servers and adds it to this server.",
    usage: "stealemoji <emoji> [emoji name]"
};
