const config = require("../config.json");
const fs = require("fs");

module.exports.run = async (msg, client, bot) => {
    console.log("[!] Running chat mode procedure");

    return;
}

module.exports.respond = async (msg, client, bot, responseData) => {
    console.log("[!] Running response procedure");

    msg.reply("sample response");

    return;
}

module.exports.desc = {
    name: "chat",
    aliases: [],
}
