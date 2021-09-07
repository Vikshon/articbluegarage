const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("Hello world!"));
app.listen(port, () => console.log(`Example app listening at https://localhost:${port}`));

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.on('ready', () => {
	console.log('ready!')
})

client.on('messageCreate', async msg => {
	console.log(msg.content)
	if (msg.content === "heroku")
		msg.reply("shit")
})

client.login(process.env.discordToken)