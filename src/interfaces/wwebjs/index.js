console.log("LLM-4-LLU • WhatsApp Interface")

const { Client } = require('whatsapp-web.js');

const client = new Client();

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.initialize();
