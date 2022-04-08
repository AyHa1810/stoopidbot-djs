const logger = require("../modules/logger.js");
const { getSettings } = require("../modules/functions.js");
module.exports = async client => {
  logger.log(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");
  
  client.user.setActivity(`${getSettings("default").prefix}help`, { type: "PLAYING" });
};