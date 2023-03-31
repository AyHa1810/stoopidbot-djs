const logger = require("../modules/logger.js");
//const { getSettings, permlevel } = require("../modules/functions.js");
//const config = require("../config.js");

module.exports = async (client, reaction, user) => {
    const { container } = client;
    if (reaction.partial) reaction = await reaction.fetch();

    reactionSnipes = container.reactionSnipes;

    reactionSnipes[reaction.message.channel.id] = {
        user: user.tag,
        emoji: reaction.emoji,
        messageURL: reaction.message.url,
        createdAt: Date.now(),
    };
};
