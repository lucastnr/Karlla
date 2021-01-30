const fs = require('fs');
const discord = require('discord.js');

const play = require('./on-message-commands/play')
const skip = require('./on-message-commands/skip')

const getUser = require('./services/get-user')

const client = new discord.Client({ disableMentions: 'everyone' });

const { Player } = require('discord-player');

client.player = new Player(client);
client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.filters = client.config.filters;
client.commands = new discord.Collection();

client.on('message', async (message) => {
    const content = message.content;

    if (!message.author.bot) return;

    
    if (content.includes('#play')) {
        message.author = await getUser(message, 'play');
        return await play(message, client);
    }
    
    else if (content.includes('#skip')) {
        message.author = await getUser(message, 'skip');
        return await skip(message, client);
    }

    else if (content.includes('#stop')) {
        message.author = await getUser(message, 'stop');
        return await skip(message, client);
    }

});

fs.readdirSync('./commands').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`Loading command ${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
});

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));

for (const file of events) {
    console.log(`Loading discord.js event ${file}`);
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
};

for (const file of player) {
    console.log(`Loading discord-player event ${file}`);
    const event = require(`./player/${file}`);
    client.player.on(file.split(".")[0], event.bind(null, client));
};

client.login(client.config.discord.token);