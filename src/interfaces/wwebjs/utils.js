const config = require("./config.json");
const fs = require("fs");

const bot = {
    modes: null,
    processCount: 0,
    processHistory: [],
    
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
            let mod = `${i+1}. *${config.prefix}${props.desc.name}* ${props.desc.args}`.trim();
            if (!config.enabled_modes.includes("*") && !config.enabled_modes.includes(props.desc.name)) mod = `~${mod}~`;
        });
    });
}

module.exports = {
    bot
}
