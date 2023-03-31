// snipe.js : Reveals the last deleted message

const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Paginator = require("../../modules/paginator.js");

exports.run = async (client, interaction) => {
    const { container } = client;
    snipes = container.snipes;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const snipe = snipes[channel.id];

    if (!snipe) return interaction.reply("There's nothing to snipe!");

    const type = interaction.options.getString("options");

    if (type === "embeds") {
        if (!snipe.embeds.length)
            return interaction.reply("The message has no embeds!");
        const paginator = new Paginator(
            snipe.embeds.map((e) => ({ embeds: [e] }))
        );
        await paginator.start(interaction);
    } else if (type === "attachments") {
        if (!snipe.attachments.length)
            return interaction.reply("The message has no embeds!");
        const paginator = new Paginator(
            snipe.attachments.map((a) => ({ content: a }))
        );
        await paginator.start(interaction);
    } else {
        const embed = new EmbedBuilder()
            .setAuthor({ name: snipe.author })
            .setFooter({ text: `#${channel.name}` })
            .setTimestamp(snipe.createdAt);
        if (snipe.content) embed.setDescription(snipe.content);
        if (snipe.attachments.length) embed.setImage(snipe.attachments[0]);
        if (snipe.attachments.length || snipe.embeds.length)
            embed.addField(
                "Extra Info",
                `*Message also contained \`${snipe.embeds.length}\` embeds and \`${snipe.attachments.length}\` attachments.*`
            );

        await interaction.reply({ embeds: [embed] });
    }
};

exports.commandData = {
    name: "snipe",
    description: "Reveals the last deleted message.",
    options: [
        {
            name: 'channel',
            description: 'The channel to snipe',
            type: ApplicationCommandOptionType.Channel,
            //autocomplete: undefined,
            //choices: undefined,
            required: false
        },
        {
            name: 'options',
            description: 'Other parts of the deleted message, if present',
            type: ApplicationCommandOptionType.String,
            //autocomplete: undefined,
            choices: [ 
                { name: 'attachments', value: 'attachments' },
                { name: 'embeds',  value: 'embeds' }
            ],
            required: false
        }
    ],
    defaultPermission: true
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    category: "General",
    permLevel: "User"
};