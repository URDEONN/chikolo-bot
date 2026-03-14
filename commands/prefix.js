const fs = require('fs');
const path = require('path');

const PREFIX_FILE = path.join(__dirname, '../data/prefix.json');

module.exports = {
  name: 'prefix',
  async execute(message, args) {
    // Solo el dueño del server puede cambiarlo
    if (message.author.id !== message.guild.ownerId) {
      return message.channel.send('solo el dueño del server puede cambiar el prefix won 😤');
    }

    if (!args || args.length === 0) {
      const actual = leerPrefix();
      return message.channel.send(`el prefix actual es \`${actual}\` — para cambiarlo: \`${actual}prefix <nuevo>\``);
    }

    const nuevo = args[0].trim();

    if (nuevo.length > 3) {
      return message.channel.send('el prefix no puede tener más de 3 caracteres won');
    }

    guardarPrefix(nuevo);
    message.channel.send(`✅ Prefix cambiado a \`${nuevo}\` — ahora los comandos son como \`${nuevo}ayuda\``);
  }
};

function leerPrefix() {
  try {
    const data = fs.readFileSync(PREFIX_FILE, 'utf8');
    return JSON.parse(data).prefix ?? '!';
  } catch {
    return '!';
  }
}

function guardarPrefix(nuevo) {
  fs.writeFileSync(PREFIX_FILE, JSON.stringify({ prefix: nuevo }, null, 2));
}
