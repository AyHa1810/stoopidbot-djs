exports.run = async (client, message, args, level) => {

  const [globalCmds, guildCmds] = client.container.slashcmds.partition(c => !c.conf.guildOnly);
  await message.channel.send("Deploying commands!");
  await client.guilds.cache.get(message.guild.id)?.commands.set(guildCmds.map(c => c.commandData));
  await client.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));
  await message.channel.send("All commands deployed!");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
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