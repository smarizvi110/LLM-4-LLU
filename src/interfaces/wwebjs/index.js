console.log("LLM-4-LLU • WhatsApp Interface");
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

let clientConfig = { authStrategy: new LocalAuth() };
clientConfig.puppeteer = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
// Hotfix for the latest WhatsApp Web version
clientConfig.webVersionCache = {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
};

const client = new Client(clientConfig);

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.initialize();
