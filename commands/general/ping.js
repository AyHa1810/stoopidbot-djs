// ping.js : pings the bot and returns ping info

const { MessageEmbed } = require("discord.js");
const { msConvert } = require("../../modules/functions.js");

exports.run = async (client, message) => {
    let botMsg = await message.reply({
        content: "Pinging...",
        allowedMentions: {
            repliedUser: false
        }
    })

    const pingEmbed = new MessageEmbed()
        .setTitle("Ping")
        .addFields(
            { name: "Message-bot", value: `${botMsg.createdAt - message.createdAt} ms` },
            { name: "API", value: `${Math.round(client.ws.ping)} ms` },
            { name: "Uptime", value: `${msConvert(client.uptime)}` }
        )
        .setColor("#18191b")
        .setTimestamp()
        .setFooter("Requested by" + message.author.tag, message.author.displayAvatarURL()); 

      botMsg.edit({content:"\u200B", embeds: [pingEmbed]}).catch(() => botMsg.edit("An unknown error occurred. Do I have required permissions?"));
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "1s",
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "ping",
    category: "General",
    description: "Gives bot's ping info",
    usage: "stats"
};
