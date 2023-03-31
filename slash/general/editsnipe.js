// editsnipe.js : Reveals the original text of the last edited message

const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

exports.run = async (client, interaction) => {
    const { container } = client;
    editSnipes = container.editSnipes;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const snipe = editSnipes[channel.id];
    console.log(editSnipes);
    await interaction.reply(
        snipe ? {
            embeds: [
                new EmbedBuilder()
                    .setDescription(snipe.content)
                    .setAuthor({ name: snipe.author })
                    .setFooter({ text: `#${channel.name}` })
                    .setTimestamp(snipe.createdAt),
            ],
        }
        : "There's nothing to snipe!"
    );
};

exports.commandData = {
    name: "editsnipe",
    description: "Reveals the original text of the last edited message.",
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