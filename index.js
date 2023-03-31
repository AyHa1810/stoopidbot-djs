/** random text warning lmao
  there was nothing here I promise lmao
*/

// this is the main index.js file to load the bot from

// checks the node version and throws error if the used version is lower than the minimum require version
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");

// loads  required constants and dependencies
require("dotenv").config();
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { intents, partials, permLevels } = require("./config.js");
const { getSubDir, getFiles } = require("./modules/functions.js");
const logger = require("./modules/logger.js");
const client = new Client({ intents, partials });

// this puts the commands, aliases and slash cmds in collections where they can be
// read from, catalogued, listed, etc whatever
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();


// generates a cache of client permission for premission names
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
    const thisLevel = permLevels[i];
    levelCache[thisLevel.name] = thisLevel.level;
};

// Container for deleted messages for Snipe commands
const snipes = {};
const editSnipes = {};
const reactionSnipes = {};

// a single container property which we can attach everything
// we need to reduce client pollution
client.container = {
    commands,
    aliases,
    slashcmds,
    levelCache,

    snipes,
    editSnipes,
    reactionSnipes
};

// fancy node 8 async/await function to wrap stuff in an anonymous function.
const init = async () => {

    // loads commands in "./commands" directory into memory as a collection so they are accessible here and everywhere else
    //const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
    const commands = getFiles("./commands").filter(item => item.endsWith(".js"));
    for (const file of commands) {
        const props = require(`./commands/${file}`);
        logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
        client.container.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.container.aliases.set(alias, props.help.name);
        });
    };

    // loads slash cmds in "./slash" directory
    //const slashFiles = readdirSync("./slash").filter(file => file.endsWith(".js"));
    const slashFiles = getFiles("./slash").filter(item => item.endsWith(".js"));
    for (const file of slashFiles) {
        const command = require(`./slash/${file}`);
        const commandName = file.split(".")[0];
        logger.log(`Loading Slash command: ${commandName}. 👌`, "log");

        // sets the name of the bot with its properties
        client.container.slashcmds.set(command.commandData.name, command);
    };

    // loads events in "./events" directory
    //const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
    const eventFiles = getFiles("./events").filter(item => item.endsWith(".js"));
    for (const file of eventFiles) {
        const eventName = file.split(".")[0];
        logger.log(`Loading Event: ${eventName}. 👌`, "log");
        const event = require(`./events/${file}`);
        // binds the client to any event, before the existing arguments
        client.on(eventName, event.bind(null, client));
    };

    // joins a thread everytime if it gets created, not required here for now ig
    // you can create a threadCreate.js file in ./events if you want to do stuff idk
    //client.on("threadCreate", (thread) => thread.join());

    // sets login timeout
    async function killBot() {
        console.error("Timelimit exceeded, login failed!");
        process.exit(1)
    };
    let timeout = setTimeout(killBot, 6000);

    // logins the client
    client.login(process.env.token);

    // Removes the timeout set for the login
    if (timeout) clearTimeout(timeout);
};

init();
