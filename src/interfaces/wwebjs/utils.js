const config = require("./config.json");
const fs = require("fs");

const randomDelay = function(min, max) {
    return Math.round(min*1000+(Math.random()*(max-min)*1000));
}

const naturalDelay = async function(bot={processCount: 0}, min=config.naturalDelay.min, max=config.naturalDelay.max, silent=false) {
    return new Promise(resolve => {
        const delay = randomDelay(min, max)*bot.processCount;
        const process = bot.processCount;
        if (!silent) console.log(`(Process ${process}) Starting ${delay}ms delay...`);
        bot.processHistory.push([Date.now(), bot.processCount]);
        setTimeout(() => {
            if (!silent) console.log(`(Process ${process}) Finished ${delay}ms delay!`);
            bot.processCount--;
            bot.processHistory.push([Date.now(), bot.processCount]);
            if (bot.processCount < 0) bot.processCount = 0;
            resolve();
        }, delay);
    });
}

const price = function(usd, pkr=usd*280, displayUsd=false) {
    return `*Price:* $${displayUsd ? usd.toFixed(2) + " ≈" : ""} ₨ ${pkr.toFixed(2)}`
}

const bot = {
    modes: null,
    processCount: 0,
    processHistory: [],
    botMessages: [],
    
    loadModes: null,
}

bot.loadModes = function() {
    bot.modes = new Map();
    fs.readdir("./modes/", (err, files) => {
        if (err) return console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() == "js");

        if (jsfile.length <= 0) return console.log("No modes were discovered.");
        jsfile.forEach((f, i) => {
            delete require.cache[require.resolve(`./modes/${f}`)]
            let props = require(`./modes/${f}`);
            console.log(`[${i+1}] ${f} was discovered.`);
            bot.modes.set(props.desc.name, props);
            props.desc.aliases.forEach(name => bot.modes.set(name, props));
        });
    });
}

module.exports = {
    naturalDelay,
    price,
    bot
}
