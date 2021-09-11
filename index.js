const hosting = require('./modules/hosting.js')()
const { MessageAttachment, Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const fs = require('fs')
const commands = require('./modules/registerCommands.js')(client)
const funcs = require('./modules/funcs.js')

client.on('ready', () => {
	console.log('ready!')
	console.log(client.commands.map(cmd => cmd.data.name))

	updateStatus = setInterval(function() {
		funcs.statusInterval(client)
	}, 1000 * 30)
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return
	if (!client.commands.has(interaction.commandName)) return

	try {
		await client.commands.get(interaction.commandName).execute(interaction)
	}
	catch (error) {
		console.error(error)
		await interaction.reply({ content: 'Данной команды не существует!', ephemeral: true })
    }
})

client.on('messageCreate', async msg => {
	console.log(msg.content)
	if (msg.content === 'timer')
		await msg.reply('Чего?')
})

client.login(process.env.discordToken || require('./local.json').discordToken)