exports.run = async (client, message, [action]) => {
    if(action === "clear"){
        const response = await awaitReply(message, `Are you sure you want to remove all the cmds? This **CANNOT** be undone.`);

        if (["y", "yes"].includes(response)) {
            await client.guilds.cache.get(message.guild.id)?.commands.set([]);
            await client.application?.commands.set([]);
            await message.reply({ content: `All commands removed!`, allowedMentions: { repliedUser: (replying === "true") }});
        } else
        if (["n","no","cancel"].includes(response)) {
            message.reply({ content: "Action cancelled.", allowedMentions: { repliedUser: (replying === "true") }});
        }
    }
    const [globalCmds, guildCmds] = client.container.slashcmds.partition(c => !c.conf.guildOnly);
    await message.channel.send("Deploying commands!");
    await client.guilds.cache.get(message.guild.id)?.commands.set(guildCmds.map(c => c.commandData));
    await client.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));
    await message.channel.send("All commands deployed!");
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    cooldown: "2min",
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "deploy",
    category: "System",
    description: "This will deploy all slash commands.",
    usage: "deploy"
};