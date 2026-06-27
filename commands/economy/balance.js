const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUser } = require("../../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("View your current balance.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to check.")
                .setRequired(false)
        ),

    async execute(interaction) {

        const target =
            interaction.options.getUser("user") || interaction.user;

        const user = getUser(target.id);

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle("💰 Balance")
            .setDescription(
                `**${target.username}** currently has **${user.balance.toLocaleString()} Coins**.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
