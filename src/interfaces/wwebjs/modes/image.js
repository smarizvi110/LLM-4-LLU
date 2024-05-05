const config = require("../config.json");
const fs = require("fs");
const { MessageMedia } = require('whatsapp-web.js');

module.exports.run = async (msg, client, bot) => {
    const filename = msg.id.id;
    const img = await msg.downloadMedia();

    let buffer = Buffer.from(img.data, 'base64');
    fs.writeFileSync(`${config.dataDir}${filename}.png`, buffer);

    const data = {
        type: "image",
        filename: `${filename}.png`,
        fullpath: `${config.dataDir}${filename}.png`
    }

    return data;
}

module.exports.respond = async (msg, client, bot, responseData) => {
    const filename = responseData.filename;
    const media = MessageMedia.fromFilePath(`${config.dataDir}${filename}`);
    const response = await msg.reply(media, msg.from);
    return response;
}

module.exports.desc = {
    name: "image",
    aliases: [],
}
