const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Удаляет сообщения')
		.addIntegerOption(option => option.setName('количество').setDescription('Сколько сообщений удалить').setRequired(true)),
	async execute(interaction) {
        if (interaction.member.user.id != ("218398638211203073" || "337641880995102721"))
        {
            interaction.reply({content: "У вас недостаточно прав.", ephemeral: true});
            return;
        }
		let count = await interaction.options.getInteger('количество');
		const toDelete = await interaction.channel.messages.fetch({limit: count});
		await interaction.channel.bulkDelete(toDelete);
		await interaction.reply({content: "Сообщения удалены.", ephemeral: true});
	},
};