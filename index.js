require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.commands = new Collection();

const commandFolders = path.join(__dirname, "commands");

if (fs.existsSync(commandFolders)) {
    const folders = fs.readdirSync(commandFolders);

    for (const folder of folders) {
        const folderPath = path.join(commandFolders, folder);

        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
            }
        }
    }
}

client.once("ready", () => {
    console.log(`${client.user.tag} is online.`);
});

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {

        console.error(error);

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp({
                content: "There was an error while executing this command.",
                ephemeral: true
            });

        } else {

            await interaction.reply({
                content: "There was an error while executing this command.",
                ephemeral: true
            });

        }
    }

});

client.login(process.env.TOKEN);
