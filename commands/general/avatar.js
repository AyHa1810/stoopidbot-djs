//const { codeBlock } = require("@discordjs/builders");
const { randomColor } = require("../../modules/functions.js");
const logger = require("../../modules/logger.js");
const { 
    ActionRowBuilder , 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType
} = require('discord.js');

exports.run = async (client, message, args, flags) => {
    currentPage = 512
    row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("256")
            .setLabel("256px")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("512")
            .setLabel("512px")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("1024")
            .setLabel("1024px")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("2048")
            .setLabel("2048px")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("4096")
            .setLabel("4096px")
            .setStyle(ButtonStyle.Primary),
        );
    
    let userID = "";
    if (args[0]) {
        try {
            userID = message.mentions.users.first().id;
        } catch (e) {
            userID = args[0];
        };
    } else { 
        userID = message.author.id;
    };

    let user;
    if (flags.length && flags.includes("g")) {
        try {
            user = await message.guild.members.fetch(userID)
        } catch (e) {
            logger.log(e, "error")
            return message.channel.send("User doesn\'t exist in the server!")
        };
    } else {
        try {
            user = await client.users.fetch(userID)
        } catch (e) {
            logger.log(e, "error")
            return message.channel.send("User cannot be found!")
        };
    };
    link = user.displayAvatarURL({ dynamic:true }); 

    let msg = await message.reply({
        ...getPage(512),
        fetchReply: true,
    });

    const filter = (i) => {
        const user = message.user ?? message.author;
        return i.user.id === user.id;
    };
    var time = 30000;
    const collector = msg.createMessageComponentCollector({
        time,
        filter,
        componentType: ComponentType.Button,
    });
    collector.on("collect", async (interaction) => {
        [ 256, 512, 1024, 2048, 4096 ].forEach( async i => {
            if (interaction.customId === `${i}`) {
                if (this.currentPage === i) {
                    interaction.deferUpdate();
                    return;
                }
                await interaction.update(getPage(i));
            }
        });
    });
    collector.on("end", () => onEnd(msg));

    async function onEnd(message) {
        this.row.components.forEach((component) => component.setDisabled(true));
        //await interaction.editReply({ components: [this.row] });
        await message.edit({ components: [this.row] });
    }
    
    function getPage(number) {
        this.row.components
            .find((component) => component.data.custom_id === `${this.currentPage}`)
            .setDisabled(false);
        this.currentPage = number;
        var embed = {
            color: randomColor(),
            author: {
                name: user.tag,
                icon_url: this.link
            },
            url: `${this.link}?size=${number}`,
            image: { url: `${this.link}?size=${number}`},
            timestamp: new Date().toISOString(),
            footer: {
                text: `Requested by ${message.author.tag}`
            }

        };
        if (flags.length && flags.includes("g")) {
            embed.title = "Guild Avatar";
        } else {
            embed.title = "User Avatar";
        } 
        this.row.components
            .find((component) => component.data.custom_id === `${number}`)
            .setDisabled(true);
        return { embeds: [embed], components: [this.row] };
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "2s",
    aliases: ["av"],
    permLevel: "User"
};

exports.help = {
    name: "avatar",
    category: "General",
    description: "Displays user avatar or guild avatar of an user.",
    usage: "avatar [user] [-g]"
};
