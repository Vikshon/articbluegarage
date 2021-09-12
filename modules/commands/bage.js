const { MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const fs = require('fs');
var config = require('../../config.json')
const fetch = require('node-fetch')
const { generateName } = require('../funcs.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bage')
		.setDescription('bage description')
        .addSubcommandGroup(scg => 
            scg
                .setName('list')
                .setDescription('Описание')
                .addSubcommand(sc =>
                    sc
                        .setName('show')
                        .setDescription('Выводит список доступных фонов'))
                .addSubcommand(sc =>
                    sc
                        .setName('add')
                        .setDescription('Добавляет фон в список')
                        .addStringOption(option =>
                            option
                                .setName('ссылка')
                                .setDescription('Ссылка на картинку (png/jpg/gif)')
                                .setRequired(true))
                )
        )
        .addSubcommandGroup(scg => 
            scg
                .setName('set')
                .setDescription('Описание')
                .addSubcommand(sc =>
                    sc
                        .setName('color')
                        .setDescription('Устанавливает цвет текста')
                        .addStringOption(option =>
                            option
                                .setName('цвет')
                                .setDescription('Цвет текста (на английском)')
                                .setRequired(true)))
                .addSubcommand(sc =>
                    sc
                        .setName('border')
                        .setDescription('Устанавливает цвет обводки')
                        .addStringOption(option =>
                            option
                                .setName('цвет')
                                .setDescription('Цвет обводки текста (на английском)')
                                .setRequired(true)))
                .addSubcommand(sc =>
                    sc
                        .setName('side')
                        .setDescription('С какой стороны расположить изображение ранга')
                        .addStringOption(option =>
                            option
                                .setName('сторона')
                                .setDescription('Цвет текста (на английском)')
                                .setRequired(true)
                                .addChoice('left', 'left')
                                .addChoice('right', 'right')))
        ),
	async execute(interaction) {
        if (interaction.options.getSubcommandGroup() === "list")
        {
            if (interaction.options.getSubcommand() === "show")
            {
                if (!fs.existsSync('./source/bages/available') || fs.readdirSync('./source/bages/available').length < 1)
                    return interaction.reply("Список фонов пуст")
                const bages = fs.readdirSync('./source/bages/available')
                await interaction.reply({content: "Список доступных фонов:"})
                for (let i of bages)
                {
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(i)
                                .setLabel('Выбрать')
                                .setStyle('PRIMARY'),
                        )
                    await interaction.channel.send({content: i.slice(0, i.lastIndexOf('.')), files: [`./source/bages/available/${i}`], components: [row]})
                }
            }
            else if (interaction.options.getSubcommand() === "add")
            {
                let name = await generateName({max: 999999})
                let url = interaction.options.getString('ссылка')
                let type
                if (url.includes('.gif'))
                    type = '.gif'
                else if (url.includes('.png'))
                    type =  '.png'
                else if (url.includes('.jpg'))
                    type = '.jpg'
                else if (url.includes('.jpeg'))
                    type = '.jpeg'
                else
                    return await interaction.reply({content: 'Некорректная ссылка! Ссылка содержит .gif / .png / .jpg / .jpeg ?', ephemeral: true});
                await fetch(url).then(res => res.body.pipe(fs.createWriteStream(`./source/bages/available/${name}${type}`)))
                await interaction.reply({content: `Фон ${name} успешно добавлен.`, ephemeral: true})
            }
        }
        else if (interaction.options.getSubcommandGroup() === "set")
        {
            if (interaction.options.getSubcommand() === "color")
            {
                let color = interaction.options.getString('цвет')
                console.log(color)
                let userId = interaction.user.id;
                for (let i in config.bagesSettings)
                {
                    if (config.bagesSettings[i].id === userId)
                        config.bagesSettings[i].color = color;
                }
                fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
                await interaction.reply({content: `Вы установили цвет текста на ${color}.`, ephemeral: true})
                // Обновляем
                funcs.statusInterval()
            }
            else if (interaction.options.getSubcommand() === "border")
            {
                let color = await interaction.options.getString('цвет')
                let userId = interaction.user.id;
                for (let i in config.bagesSettings)
                {
                    if (config.bagesSettings[i].id === userId)
                        config.bagesSettings[i].border = color;
                }
                fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
                await interaction.reply({content: `Вы установили цвет рамки на ${color}.`, ephemeral: true})
                // Обновляем
                funcs.statusInterval()
            }
            else if (interaction.options.getSubcommand() === "side")
            {
                let _side = interaction.options.getString('сторона')
                let userId = interaction.user.id
                for (let i in config.bagesSettings)
                {
                    if (config.bagesSettings[i].id === userId)
                        config.bagesSettings[i].side = _side
                }
                fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
                await interaction.reply({content: `Вы изменили сторону изображения ранга на ${_side}.`, ephemeral: true})
                // Обновляем
                funcs.statusInterval()
            }
        }
	},
};