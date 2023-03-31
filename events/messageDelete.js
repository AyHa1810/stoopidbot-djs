const logger = require("../modules/logger.js");
//const { getSettings, permlevel } = require("../modules/functions.js");
//const config = require("../config.js");

module.exports = async (client, message) => {
    const { container } = client;
    if (message.author.bot) return; // return if the message author is a bot
    if (message.partial) return; // content is null or deleted embed

    snipes = container.snipes;

    snipes[message.channel.id] = {
        author: message.author.tag,
        content: message.content,
        embeds: message.embeds,
        attachments: [...message.attachments.values()].map((a) => a.proxyURL),
        createdAt: message.createdTimestamp
    };
};
