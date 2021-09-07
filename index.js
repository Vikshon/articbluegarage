const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("Hello world!"));
app.listen(port, () => console.log(`Example app listening at https://localhost:${port}`));

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const token = 'ODc1MTM3NTQwMTQ1OTQyNTI4.YRRJWA.xksj6dprMIa-aZ6j94hdteQnx-g'

client.on('ready', () => {
	console.log('ready!')
})

client.on('messageCreate', async msg => {
	console.log(msg.content)
	if (msg.content === "heroku")
		msg.reply("shit")
})

client.login(token)