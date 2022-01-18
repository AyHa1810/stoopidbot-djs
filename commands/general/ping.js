const { MessageEmbed } = require("discord.js"); 
const { msConvert } = require("../../modules/functions.js");

exports.run = async (client, message, args) => {
  let botMsg = await message.reply({
    content: 'Pinging...',
    allowedMentions: {
        repliedUser: false
    }
  })
 
  const pingEmbed = {
    title: "Ping",
    description: [
      "**Uptimerobot** : `" + (botMsg.createdAt - message.createdAt) + "ms`",
      "**API**         : `" + Math.round(client.ws.ping) + "ms`",
      "**Uptime**      : `" + msConvert(client.uptime) + "`"
    ].join("\n"),
    color: "#18191b",
    footer: { text: "Requested by " + message.author.tag, icon_url: message.author.displayAvatarURL() },
    timestamp: new Date()
  }; 

  botMsg.edit({ embed: [pingEmbed]}).catch(() => botMsg.edit("An unknown error occurred. Do I have required permissions?"));
}

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