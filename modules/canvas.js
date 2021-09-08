const { MessageAttachment } = require('discord.js');
const GIFEncoder = require('gif-encoder-2')
const fs = require('fs')
const Canvas = require('canvas')
Canvas.registerFont('./source/Comfortaa-Regular.ttf', { family: 'Comfortaa-Regular'});
const gifFrames = require('gif-frames');

module.exports = async msg => {
	const width = 512, height = 128
	const canvas = Canvas.createCanvas(width, height)
	const ctx = canvas.getContext('2d')
	ctx.font = '20px Comfortaa-Regular';
	ctx.fillStyle = 'black'
	const colors = ['blue', 'red', 'yellow']
	const files = fs.readdirSync('./testFrames')
	// files.forEach(file => inds.push(parseInt(file.match(/\d+/)[0])))
	// files.forEach((file, i) => file.replace(/\d+/, i))
	const sorted = []
	files.forEach((file, i) => sorted.push(file.replace(/\d+/, i)))

	const text = 'здарова нахуй'
	const encoder = new GIFEncoder(width, height)
	encoder.start()
	for (let i of sorted)
	{
		const image = await Canvas.loadImage('./testFrames/'+i)
		ctx.drawImage(image,0,0,canvas.width,canvas.height)
		ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2)
		encoder.addFrame(ctx)
	}
	/*for (let i of colors)
	{
		ctx.fillStyle = i
		ctx.fillRect(0,0,canvas.width, canvas.height)
		encoder.addFrame(ctx)
	}*/
	encoder.finish()
	const buffer = await encoder.out.getData()
	fs.writeFileSync('./test.gif', buffer)
	return msg.channel.send({files: ['./test.gif']})
}

/*module.exports = async msg => {
	gifFrames(
		{ url: './ui.gif', frames: 'all', cumulative: true},
		function (err, frameData) {
			if (err)
				console.log(err)
			frameData.forEach( function (frame) {
				frame.getImage().pipe(fs.createWriteStream('./testFrames/image-' + frame.frameIndex + '.jpg'))
			})
		})
}*/	

async function getFrames()
{
	await gifFrames(
		{ url: './ui.gif', frames: 'all', cumulative: true},
		function (err, frameData) {
			if (err)
				console.log(err)
			frameData.forEach( function (frame) {
				frame.getImage().pipe(fs.createWriteStream('./testFrames/image-' + frame.frameIndex + '.jpg'))
			})
		})
}

/*module.exports = async msg => {
	const width = 512, height = 128
	const canvas = Canvas.createCanvas(width, height)
	const ctx = canvas.getContext('2d')
	const encoder = new GIFEncoder(width, height)
	const files = fs.readdirSync('./testFrames')
	let colors = ['green', 'red', 'blue']
	for (let i of colors)
	{
		ctx.fillStyle = i
		ctx.fillRect(0,0,width,height)
		encoder.addFrame(ctx)
	}
	encoder.finish()
	const buffer = await encoder.out.getData()
	fs.writeFileSync('./test.gif', buffer)
}*/