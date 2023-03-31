// editsnipe.js : Reveals the original text of the last edited message

const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message) => {
    const { container } = client;
    editSnipes = container.editSnipes;
    const snipe = editSnipes[message.channel.id];

    await message.reply(
        snipe ? {
            embeds: [
                new EmbedBuilder()
                    .setDescription(snipe.content)
                    .setAuthor({ name: snipe.author })
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
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "editsnipe",
    category: "General",
    description: "Reveals the original text of the last edited message.",
    usage: "editsnipe"
};
