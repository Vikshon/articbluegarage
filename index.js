const hosting = require('./modules/hosting.js')()
const { MessageAttachment, Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const fs = require('fs')

client.on('ready', () => {
	console.log('ready!')
})

client.on('messageCreate', async msg => {
	console.log(msg.content)
	if (msg.content === "heroku") {
		require('./modules/nodeHtmlToImage.js')(msg)
	}
	else if (msg.content === "canvas") {
		// let ops = require('./modules/canvas.js')
		// await ops.getFrames()
		// let buffer = await ops.makeGif()
		require('./modules/canvas.js')(msg)
	}
	else if (msg.content === "an")
	{
		require('./modules/bages.js')(msg)
		// require('./modules/bagesHandler.js')()
		// await msg.reply('Я тебя не понял')
	}
})

client.login(process.env.discordToken || require('./local.json').discordToken)