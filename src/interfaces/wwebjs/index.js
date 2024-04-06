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

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.initialize();
