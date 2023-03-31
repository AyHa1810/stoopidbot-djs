//const { codeBlock } = require("@discordjs/builders");
const { toProperCase, msConvert, randomColor } = require("../../modules/functions.js");
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

exports.run = (client, message, args, level, interaction) => {
    const { container } = client;
    if (!args[0] && !message.flags[0]) {
        const settings = message.settings;

        const myCommands = message.guild ? container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
            container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

        const enabledCommands = myCommands.filter(cmd => cmd.conf.enabled);

        const commandNames = [...enabledCommands.keys()];

        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

        let currentCategory = "";
/**
    //let output = `= Command List =\n[Use ${settings.prefix}help <commandname> for details]\n`;
        const output = new EmbedBuilder()
            .setColor('RANDOM')
            .setTitle('Command List')
            .setDescription('Use ${settings.prefix}help <commandname> for details')
            .setTimestamp()
            .setFooter('lol');

        const sorted = enabledCommands.sort((p, c) => p.help.category > c.help.category ? 1 :
            p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );

        sorted.forEach( c => {
            const cat = toProperCase(c.help.category);
            if (currentCategory !== cat) {
                output += `\u200b\n== ${cat} ==\n`;
                currentCategory = cat;
            }
        //output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
            output.addField('${settings.prefix}${c.help.name}', '${c.help.description}', true);;
        })
*/
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'All commands',
                            description: 'Help list of all commands',
                            value: 'first_option',
                        },
                        {
                            label: 'Test',
                            description: 'Diskription',
                            value: 'second_option',
                        },
                    ]),
            );

        var embed = new EmbedBuilder();
        embed.setColor(randomColor());
        embed.setTitle(`Command List`);
        embed.setDescription(`Use ${settings.prefix}help <commandname> for details`);
        embed.setTimestamp();
        embed.setFooter({ "text": `page` });

        const sorted = enabledCommands.sort((p, c) => p.help.category > c.help.category ? 1 :
            p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );

        sorted.forEach( c => {
            const cat = toProperCase(c.help.category);
            if (currentCategory !== cat) {
                //output += `\u200b\n== ${cat} ==\n`;
                currentCategory = cat;
            }
            embed.addFields(
                { name: `${settings.prefix}${c.help.name}`, value: `${c.help.description}`, inline: false }
            );
        })

    //message.channel.send(codeBlock("asciidoc", output));
        message.channel.send({ embeds: [embed], components: [row] });

        //if (!interaction.isSelectMenu()) return;
        //if (interaction.customId === 'select') {
        //    interaction.update({ content: 'Something was selected!', components: [] });
        //};

    } else {
        let command = args[0];
        if (container.commands.has(command) || container.commands.has(container.aliases.get(command))) {
            command = container.commands.get(command) ?? container.commands.get(container.aliases.get(command));
            if (level < container.levelCache[command.conf.permLevel]) return;
            //message.channel.send(codeBlock("asciidoc", `= ${command.help.name} = \n${command.help.description}\nusae:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}`));
            let cmdAliases = command.conf.aliases.join(", ");
            if (!cmdAliases) {
                cmdAliases = "none";
            }

            let enabled;
            if (command.conf.enabled == true) 
                { enabled = "Enabled" } 
                else { enabled = "Disabled" };

            var embed = new EmbedBuilder();
            embed.setColor(randomColor());
            embed.setTitle(`${message.settings.prefix}${command.help.name} info`);
            embed.addFields(
                { name: `Description`,      value: `${command.help.description}`, inline: false },
                { name: `Usage`,            value: `\`\`\`\n${message.settings.prefix}${command.help.usage}\n\`\`\``, inline: false },
                { name: `Aliases`,          value: `${cmdAliases}`,               inline: false },
                { name: `Cooldown`,         value: `${command.conf.cooldown}`,    inline: false},
                { name: `Premission Level`, value: `${command.conf.permLevel}`,   inline: false },
                { name: `Status`,           value: `${enabled}`,   inline: false },
            );
            embed.setFooter({ "text": `Usage Syntax: <required> [optional] {group}` });

            message.channel.send({ embeds: [embed] });

        } else return message.channel.send("No command with that name, or alias exists.");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "2s",
    aliases: ["h", "help"],
    permLevel: "User"
};

exports.help = {
    name: "help",
    category: "General",
    description: "Displays all the available commands for your permission level.",
    usage: "help [command]"
};
