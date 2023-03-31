const logger = require("../modules/logger.js");
const config = require("../config.js");

module.exports = async (client, interaction) => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return;
  
    const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

    collector.on('collect', i => {
        if (i.user.id === interaction.user.id) {
            i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
        } else {
            i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
        }
    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} interactions.`);
    });


    try {
    collector.on('collect', m => {
	      console.log(`Collected ${m.content}`);
    });

    collector.on('end', collected => {
	      console.log(`Collected ${collected.size} items`);
    });
  
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