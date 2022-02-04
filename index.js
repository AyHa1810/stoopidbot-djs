require('dotenv').config();
const { Client, Intents } = require("discord.js")
const client = new client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
let spamCtrl = require('./spamCtrl');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", msg => {
  if (msg.content === "*hell-o") {
    msg.reply("bruh shut the fk up bitch lmfao");
  }
})

client.on("messageCreate", msg => {
  if (msg.content === "*nigg-") {
    msg.reply("YOU CAN'T SAY THE FUKIN N- WORD BRUH!!!");
  }
})

client.on("messageCreate", msg => {
  if (msg.content === "*no") {
    msg.reply("Shut bitch!");
  }
})

client.on("messageCreate", msg => {
  if (msg.content === "*AyHa bot alib") {
    msg.reply("Yay! haha");
  }
})

client.on("messageCreate", msg => {
  if (msg.content === "*bruh-help") {
    msg.channel.send("bruh-help = dis menu\nhell-o = says something\nnigg- = also says something\nno = ALSO SAYS SOMETHING AHAHA\nAyHa bot alib = k idk i succ at help menu");
  }
})

case '?SPAM':
  spamCtrl.setChannel(message.channel);
  spamCtrl.setStatus(true);
  break;
case '?STOP-SPAM':
  spamCtrl.setStatus(false);
  break;

client.login(process.env.TOKEN)
