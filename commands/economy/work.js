const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("../../config.json");
const {
    addMoney
} = require("../../database/database");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn some coins."),

    async execute(interaction) {

        const amount =
            Math.floor(
                Math.random() *
                (config.workMax - config.workMin + 1)
            ) + config.workMin;

        addMoney(interaction.user.id, amount);

        const jobs = [
            "programming a Discord bot",
            "washing cars",
            "delivering pizza",
            "working at a coffee shop",
            "cleaning windows",
            "walking dogs",
            "fixing computers",
            "streaming games",
            "doing freelance design",
            "helping a local business"
        ];

        const job =
            jobs[Math.floor(Math.random() * jobs.length)];

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("💼 Work")
            .setDescription(
                `You earned **${amount.toLocaleString()} Coins** by **${job}**.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};
