// snipe.js : Reveals the last deleted message

const { EmbedBuilder } = require("discord.js");
const { randomColor } = require("../../modules/functions.js")
const Paginator = require("../../modules/paginator.js");

exports.run = async (client, message, args) => {
    const { container } = client;
    snipes = container.snipes;
    const snipe = snipes[message.channel.id];

    if (!snipe) return message.reply("There\'s nothing to snipe!");

    const type = args[0];

    if (type === "embeds") {
        if (!snipe.embeds.length)
        return message.reply("The message has no embeds!");
        const paginator = new Paginator(
            snipe.embeds.map((e) => ({ embeds: [e] }))
        );
        await paginator.start(message);
    } else if (type === "attachments") {
        if (!snipe.attachments.length)
            return message.reply("The message has no attachments!");
        const paginator = new Paginator(
            snipe.attachments.map((a) => ({ content: a }))
        );
        await paginator.start(message);
    } else {
        const embed = new EmbedBuilder()
            .setColor(randomColor())
            .setAuthor({ name: snipe.author })
            .setFooter({ text: `#${message.channel.name}` })
            .setTimestamp(snipe.createdAt);
        //if (snipe.author.avatar) embed.setAuthor({ icon_url: snipe.author.avatarURL() });
        if (snipe.content) embed.setDescription(snipe.content);
        if (snipe.attachments.length) embed.setImage(snipe.attachments[0]);
        if (snipe.attachments.length || snipe.embeds.length)
            embed.addFields({
                name: "Extra Info",
                value: `*Message also contained \`${snipe.embeds.length}\` embeds and \`${snipe.attachments.length}\` attachments.*`
            });

        await message.reply({ embeds: [embed] });
    };
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "1s",
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "snipe",
    category: "General",
    description: "Reveals the last deleted message.",
    usage: "snipe"
};
