const frases = require('../data/frases.json');
const fs = require('fs');
const path = require('path');

function getPrefix() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/prefix.json'), 'utf8');
    return JSON.parse(data).prefix ?? '!';
  } catch {
    return '!';
  }
}

// Estado global compartido entre comandos
const estado = {
  esperandoPais: new Map(),
  conteoUsos: {},
  rankingToxicos: {},   // { userId: { nombre: string, puntos: number } }
  blindTestActivo: null // { respuesta, canal, timeout }
};

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function esModoNoche() {
  const hora = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago', hour: 'numeric', hour12: false });
  const h = parseInt(hora);
  return h >= 2 && h < 6;
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const contenidoRaw = message.content;
    const contenido = contenidoRaw.toLowerCase().trim();
    const uid = message.author.id;
    const nombreUsuario = message.author.username;

    // ─── CONTADOR DE TOXICIDAD (pasivo, siempre activo) ───────────────────
    const esToxica = frases.palabrasToxicas.some(p => contenido.includes(p));
    if (esToxica) {
      if (!estado.rankingToxicos[uid]) estado.rankingToxicos[uid] = { nombre: nombreUsuario, puntos: 0 };
      estado.rankingToxicos[uid].puntos++;
      estado.rankingToxicos[uid].nombre = nombreUsuario;
    }

    // ─── BLIND TEST — detectar respuesta ─────────────────────────────────
    if (estado.blindTestActivo && message.channel.id === estado.blindTestActivo.canal) {
      if (contenido.trim() === estado.blindTestActivo.respuesta.toLowerCase()) {
        clearTimeout(estado.blindTestActivo.timeout);
        estado.blindTestActivo = null;
        return message.channel.send(`🏆 **${message.author.username}** ganó el blind test! Era **${contenido.trim()}** 🎉`);
      }
    }

    const meMencionan = message.mentions.has(client.user);
    const meRespondieron = message.reference?.messageId
      ? (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author?.id === client.user.id
      : false;

    // ─── RESPUESTA DE PAÍS (conversación pendiente) ───────────────────────
    if (estado.esperandoPais.has(uid) && meRespondieron) {
      const zona = frases.zonas[contenido.trim()];
      estado.esperandoPais.delete(uid);
      if (zona) {
        const hora = new Date().toLocaleTimeString('es-CL', { timeZone: zona, hour: '2-digit', minute: '2-digit' });
        return message.channel.send(`🕐 En **${contenido.trim()}** son las **${hora}**`);
      } else {
        return message.channel.send(`No conozco ese país mi xan, prueba con otro`);
      }
    }

    // ─── COMANDOS SIN MENCIÓN ─────────────────────────────────────────────
    const PREFIX = getPrefix();
    if (contenido.startsWith(PREFIX)) {
      const args = contenidoRaw.slice(PREFIX.length).trim().split(/\s+/);
      const cmdName = args.shift().toLowerCase();
      const cmd = client.commands.get(cmdName);
      if (cmd) return cmd.execute(message, args, client, estado);
      return;
    }

    // ─── REQUIERE MENCIÓN ─────────────────────────────────────────────────
    if (!meMencionan && !meRespondieron) return;

    contarUso(estado, uid);

    const c = contenido;

    // ─── BORRAR MENSAJES DEL BOT ──────────────────────────────────────────
    // Detecta: "borra los últimos 5 mensajes", "limpia los últimos 10", "borra tus mensajes"
    const matchBorrar = c.match(/\b(borra|limpia|elimina)\b[\s\S]{0,30}?(\d+)/i);
    const matchBorrarSimple = c.match(/\b(borra|limpia|elimina)\b[\s\S]{0,30}?\b(mensajes?|historial)\b/i);

    if (matchBorrar || matchBorrarSimple) {
      let cantidad = matchBorrar ? parseInt(matchBorrar[2]) : 5;
      cantidad = Math.min(Math.max(cantidad, 1), 20); // entre 1 y 20

      try {
        const todos = await message.channel.messages.fetch({ limit: 100 });
        const delBot = [...todos
          .filter(m => m.author.id === client.user.id)
          .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
          .values()
        ].slice(0, cantidad);

        if (!delBot.length) {
          return message.channel.send('no tengo mensajes pa borrar acá won 🤷');
        }

        await message.channel.bulkDelete(delBot, true);

        const confirm = await message.channel.send(`listo, borré ${delBot.length} mensaje${delBot.length !== 1 ? 's' : ''} 🗑️`);
        setTimeout(() => confirm.delete().catch(() => {}), 4000);

      } catch (err) {
        console.error('[limpiar]', err);
        message.channel.send('no pude borrar los mensajes, puede que sean muy antiguos o me faltan permisos won');
      }
      return;
    }

    // ─── RESTO DE RESPUESTAS ──────────────────────────────────────────────

    let respuesta;

    // Modo borracho (2am - 6am)
    if (esModoNoche()) {
      return message.channel.send(getRandom(frases.frasesBorracho));
    }

    if (c.includes('que opinas de') || c.includes('qué opinas de')) {
      const mencionados = message.mentions.users.filter(u => u.id !== client.user.id);
      if (mencionados.size > 0) {
        return message.channel.send(`Opino que <@${mencionados.first().id}> ${getRandom(frases.opiniones)}`);
      }
      const match = c.match(/que opinas de (.+)/);
      if (match) {
        const nombre = match[1].trim().replace(/<[^>]+>/g, '').trim();
        return message.channel.send(`Opino que **${nombre}** ${getRandom(frases.opiniones)}`);
      }
      respuesta = "Menciona a alguien con @ pa poder opinar mi xan";
    }
    else if (c.includes('predice') || c.includes('predíceme') || c.includes('adivina') || c.includes('que va a pasar')) {
      const mencionados = message.mentions.users.filter(u => u.id !== client.user.id);
      if (mencionados.size > 0) {
        return message.channel.send(`🔮 <@${mencionados.first().id}> ${getRandom(frases.predicciones)}`);
      }
      return message.channel.send(`🔮 <@${uid}> ${getRandom(frases.predicciones)}`);
    }
    else if (c.includes('insulta a') && message.mentions.users.filter(u => u.id !== client.user.id).size > 0) {
      const obj = message.mentions.users.filter(u => u.id !== client.user.id).first();
      return message.channel.send(`Oye <@${obj.id}>, ${getRandom(frases.insultosFuertes)}`);
    }
    else if (c.includes('insulta a alguien') || c.includes('insulta a un')) {
      respuesta = `Oye **${getRandom(frases.miembros)}**, ${getRandom(frases.insultosFuertes)}`;
    }
    else if (c.includes('recuerdame ')) {
      const regex = /recuerdame (.+) en (\d+) ?(s|sec|segundos|min|mins|minutos)/i;
      const match = c.match(regex);
      if (match) {
        const tarea = match[1].trim();
        const cantidad = parseInt(match[2]);
        const unidad = match[3].toLowerCase();
        const tiempoMs = unidad.startsWith('s') ? cantidad * 1000 : cantidad * 60 * 1000;
        respuesta = `⏰ Listo! Te recuerdo **"${tarea}"** en ${cantidad} ${unidad}`;
        setTimeout(() => message.channel.send(`⏰ <@${uid}> recuerda: **${tarea}**`), tiempoMs);
      } else {
        respuesta = "No entendí el tiempo mi xan, ej: *recuerdame tirar mudae en 12 mins*";
      }
    }
    else if (c.includes('tira dado') || c.includes('tirar dado')) {
      const match = c.match(/dado\s*(\d+)?/);
      const caras = match?.[1] ? parseInt(match[1]) : 6;
      respuesta = `🎲 Dado de **${caras}** caras: **${Math.floor(Math.random() * caras) + 1}**`;
    }
    else if (c.includes('8ball') || c.includes('bola 8') || c.includes('bola8')) {
      respuesta = `🎱 ${getRandom(frases.respuestas8ball)}`;
    }
    else if (c.includes('que hora es') || c.includes('qué hora es')) {
      estado.esperandoPais.set(uid, true);
      const sent = await message.channel.send(`🌍 En qué país mi xan?`);
      estado.esperandoPais.set(uid, sent.id);
      return;
    }
    else if (c.includes('elige ')) {
      const parte = c.replace(/<@[^>]+>\s*/g, '').replace('elige ', '');
      const opciones = parte.split(/\s+o\s+/i).map(s => s.trim()).filter(Boolean);
      respuesta = opciones.length < 2
        ? "Dame dos opciones separadas por 'o' mi xan"
        : `Claramente **${getRandom(opciones)}**, no hay discusión`;
    }
    else if (c.includes('numero random') || c.includes('número random')) {
      const match = c.match(/entre\s+(\d+)\s+y\s+(\d+)/i);
      if (match) {
        const min = parseInt(match[1]), max = parseInt(match[2]);
        respuesta = `🔢 Entre ${min} y ${max}: **${Math.floor(Math.random() * (max - min + 1)) + min}**`;
      } else {
        respuesta = `🔢 Número random: **${Math.floor(Math.random() * 100) + 1}**`;
      }
    }
    else if (c.includes('chiste')) { respuesta = `😂 ${getRandom(frases.chistes)}`; }
    else if (c.includes('verdad')) { respuesta = `🔥 Verdad para <@${uid}>: *${getRandom(frases.verdades)}*`; }
    else if (c.includes('reto')) { respuesta = `💀 Reto para <@${uid}>: *${getRandom(frases.retos)}*`; }
    else if (c.includes('cara o sello') || c.includes('cara o cruz')) {
      respuesta = Math.random() < 0.5 ? '🪙 Salió **CARA**' : '🪙 Salió **SELLO**';
    }
    else if (c.includes('cuantas veces') && c.includes('molest')) {
      respuesta = `<@${uid}> me has molestado **${estado.conteoUsos[uid] || 1}** veces. Cara de raja nivel profesional.`;
    }
    else if (c.includes('tonto') || c.includes('idiota') || c.includes('inutil') || c.includes('inútil') || c.includes('qlao') || c.includes('weón') || c.includes('weon')) {
      respuesta = getRandom(frases.respuestasInsultos);
    }
    else if (c.includes('eres bueno') || c.includes('eres el mejor') || c.includes('te quiero') || c.includes('eres genial')) {
      respuesta = getRandom(frases.elogios);
    }
    else if (c.includes('hola') || c.includes('ola')) { respuesta = getRandom(frases.saludos); }
    else if (c.includes('?')) { respuesta = getRandom(frases.respuestasPreguntas); }
    else if (c.includes('one piece')) { respuesta = "Ta de la perra wan pi 🏴‍☠️"; }
    else if (c.includes('gala')) { respuesta = "tay hablando del wekotron del gala?"; }
    else if (c.includes('pico') || c.includes('kevin')) { respuesta = "ese won es fanático de la diuca"; }
    else if (c.includes('dormir') && c.includes('counter')) { respuesta = getRandom(frases.frasesDormir); }
    else if (c.includes('a que jugamos') || c.includes('a qué jugamos') || c.includes('que deberiamos jugar')) {
      respuesta = `🎮 Jueguen **${getRandom(frases.juegos)}**`;
    }
    else if (c.includes('ya tire') || c.includes('ya tiré')) { respuesta = "Hay más coxinos que no tiraron 👀"; }
    else if (c.includes('unete a la llamada') || c.includes('únete a la llamada')) {
      const { joinVoiceChannel } = require('@discordjs/voice');
      const canal = message.member?.voice?.channel;
      if (!canal) { respuesta = "No estás en un canal de voz mi xan"; }
      else {
        try {
          joinVoiceChannel({ channelId: canal.id, guildId: canal.guild.id, adapterCreator: canal.guild.voiceAdapterCreator, selfDeaf: false });
          respuesta = "🎤 Ya me uní al canal de voz!";
        } catch { respuesta = "No pude unirme al canal de voz"; }
      }
    }
    else if (c.includes('sal del canal') || c.includes('desconectate')) {
      const { getVoiceConnection } = require('@discordjs/voice');
      const connection = getVoiceConnection(message.guild.id);
      respuesta = connection ? (connection.destroy(), "Ya me fui 👋") : "No estoy en ningún canal mi xan";
    }
    else if (c.split(' ').length <= 4) { respuesta = getRandom(frases.respuestasCasuales); }
    else { respuesta = getRandom(frases.respuestasGenerales); }

    if (respuesta) message.channel.send(respuesta);
  }
};

function contarUso(estado, uid) {
  estado.conteoUsos[uid] = (estado.conteoUsos[uid] || 0) + 1;
}
