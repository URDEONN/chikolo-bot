const frases = require('../data/frases.json');

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function ipFalsa() {
  return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

module.exports = {
  name: 'doxeo',
  async execute(message) {
    const objetivo = message.mentions.users.filter(u => u.id !== message.client.user.id).first();
    const nombre = objetivo ? objetivo.username : message.author.username;
    const mencion = objetivo ? `<@${objetivo.id}>` : `<@${message.author.id}>`;

    await message.channel.send(`🔍 Hackeando bases de datos gubernamentales...`);
    await new Promise(r => setTimeout(r, 1500));
    await message.channel.send(`💻 Accediendo a registros privados...`);
    await new Promise(r => setTimeout(r, 1500));

    return message.channel.send(
      `🚨 **DOXEO COMPLETADO** 🚨\n\n` +
      `**Objetivo:** ${mencion}\n` +
      `**IP:** \`${ipFalsa()}\`\n` +
      `**Dirección:** ${getRandom(frases.doxeoCalles)}, Santiago, Chile\n` +
      `**Historial de búsqueda:** ${getRandom(frases.doxeoHistorial)}\n` +
      `**Contraseña:** \`hunter2\`\n\n` +
      `*(es todo mentira qlao, tranquilo)*`
    );
  }
};
