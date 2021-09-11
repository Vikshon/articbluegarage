const hosting = require('./modules/hosting.js')()
const { MessageAttachment, Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const fs = require('fs')
const commands = require('./modules/registerCommands.js')(client)
const config = require('./config.json')
const funcs = require('./modules/funcs.js')

client.on('ready', () => {
	console.log('ready!')
	console.log(client.commands.map(cmd => cmd.data.name))

	funcs.statusInterval(client)

	updateStatus = setInterval(function() {
		funcs.statusInterval(client)
	}, 1000 * 60 * 5)
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

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return
    let userId = interaction.user.id
	let customId = interaction.customId.slice(0, interaction.customId.lastIndexOf('.'))
    for (let i in config.bagesSettings)
    {
        if (config.bagesSettings[i].id === userId)

            config.bagesSettings[i].bg = customId
    }
    let count = await fs.readdirSync('./source/bages/available').length
    console.log(count);
    const channel = interaction.channel
    let messages = await channel.messages.fetch({limit: count + 1})
    await channel.bulkDelete(messages)
    fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'))
    funcs.statusInterval(client)
    await interaction.reply({content: `Вы успешно поменяли фон на ${customId}`, ephemeral: true})
})

client.on('messageCreate', async msg => {
	console.log(msg.content)
	if (msg.content === 'timer')
		await msg.reply('Чего?')
})

client.login(process.env.discordToken || require('./local.json').discordToken)