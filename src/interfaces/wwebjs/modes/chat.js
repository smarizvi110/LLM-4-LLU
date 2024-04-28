const config = require("../config.json");
const fs = require("fs");

module.exports.run = async (msg, client, bot) => {
    console.log("[!] Running chat mode procedure");

    const data = {
        type: "chat",
        message: msg.body
    }

    return data;
}

module.exports.respond = async (msg, client, bot, responseData) => {
    console.log("[!] Running response procedure");

    const response = await client.sendMessage(msg.from, responseData.message);
    bot.messageHistory.push(response.id.id);

    return;
}

module.exports.desc = {
    name: "chat",
    aliases: [],
}
