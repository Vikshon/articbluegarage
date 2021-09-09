const GIFEncoder = require('gif-encoder-2')
const fs = require('fs')
const Canvas = require('canvas')
Canvas.registerFont('./source/Comfortaa-Regular.ttf', { family: 'Comfortaa-Regular'});
const gifFrames = require('gif-frames')
const sleep = (duration = 0) => new Promise(resolve => setTimeout(resolve, duration));

function function1()
{
	return new Promise(
		(resolve, reject) => {
			gifFrames(
				{ url: './ui.gif', frames: 'all', outputType: 'png', cumulative: true},
				function (err, frameData) {
					if (err)
						console.log(err)
					frameData.forEach( function (frame) {
						frame.getImage().pipe(fs.createWriteStream(`./source/currentBages/image-${frame.frameIndex}.png`))
					})
				})
			console.log('p1')
		}
	)
}

function function2()
{
	return new Promise(
		async (resolve, reject) => {
			await sleep(1000)
			const width = 512, height = 128
				canvas = Canvas.createCanvas(width, height)
				ctx = canvas.getContext('2d')
				ctx.font = '20px Comfortaa-Regular';
				ctx.fillStyle = 'black'
				text = "Peshka07_GS"
				encoder = new GIFEncoder(width, height)
			// const files = fs.readdir()
				files = fs.readdirSync('./source/currentBages').filter(file => file.endsWith('.png'))
				sorted = []
			files.forEach((file, i) => sorted.push(file.replace(/\d+/, i)))
			files = sorted;
			console.log(files)
			encoder.start()
			// await sleep(2000)
			await sleep(5000)
			for (let i of files)
			{
				const image = await Canvas.loadImage(`./source/currentBages/${i}`)
				console.log(image)
				ctx.drawImage(image,0,0,canvas.width,canvas.height)
				ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2)
				encoder.addFrame(ctx)
			}
			encoder.finish()
			console.log(encoder.out.getData())
			await sleep(6000)
			const buffer = await encoder.out.getData()
			fs.writeFileSync('./source/currentBages/test.gif', encoder.out.getData())
			console.log('p2')
		}
	)
}

function function3()
{
	return new Promise(
		async (resolve, reject) => {
			await sleep(4000)
			const files = fs.readdirSync('./source/currentBages')
			files.forEach(file => fs.unlinkSync('./source/currentBages/' + file))
			console.log('p3')
		}
	)
}

function function4(msg)
{
	return new Promise(
		async (resolve, reject) => {
			await sleep(6000)
			await msg.reply({files: ['./source/currentBages/test.gif']})
			console.log('p5')
		}
	)
}

module.exports = (msg) => {
	let p = function1().then(function2())
	// p1.then(p2).then(p3)
	console.log('p4')
}

/*async function createFiles()
{
	const path = './source/currentBages/'
	await gifFrames(
		{ url: './ui.gif', frames: 'all', outputType: 'png', cumulative: true},
		function (err, frameData) {
			if (err)
				console.log(err)
			frameData.forEach( function (frame) {
				frame.getImage().pipe(fs.createWriteStream(`${path}image-${frame.frameIndex}.png`))
			})
		})
	return path
}

async function getBuffer(path)
{
	const width = 512, height = 128
	const canvas = Canvas.createCanvas(width, height)
	const ctx = canvas.getContext('2d')
	const encoder = new GIFEncoder(width, height)
	const files = await fs.readdirSync(path).filter(file => file.endsWith('.png'))
	console.log(files)
	encoder.start()
	// await makeFor(canvas, ctx, files, path)
	// encoder.finish()
	// return encoder.out.getData();
}

async function makeFor(canvas, ctx, files, path)
{
	for (let i of files)
	{
		const image = await Canvas.loadImage(`${path}${i}`)
		ctx.drawImage(image,0,0,canvas.width,canvas.height)
		ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2)
		encoder.addFrame(ctx)
	}
}

module.exports = async () => {
	const path = await createFiles()
	const buffer = await getBuffer(path)
	console.log(path);
}*/