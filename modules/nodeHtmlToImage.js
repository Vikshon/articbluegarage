const { MessageAttachment } = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image')

module.exports = async msg => {
	const _htmlTemplate = `<!doctype html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body {
                    max-width: 300px;
                    background-color: red;
                    color: white;
                }
                .wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <h4>Hello world!</h4>
            </div>
        </body>
    </html>`
    
	const image = await nodeHtmlToImage({
		html: _htmlTemplate,
		type: 'jpeg',
		puppeteerArgs: {
	      args: ['--no-sandbox'],
	    },
	    encoding: 'buffer',
	})

	return msg.channel.send({files: [new MessageAttachment(image)]})
}