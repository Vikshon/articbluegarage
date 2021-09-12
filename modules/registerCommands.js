const { Collection } = require('discord.js')
const fs = require("fs")
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const rest = new REST({ version: '9' }).setToken(process.env.discordToken || require('../local.json').discordToken)
const clientId = '875137540145942528', guildId = '638442661593874465'

module.exports = client => {
	const commandFiles = fs.readdirSync('./modules/commands').filter(file => file.endsWith('.js'))
	const commands = []//регистрация
	client.commands = new Collection()//ещё одна??

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`)
		// Для регистрации команды
		commands.push(command.data.toJSON())
		// Для коллектора команд
		client.commands.set(command.data.name, command)
	}
	// console.log(commands);

	(async () => {
		try
		{
			console.log('Started refreshing application (/) commands.')

			// for a guild -->
			/*await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
	    	)*/

			//global -->
			await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			)

			console.log('Successfully reloaded application (/) commands.')
		} 
		catch (error)
		{
			console.error(error)
		}
	})()
}