// reactionsnipe.js : Reveals the last removed reaction

const { EmbedBuilder } = require("discord.js");
const { formatEmoji } = require("../../modules/functions.js");


exports.run = async (client, message) => {
    const { container } = client;
    reactionSnipes = container.reactionSnipes;
    const snipe = reactionSnipes[message.channel.id];

    await message.reply(
        snipe ? {
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `reacted with ${formatEmoji(
                            snipe.emoji
                        )} on [this message](${snipe.messageURL})`)
                    .setAuthor({ name: snipe.user })
                    .setFooter({ text: `#${message.channel.name}` })
                    .setTimestamp(snipe.createdAt),
            ],
        }
        : "There's nothing to snipe!"
    );
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "1s",
    aliases: [ "reactsnipe" ],
    permLevel: "User"
};

exports.help = {
    name: "reactionsnipe",
    category: "General",
    description: "Reveals the last removed reaction",
    usage: "reactionsnipe"
};
