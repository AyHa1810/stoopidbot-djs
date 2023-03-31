const logger = require("../modules/logger.js");
//const { getSettings, permlevel } = require("../modules/functions.js");
//const config = require("../config.js");

module.exports = async (client, oldMessage, newMessage) => {
    const { container } = client;
    if (newMessage.author.bot) return; // return if the message author is a bot
    if (oldMessage.partial) return; // content is null

    editSnipes = container.editSnipes;

    editSnipes[oldMessage.channel.id] = {
        author: oldMessage.author.tag,
        content: oldMessage.content,
        createdAt: newMessage.editedTimestamp
    };
};
