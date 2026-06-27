require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");

const loadCommands = require("./handlers/commandHandler");
const readyEvent = require("./events/ready");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

loadCommands(client);

client.once("ready", () => readyEvent(client));

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction);

    } catch (err) {

        console.error(err);

        if (interaction.replied || interaction.deferred) {

            interaction.followUp({
                content: "Something went wrong.",
                ephemeral: true
            });

        } else {

            interaction.reply({
                content: "Something went wrong.",
                ephemeral: true
            });

        }

    }

});

client.login(process.env.TOKEN);
