const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { getUser } = require("../../database/database");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("View your balance.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to check")
        ),

    async execute(interaction) {

        const target =
            interaction.options.getUser("user") ||
            interaction.user;

        const user = getUser(target.id);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("💰 Balance")
            .addFields(
                {
                    name: "Wallet",
                    value: `${user.balance.toLocaleString()} Coins`,
                    inline: true
                },
                {
                    name: "Bank",
                    value: `${user.bank.toLocaleString()} Coins`,
                    inline: true
                }
            )
            .setFooter({
                text: target.username
            });

        await interaction.reply({
            embeds: [embed]
        });

    }

};
