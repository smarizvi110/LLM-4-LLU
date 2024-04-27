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

    await client.sendMessage(msg.from, responeData.message);

    return;
}

module.exports.desc = {
    name: "chat",
    aliases: [],
}
