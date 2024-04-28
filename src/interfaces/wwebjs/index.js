console.log("LLM-4-LLU • WhatsApp Interface v0.0.1");
console.log("\nCopyright (C) 2024");
[
    "Amina Waheed",
    "Danish Humair",
    "Shabbir Kamal",
    "Shayan Ali Hassan",
    "Syed Muhammad Aqdas Rizvi",
    "Umy Habiba"
].forEach((name, index) => {
    console.log(`- ${name}`);
});
console.log();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

let config = require("./config.json");
let utils = require("./utils.js");

let clientConfig = { authStrategy: new LocalAuth() };
clientConfig.puppeteer = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
// Hotfix for the latest WhatsApp Web version
clientConfig.webVersionCache = {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
};

const client = new Client(clientConfig);
const bot = utils.bot;

client.on('ready', () => {
    console.log("[!] Client is ready!");
});

client.on('qr', qr => {
    console.log("Please scan the following QR code to authenticate:")
    qrcode.generate(qr, {small: true});
});

client.on('message_create', async msg => {
    // utils.naturalDelay(bot, 1, 2);
    // console.log(bot.messageHistory, msg.id.id);
    // if (bot.messageHistory.includes(msg.id.id)) return;

    // if ((await msg.getChat()).isGroup) return;

    sender_num = msg.author ? msg.author : msg.from;
    sender_num = sender_num.match(/(\d+)/g)[0];

    const chat = await msg.getChat();

    console.log("[!] Received message from " + sender_num);
    console.log("\t- Chat ID: " + chat.name);
    console.log("\t- Content: " + msg.body);
    console.log("\t- Type: " + msg.type);
    console.log("\t- Timestamp: " + msg.timestamp);

    if (!chat.isGroup && config.whitelist.length && !config.whitelist.includes(sender_num)) return;
    if (chat.isGroup && config.whitelist.length && !config.whitelist.includes(chat.name)) return;

    if (msg.fromMe) return;

    if (msg.body == "!reload" && config.admins.includes(sender_num)) {
        bot.processCount = 1;
        delete require.cache[require.resolve("./config.json")];
        delete require.cache[require.resolve("./utils.js")];
        config = require("./config.json");
        utils = require("./utils.js");

        await Promise.all([
            bot.loadModes(),
            utils.naturalDelay(bot, 1, 2),
            msg.react('✅')
        ]);

        return;
    }

    console.log("[!] Received potential message");

    let modeProcedure = bot.modes.get(msg.type);
    if (!modeProcedure) return;

    console.log("[!] Mode procedure found");
    bot.processCount++;
    await utils.naturalDelay(bot);
    const request = await modeProcedure.run(msg, client, bot);
    console.log("[!] Mode procedure executed");

    if (!request) return;

    console.log("[!] Request detected");
    try {
        const response = await axios.post(config.backend + "get_response", {
            platform: 'whatsapp',
            userId: sender_num,
            chatId: chat.isGroup ? chat.name : sender_num,
            timestamp: Date.now(),
            type: msg.type,
            ...request
        });
        
        let responseProcedure = bot.modes.get(response.data.type);
        if (!responseProcedure) return;

        console.log("[!] Response procedure found");
        bot.processCount++;
        await utils.naturalDelay(bot);
        await responseProcedure.respond(msg, client, bot, response.data);
        console.log("[!] Response procedure executed");
    }
    
    catch (error) {
        console.log("[!] Error trying to get response:\n" + error);
        await utils.naturalDelay(bot, 1, 2);
        msg.react('⚠️');
        return;
    }
});

bot.loadModes();
client.initialize();
