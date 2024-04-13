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

let clientConfig = { authStrategy: new LocalAuth() };
clientConfig.puppeteer = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
// Hotfix for the latest WhatsApp Web version
clientConfig.webVersionCache = {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
};

const client = new Client(clientConfig);

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

    console.log("[!] Received potential message")
});

client.initialize();
