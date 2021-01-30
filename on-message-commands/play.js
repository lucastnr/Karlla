

const removeTillSpace = (content) => {
    return content.substr(content.indexOf(" ") + 1);
}

module.exports = async (message, client) => {    
    const content = message.content;

    const arg = removeTillSpace(content);
    console.log(arg)
    client.player.play(message, arg, { firstResult: true });
}