const GIFEncoder = require('gif-encoder-2')
const fs = require('fs')
const Canvas = require('canvas')
Canvas.registerFont('./source/fonts/Comfortaa-Bold.ttf', { family: 'Comfortaa-Bold'})
const gifFrames = require('gif-frames')
var config = require('../config.json')
const sleep = (duration = 0) => new Promise(resolve => setTimeout(resolve, duration))

function creatingFrames(bgFile)
{
	return new Promise(
		(resolve, reject) => {
			gifFrames(
				{ url: `./source/bages/available/${bgFile}`, frames: 'all', outputType: 'png', cumulative: true},
				function (err, frameData) {
					if (err)
						console.log(err)
					frameData.forEach( function (frame) {
						frame.getImage().pipe(fs.createWriteStream(`./source/bages/current/temp/image-${frame.frameIndex}.png`))
					})
				})
			console.log('p1')
		}
	)
}

function makeNSaveNewGif(map)
{
	return new Promise(
		async (resolve, reject) => {
			await sleep(1000)
			const width = 512, height = 128,
				canvas = Canvas.createCanvas(width, height),
				ctx = canvas.getContext('2d'),
				encoder = new GIFEncoder(width, height),
				rankPosition = config.bagesSettings[map.name].side,
            	rankImgSize = (rankPosition === "right") ? height : -height,
				name = map.name,
				statistic = `${map.mmr} MMR    ${map.rank}    ${map.kd} kd`,
				rankImg = await Canvas.loadImage(`./source/ranks/${map.rank}.svg`) || await Canvas.loadImage(`./source/ranks/No Rank.svg`),
				tOps = 'Top Operators',
				opIconsSize = 20,
				firstOp = await Canvas.loadImage(`./source/operators/${map.topOps[0].slice(map.topOps[0].lastIndexOf('/') + 1, map.topOps[0].lastIndexOf('.'))}.png`),
				secondOp = await Canvas.loadImage(`./source/operators/${map.topOps[1].slice(map.topOps[1].lastIndexOf('/') + 1, map.topOps[1].lastIndexOf('.'))}.png`),
				thirdOp = await Canvas.loadImage(`./source/operators/${map.topOps[2].slice(map.topOps[2].lastIndexOf('/') + 1, map.topOps[2].lastIndexOf('.'))}.png`)
			ctx.font = '20px Comfortaa-Bold'
			ctx.fillStyle = config.bagesSettings[map.name].color || config.bagesSettings.default.color

			let sorted = [],
				files = fs.readdirSync('./source/bages/current/temp').filter(file => file.endsWith('.png'))
			files.forEach((file, i) => sorted.push(file.replace(/\d+/, i)))
			files = sorted
			encoder.start()
			await sleep(2000)
			// await sleep(5000)
			for (let i of files)
			{
				const image = await Canvas.loadImage(`./source/bages/current/temp/${i}`)
				console.log(image)
				ctx.drawImage(image,0, 0, width, height)
				if (rankPosition == "right")
		            await ctx.drawImage(rankImg, width - rankImgSize, 0, rankImgSize, rankImgSize)
		        else if (rankPosition == "left")
		            await ctx.drawImage(rankImg, 0, 0, -rankImgSize, -rankImgSize)
				// Обводка текста
        		ctx.strokeStyle = config.bagesSettings[name].border || config.bagesSettings.default.border
        		ctx.strokeText(name, (width - rankImgSize ) / 2 - ctx.measureText(name).width / 2, 30)
        		ctx.strokeText(statistic, (width - rankImgSize) / 2 - ctx.measureText(statistic).width / 2, 60)
				ctx.strokeText(tOps, (width - rankImgSize) / 2 - ctx.measureText(tOps).width / 2, 90)
        		// Сам текст
				ctx.fillText(name, (width - rankImgSize) / 2 - ctx.measureText(name).width / 2, 30)
				ctx.fillText(statistic, (width - rankImgSize) / 2 - ctx.measureText(statistic).width / 2, 60)
				ctx.fillText(tOps, (width - rankImgSize) / 2 - ctx.measureText(tOps).width / 2, 90)
				ctx.drawImage(firstOp, (width - rankImgSize) / 2 - opIconsSize / 2 - 10 - opIconsSize, 100, opIconsSize, opIconsSize)
				ctx.drawImage(secondOp, (width - rankImgSize) / 2 - opIconsSize / 2, 100, opIconsSize, opIconsSize)
				ctx.drawImage(thirdOp, (width - rankImgSize) / 2 + opIconsSize / 2 + 10, 100, opIconsSize, opIconsSize)
				encoder.addFrame(ctx)
			}
			encoder.finish()
			console.log(encoder.out.getData())
			await sleep(1000)
			const buffer = await encoder.out.getData()
			fs.writeFileSync(`./source/bages/current/${map.name}.gif`, encoder.out.getData())
			console.log('p2')
		}
	)
}

function deleteTemp()
{
	return new Promise(
		async (resolve, reject) => {
			await sleep(4000)
			const files = fs.readdirSync('./source/bages/current/temp')
			files.forEach(file => fs.unlinkSync('./source/bages/current/temp/' + file))
			fs.rmdirSync('./source/bages/current/temp')
			console.log('p3')
		}
	)
}

function function4(msg)
{
	return new Promise(
		async (resolve, reject) => {
			await sleep(6000)
			await msg.reply({files: ['./source/bages/current/test.gif']})
			console.log('p5')
		}
	)
}

module.exports = async (map, bgFile) => {
	console.log('gif bg')
	fs.existsSync('./source/bages') || fs.mkdirSync('./source/bages')
	fs.existsSync('./source/bages/current') || fs.mkdirSync('./source/bages/current')
	fs.existsSync('./source/bages/current/temp') || fs.mkdirSync('./source/bages/current/temp')
	let p = creatingFrames(bgFile).then(makeNSaveNewGif(map)).then(deleteTemp())
	console.log('p4')
}

/*module.exports = (msg) => {
	fs.existsSync('./source/bages') || fs.mkdirSync('./source/bages')
	fs.existsSync('./source/bages/current') || fs.mkdirSync('./source/bages/current')
	fs.existsSync('./source/bages/current/temp') || fs.mkdirSync('./source/bages/current/temp')
	let p = creatingFrames().then(makeNSaveNewGif()).then(deleteTemp())
	console.log('p4')
}*/