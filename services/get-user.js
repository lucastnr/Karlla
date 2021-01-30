const lucasId = '261704533510455296'
const pedroId = '325765727548342282'

module.exports = async (message, command) => {
    const isLucas = message.content.includes(`#${command}lucas`);
    const id = isLucas ? lucasId : pedroId;
    return await message.guild.members.fetch(id)
}