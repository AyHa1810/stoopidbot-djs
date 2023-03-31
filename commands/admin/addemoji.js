const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
const { testImage } = require("../../modules/functions.js");
const { MessageType } = require("discord.js");
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.run = async (client, message, args) => {
    let emoji;
    //const hasEmoteRegex = /<a?:.+:\d+>/gm
    const emoteRegex = /<:.+:(\d+)>/gm
    const animatedEmoteRegex = /<a:.+:(\d+)>/gm

    const serverTier = message.guild.premiumTier;
    let maxSize = 50;
    if(serverTier == 1) maxSize = 100;
    else if(serverTier == 2) maxSize = 150;
    else if(serverTier == 3) maxSize = 250;

    if (message.type === MessageType.Reply) {
        const msg = await message.fetchReference();
        console.log(msg);

        if (emoji = emoteRegex.exec(msg.content)) {
            emoji = emoji[0]
            console.log(emoji);
        }
        else if (emoji = animatedEmoteRegex.exec(msg.content)) {
            emoji = emoji[0]
        }
        else return message.channel.send("Couldn't find any emoji in the message!")
    } else {
        emoji = args.shift();
    };

    var Attachment = (message.attachments.map((a) => ({ content: a })));

    if (!emoji && !Attachment) return message.channel.send("Bruh give an emoji to steal!");

    let customemoji;
    if (!Attachment[0]) { customemoji = Discord.parseEmoji(emoji) };

    if (customemoji) {
        const link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
            customemoji.animated ? "gif" : "png"
        }`;
        const name = args.slice(0).join(" ");
        /*var response = await fetch(link, {
            method: 'GET',
            headers: { 'Accept': '*\*' } // was supposed to be / instead of \ :P
        });
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        var data = await response.buffer(); */
        if (message.guild.emojis.cache.size >= maxSize) {
            return message.channel.send(`Maximum number of ${maxSize} emojis reached!`)
        } else {
            message.guild.emojis.create({
                attachment: link,
                name: `${name || customemoji.name}`
            });
        }
        return message.channel.send("aight emoji added xd")
    } else if (Attachment[0] && testImage(Attachment[0].content.url)) {
        const link = Attachment[0].content.url;
        const name = args.slice(1).join(" ");

        message.guild.emojis.create({
            attachment: link,
            name: `${name || Attachment[0].filename}`
        });
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
    name: "addemoji",
    category: "Admin",
    description: "Steals emoji from other servers and adds it to this server.",
    usage: "addemoji <emoji> [emoji name]"
};
