const { version, MessageEmbed } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);
  const statsEmbed = new MessageEmbed()
    .setColor(`RANDOM`)
    .setTitle(`Bot Stats`)
    .setDescription(`Stats of the bot :P`)
    .addFields(
      { name: `Memory Usage`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
      { name: `Uptime`, value: `${duration}`, inline: true },
      { name: `Users`, value: `${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}`, inline: true },
      { name: `Servers`, value: `${client.guilds.cache.size.toLocaleString()}`, inline: true },
      { name: `Channels`, value: `${client.channels.cache.size.toLocaleString()}`, inline: true },
      { name: `Discord.js Version`, value: `v${version}`, inline: true },
      { name: `Node Version`, value:`${process.version}`, inline: true },
    )
    .setFooter(`Bot Owner: ${client.users.cache.find(u => u.id === process.env.owner).tag}`)
    .setTimestamp();

  await interaction.reply({ embeds: [statsEmbed] });
};

exports.commandData = {
  name: "stats",
  description: "Show's the bots stats.",
  options: [],
  defaultPermission: true,
};

exports.conf = {
  permLevel: "User",
  guildOnly: false
};