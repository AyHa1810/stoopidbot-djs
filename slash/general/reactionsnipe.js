// reactionsnipe.js : Reveals the last removed reaction

const { EmbedBuilder, ApplicationCommandOptionType} = require("discord.js");
const { formatEmoji } = require("../../modules/functions.js");

exports.run = async (client, interaction) => {
    const { container } = client;
    reactionSnipes = container.reactionSnipes;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const snipe = reactionSnipes[channel.id];


    await interaction.reply(
        snipe ? {
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `reacted with ${formatEmoji(
                            snipe.emoji
                        )} on [this message](${snipe.messageURL})`)
                    .setAuthor({ name: snipe.user })
                    .setFooter({ text: `#${channel.name}` })
                    .setTimestamp(snipe.createdAt),
            ],
        }
        : "There's nothing to snipe!"
    );
};

exports.commandData = {
    name: "reactionsnipe",
    description: "Reveals the last removed reaction.",
    options: [
        {
            name: 'channel',
            description: 'The channel to snipe',
            type: ApplicationCommandOptionType.Channel,
            //autocomplete: undefined,
            //choices: undefined,
            required: false
        },
    ],
    defaultPermission: true
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    category: "General",
    permLevel: "User"
};