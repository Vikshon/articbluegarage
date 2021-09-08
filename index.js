const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.get('/', (req, res) => res.send("Hello world"))
app.listen(port, () => console.log(`Example app listening at https://localhost:${port}`))

const { MessageAttachment, Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const fs = require('fs')

client.on('ready', () => {
	console.log('ready!')
})

client.on('messageCreate', async msg => {
	console.log(msg.content)
	/*if (msg.content === "heroku") {
		// msg.reply('test')
		require('./modules/nodeHtmlToImage.js')(msg)
	}
	else if (msg.content === "canvas") {
		// let ops = require('./modules/canvas.js')
		// await ops.getFrames()
		// let buffer = await ops.makeGif()
		require('./modules/canvas.js')(msg)
	}*/
	if (msg.content === "another")
		await msg.reply('Я тебя не понял')
})

client.login(process.env.discordToken || require('./config.json').discordToken)