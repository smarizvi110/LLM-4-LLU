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
console.log("\n");

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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
    sender_num = msg.author ? msg.author : msg.from;
    sender_num = sender_num.match(/(\d+)/g)[0];

    console.log("[!] Received message from " + sender_num);
    console.log("\t- Content: " + msg.body);
    console.log("\t- Type: " + msg.type);
    console.log("\t- Timestamp: " + msg.timestamp);

    if ((config.whitelist.length && !config.whitelist.includes(msg.sender_num))) return;

    if (msg.body == "!reload" && config.admins.includes(sender_num)) {
        bot.processCount = 1;
        delete require.cache[require.resolve("./config.json")];
        delete require.cache[require.resolve("./utils.js")];
        delete require.cache[require.resolve("./ai.js")];
        config = require("./config.json");
        utils = require("./utils.js");

        await Promise.all([
            bot.loadCommands(),
            utils.naturalDelay(bot, 1, 2),
            msg.react('✅')
        ]);

        return;
    }

    console.log("[!] Received potential message")

    let modeProcedure = bot.modes.get(msg.type);
    if (!modeProcedure) return;

    console.log("[!] Mode procedure found")
    bot.processCount++;
    await utils.naturalDelay(bot);
    modeProcedure.run(msg, client, bot);
    console.log("[!] Mode procedure executed")
});

bot.loadModes();
client.initialize();
