const logger = require("../modules/logger.js");
const { getSettings, permlevel } = require("../modules/functions.js");
const config = require("../config.js");

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return;

    const settings = interaction.settings = getSettings(interaction.guild);

    const level = permlevel(interaction);

    const cmd = client.container.slashcmds.get(interaction.commandName);

    if (!cmd) return;

    if (level < client.container.levelCache[cmd.conf.permLevel]) {
        return await interaction.reply({
            content: `This command can only be used by ${cmd.conf.permLevel}'s only`,
            ephemeral: settings.systemNotice !== "true"
        });
    }

    try {
        await cmd.run(client, interaction);
        logger.log(`${config.permLevels.find(l => l.level === level).name} ${interaction.user.id} ran slash command ${interaction.commandName}`, "cmd");

    } catch (e) {
        console.error(e);
        if (interaction.replied)
            interaction.followUp({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
                .catch(e => console.error("An error occurred following up on an error", e));
        else
        if (interaction.deferred)
            interaction.editReply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
                .catch(e => console.error("An error occurred following up on an error", e));
        else
            interaction.reply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
                .catch(e => console.error("An error occurred replying on an error", e));
    }
};
