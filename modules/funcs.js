const { MessageAttachment, Client} = require('discord.js')
const fs = require('fs')
const fetch = require('node-fetch')
const Canvas = require('canvas')
const config = require('../config.json')
const animateBage = require('./createBage.js')
Canvas.registerFont('./source/fonts/Comfortaa-Bold.ttf', { family: 'Comfortaa-Bold'})
const sleep = (duration = 0) => new Promise(resolve => setTimeout(resolve, duration))

async function statusInterval(client)
{
	try {
		const channel = client.channels.cache.get(config.channels.statusChannelId)
		let messages = await channel.messages.fetch({limit: 100})
		if (messages.size > 0)
			await channel.bulkDelete(messages)

		const nicknames = Object.keys(config.bagesSettings).filter(key => key != "default").sort()
		let map = new Map()
		for (let i = 0; i < nicknames.length; i++)
		{
			map.set(nicknames[i], await getStats(nicknames[i]))
			let attachment = await makeCanvas(map.get(nicknames[i]), nicknames[i])
            let at = new MessageAttachment('./source/bages/current/' + nicknames[i] + attachment)
            await client.channels.cache.get(config.channels.statusChannelId).send({ files: [at] })
		}

        // Плохой вариант, ведь если их станет больше...
        /*
            let at = []
            for (let i = 0; i < nicknames.length; i++)
            {
                map.set(nicknames[i], await getStats(nicknames[i]))
                let attachment = await makeCanvas(map.get(nicknames[i]), nicknames[i])
                // console.log(attachment)
                await sleep(8000)
                at.push(new MessageAttachment('./source/bages/current/' + nicknames[i] + attachment))
            }
            await client.channels.cache.get(config.channels.statusChannelId).send({ files: at })
        */
	}
	catch (e) {
		console.log(e)
	}
}

async function getStats(nick)
{
    const axios = require('axios')
    const cheerio = require('cheerio')
    const url = `https://r6.tracker.network/profile/pc/${nick}`

    let stats = await axios.get(url).then(async res => {
        let getData = async html => {
            let $ = await cheerio.load(html)
            let mmr = $('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(1) > div.trn-card__content.trn-card--light.pt8.pb8 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)').html()
            let rank = $('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(1) > div.trn-card__content.trn-card--light.pt8.pb8 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div.trn-text--dimmed').html()
            let kd = $('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card').html()
            let avatar = $('#profile > div.trn-profile-header > div > div.trn-profile-header__avatar.trn-roundavatar.trn-roundavatar--white').html()
            let rankImg = $('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(1) > div.trn-card__content.trn-card--light.pt8.pb8 > div > div:nth-child(1)').html()
            let top = $('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card').html()
            kd = kd.slice(kd.indexOf("KD") + 10)
            kd = kd.slice(kd.indexOf("\n") + 1, kd.indexOf("</div>") - 1)
            top = top.slice(top.indexOf("Top Operators"))
            top = top.slice(top.indexOf("<img"))
            top = top.slice(0, top.indexOf("</div>"))
            let ops = top.split(`\n`)
            for (let i = 0; i < ops.length; i++)
            {
                ops[i] = ops[i].slice(ops[i].indexOf("http"), ops[i].indexOf(".png\"") + 4)
            }
            ops.splice(3, 1)
            avatar = avatar.slice(avatar.indexOf("http"), avatar.indexOf("\">"))
            rankImg = rankImg.slice(rankImg.indexOf("http"), rankImg.indexOf("title") - 2)

            let temp = {
            	name: nick,
            	mmr: mmr,
            	rank: rank,
            	kd: kd,
            	avatar: avatar,
                rankImg: rankImg,
                topOps: ops
            }
            return temp
        }
        let stats = await getData(res.data)
        return stats
    })
    return stats
}

async function makeCanvas(map)
{
	const canvas = Canvas.createCanvas(512, 128)
	const ctx = canvas.getContext('2d')
    // Могут быть ошибки, тк '23' входит и в '123' и в '223' --> заменил includes на startsWith
    const bgFile = fs.readdirSync(`./source/bages/available`).filter(file => file.startsWith(`${config.bagesSettings[map.name].bg}.`))[0]
    const bgType = bgFile.slice(bgFile.lastIndexOf('.'), bgFile.length)
    const defaultBg = fs.readdirSync(`./source/bages/available`).filter(file => file.startsWith(`${config.bagesSettings.default.bg}.`))
    // Удаляем старые бейджи, при переходе с gif на png и тп.
    let old = fs.readdirSync(`./source/bages/current`).filter(file => file.startsWith(`${map.name}.`))
    for (let i of old)
        fs.unlinkSync(`./source/bages/current/${i}`)
    // Подгружаем ресурсы
    await loadSources(map)
    await sleep(1000)
    if (bgType == ".gif")
    {
        await animateBage(map, bgFile)
        await sleep(13000)
    }
    else
    {
        const width = 512, height = 128,
            canvas = Canvas.createCanvas(width, height),
            ctx = canvas.getContext('2d'),
            bg = await Canvas.loadImage(`./source/bages/available/${bgFile}` || `./source/bages/available/${defaultBg}`),
            rankImg = await Canvas.loadImage(`./source/ranks/${map.rank}.svg`),
            rankPosition = config.bagesSettings[map.name].side,
            rankImgSize = (rankPosition === "right") ? height : -height,
            name = map.name,
            statistic = `${map.mmr} MMR    ${map.rank}    ${map.kd} kd`,
            tOps = 'Top Operators',
            opIconsSize = 20,
            firstOp = await Canvas.loadImage(`./source/operators/${map.topOps[0].slice(map.topOps[0].lastIndexOf('/') + 1, map.topOps[0].lastIndexOf('.'))}.png`),
            secondOp = await Canvas.loadImage(`./source/operators/${map.topOps[1].slice(map.topOps[1].lastIndexOf('/') + 1, map.topOps[1].lastIndexOf('.'))}.png`),
            thirdOp = await Canvas.loadImage(`./source/operators/${map.topOps[2].slice(map.topOps[2].lastIndexOf('/') + 1, map.topOps[2].lastIndexOf('.'))}.png`)

        ctx.drawImage(bg, 0, 0, width, height)
        // Вставляем ранг
        if (rankPosition == "right")
            await ctx.drawImage(rankImg, width - rankImgSize, 0, rankImgSize, rankImgSize)
        else if (rankPosition == "left")
            await ctx.drawImage(rankImg, 0, 0, -rankImgSize, -rankImgSize)
        // Настройка текста
        ctx.font = '20px Comfortaa-Bold'
        ctx.fillStyle = config.bagesSettings[name].color || config.bagesSettings.default.color
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

        // Аватарку можно вставить
        await fs.writeFileSync(`./source/bages/current/${map.name}${bgType}`, canvas.toBuffer())
    }
    // let at = new MessageAttachment(canvas.toBuffer(), `${map.name}-profile-image`)
    return bgType
}

async function loadSources(map)
{
    if (!fs.existsSync(`./source/ranks/${map.rank}.svg`))
        await fetch(map.rankImg).then(res => res.body.pipe(fs.createWriteStream(`./source/ranks/${map.rank}.svg`)))
    if (!fs.existsSync(`./source/avatars/${map.name}.png`))
        await fetch(map.avatar).then(res => res.body.pipe(fs.createWriteStream(`./source/avatars/${map.name}.png`)))
    for (let i of map.topOps)
    {
        let opName = i.slice(i.lastIndexOf('/') + 1, i.lastIndexOf('.'))
        if (!fs.existsSync(`./source/operators/${opName}.png`))
            await fetch(i).then(res => res.body.pipe(fs.createWriteStream(`./source/operators/${opName}.png`)))
    }
}

function generateName({_min = 1, _max = 100})
{
    let files = fs.readdirSync(`./source/bages/available`), rNum, name
    do
    {
        rNum = getRandom({min: _min, max: _max})
        name = `ui_membercard_${rNum}`
        files = fs.readdirSync(`./source/bages/available`).filter(file => file.startsWith(`${name}.`))
    } while(files.length > 0)
    return name
}

function getRandom({min = 0, max = 10})
{
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
	statusInterval,
    generateName,
    getRandom
}