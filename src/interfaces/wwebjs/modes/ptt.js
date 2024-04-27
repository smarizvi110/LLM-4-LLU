const config = require("../config.json");
const fs = require("fs");
const child_process = require('child_process');
const { MessageMedia } = require('whatsapp-web.js');

module.exports.run = async (msg, client, bot) => {
    const filename = msg.id.id;
    const vn = await msg.downloadMedia();

    let buffer = Buffer.from(vn.data, 'base64');
    fs.writeFileSync(`${config.dataDir}${filename}.ogg`, buffer);
    child_process.execSync(`ffmpeg -i ${config.dataDir}${filename}.ogg -acodec libmp3lame ${config.dataDir}${filename}.mp3`);

    const data = {
        type: "ptt",
        filename: `${filename}.mp3`,
        fullpath: `${config.dataDir}${filename}.mp3`
    }

    return data;
}

module.exports.respond = async (msg, client, bot, responseData) => {
    const filename = responseData.filename;
    const media = MessageMedia.fromFilePath(`${config.dataDir}${filename}`);
    const response = await msg.reply(media, msg.from, { sendAudioAsVoice: true });
    bot.messageHistory.push(response.id.id);
    return;
}

module.exports.desc = {
    name: "ptt",
    aliases: [],
}
