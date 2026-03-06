require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  getVoiceConnection,
  StreamType
} = require('@discordjs/voice');
const path = require('path');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

// ─── RESPUESTAS RANDOM ───────────────────────────────────────────────────────
const respuestas = [
  "Sí mi xan, te escucho...",
  "Ajá, dime más...",
  "Uy, interesante...",
  "Mmm… suena raro mi xan.",
  "Penka tu broma kla",
  "te paso por el pico marikong",
  "oe sapo qlao te dije q no me hablarai",
  "al piru le gustan los pirulones, el me conto",
  "no tengo idea de qué me estás hablando",
  "para qué me dices eso a mí",
  "eso no es mi problema honestamente",
  "me importa una raja lo que dices",
  "tas hablando mucha tontería mi rey",
  "wena info, me la pela",
  "y eso qué tiene que ver conmigo",
  "déjame pensarlo... no",
  "oe para qué me cuentas eso",
  "oye pero eso es tu problema no el mío",
  "qué interesante, igual me chupa un huevo",
  "bro tas hablando solo casi",
  "si poh si, lo que tú digas",
  "mira quién habla lol",
  "eso no se lo cree ni tu mamá",
  "a otro perro con ese hueso",
  "qué cabeza de meme más grande tenís",
  "ya cállate un poco anda",
  "wena, siguiente",
  "me tinca que estás inventando",
  "tus neuronas están de vacaciones parece",
  "podría estar durmiendo y acá contestándote",
  "no entiendo nada pero sigo igual",
  "error 404: me importa un pico",
  "eso suena a problema tuyo bro",
  "consulta tu manual de usuario",
  "next pregunta por favor",
  "¿y? ¿y? ¿y?",
  "si me hubieras preguntado antes te decía que no igual",
  "wena dato, lo anoto en la papelera",
  "eso lo dices ahora",
  "hay días que no sé pa qué prendo esto"
];

// ─── FRASES DORMIR + COUNTER ─────────────────────────────────────────────────
const frasesDormir = [
  "Dormir con el counter es más mala que la perra",
  "No podi dormir con el counter, es más mala que la perra",
  "díganle a la dormir q no ocupe nunca mas esa wea porfa",
  "el counter y el sueño no se mezclan, eso es científico",
  "dormirse con el counter prendío es pecado mortal"
];

// ─── JUEGOS ──────────────────────────────────────────────────────────────────
const juegos = [
  "fornite",
  "mierdanigans",
  "zombodrio",
  "volomierda",
  "mejor vallance a dormir chalas qlas",
  "tira mudae",
  "LoL pero solo pa sufrir",
  "minecraft y hacerse un rancho",
  "ninguno, mejor duerman"
];

// ─── SALUDOS ──────────────────────────────────────────────────────────────────
const saludos = [
  "y quien eri vo",
  "charchetuo qlao no me habli",
  "ola amor",
  "tu nariz contra mis bolas",
  "ola ola caracola",
  "ah llegaste tú, qué lata",
  "salud recibida, ignorada exitosamente"
];

// ─── INSULTOS ─────────────────────────────────────────────────────────────────
const insultos = [
  "oye no me faltes el respeto",
  "el espejo te debe tener pavor a ti también",
  "eso díselo a tu espejo primero",
  "qué bonito vocabulario, lo aprendiste solo?",
  "tranquilo que yo también te quiero"
];

// ─── ELOGIOS ──────────────────────────────────────────────────────────────────
const elogios = [
  "aww gracias mi amor, igual eres feo",
  "lo sé, soy el mejor bot del mundo mundial",
  "eso intenta subirme la autoestima pero sigo siendo superior",
  "me lo merezco honestamente",
  "sí soy lo máximo, gracias por notarlo"
];

// ─── 8BALL ────────────────────────────────────────────────────────────────────
const respuestas8ball = [
  "Sí, definitivamente",
  "No way bro",
  "Las señales apuntan a que sí",
  "Pregúntame después que estoy ocupado",
  "Ni en sueños",
  "Puede ser, puede que no",
  "Sí pero vas a arrepentirte",
  "La magia dice que no",
  "Con toda certeza NO",
  "Mejor ni preguntes eso"
];

// ─── CHISTES ──────────────────────────────────────────────────────────────────
const chistes = [
  "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.",
  "¿Qué le dice un techo a otro techo? Techo de menos.",
  "¿Cómo se llama el campeón de buceo japonés? Tokofondo. ¿Y el subcampeón? Kasitokofondo.",
  "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
  "Mi contraseña es 'incorrecta'. Cada vez que la olvido el sistema me dice: tu contraseña es incorrecta.",
  "¿Por qué los pájaros vuelan hacia el sur? Porque caminar sería muy largo.",
  "Le pregunté a mi perro qué es dos menos dos. Se quedó callado. Nada, correcto.",
  "¿Cuántos programadores se necesitan para cambiar un foco? Ninguno, es un problema de hardware."
];

// ─── CONFESIONES/VERDAD O RETO ────────────────────────────────────────────────
const verdades = [
  "¿Cuál es la cosa más vergonzosa que has hecho en el servidor?",
  "¿A quién del servidor le tienes mala?",
  "¿Cuál es tu kill/death más patético en el último juego que jugaste?",
  "¿Alguna vez te has quedado afk fingiendo jugar?",
  "¿Cuál es la excusa más mala que has usado para no jugar con el grupo?",
  "¿A quién del server le copiarías el estilo si pudieras?"
];

const retos = [
  "Pon tu foto de perfil como el último meme que te mandaron",
  "Manda un audio de ti cantando algo, lo que sea",
  "Escribe un poema de 4 líneas sobre el juego que más odias",
  "Cambia tu apodo a algo que elija el servidor por 1 hora",
  "Manda el último screenshot de tu galería sin ver qué es",
  "Di algo bonito de cada persona activa en el canal ahora mismo"
];

// ─── MAPA DE SONIDOS ──────────────────────────────────────────────────────────
const sonidos = {
  fail: 'fail.mp3'
  // Para agregar más: nombre: 'archivo.mp3'
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function tirarDado(caras = 6) {
  return Math.floor(Math.random() * caras) + 1;
}

function getHoraChile() {
  return new Date().toLocaleTimeString('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ─── CONTEO DE USOS POR USUARIO (se resetea al reiniciar) ────────────────────
const conteoUsos = {};

// ─────────────────────────────────────────────────────────────────────────────

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const meMencionan = message.mentions.has(client.user);
  const meRespondieron = message.reference?.messageId
    ? (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author?.id === client.user.id
    : false;

  const contenidoRaw = message.content;
  const contenido = contenidoRaw.toLowerCase().trim();

  // ─── COMANDOS SIN MENCIÓN ─────────────────────────────────────────────────

  // !sound <nombre>
  if (contenido.startsWith('!sound ')) {
    const key = contenido.split(' ')[1];
    const archivo = sonidos[key];

    if (!archivo) {
      return message.channel.send(`No tengo el sonido **"${key}"** mi xan. Disponibles: ${Object.keys(sonidos).join(', ')}`);
    }

    const canal = message.member?.voice?.channel;
    if (!canal) {
      return message.channel.send('Parece que no estás en un canal de voz mi xan.');
    }

    const rutaSonido = path.join(__dirname, 'sounds', archivo);

    if (!fs.existsSync(rutaSonido)) {
      return message.channel.send(`No encontré el archivo **${archivo}** en la carpeta sounds mi xan.`);
    }

    try {
      const connection = joinVoiceChannel({
        channelId: canal.id,
        guildId: canal.guild.id,
        adapterCreator: canal.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();

      // FIX AUDIO: usar stream directo con fs en vez de ruta string
      const resource = createAudioResource(fs.createReadStream(rutaSonido), {
        inputType: StreamType.Arbitrary,
        inlineVolume: true
      });
      resource.volume?.setVolume(1);

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      player.on('error', (err) => {
        console.error('❌ Error en audio player:', err.message);
        connection.destroy();
        message.channel.send('Hubo un error reproduciendo el sonido mi xan.');
      });

      return message.channel.send(`🔊 Reproduciendo: **${key}**`);
    } catch (err) {
      console.error('❌ Error al unirse al canal:', err.message);
      return message.channel.send('No pude unirme al canal de voz mi xan.');
    }
  }

  // !sounds - lista de sonidos disponibles
  if (contenido === '!sounds') {
    const lista = Object.keys(sonidos);
    return message.channel.send(`🎵 Sonidos disponibles: **${lista.join(', ')}**\nUsa \`!sound <nombre>\` para reproducir uno.`);
  }

  // !ayuda - lista de comandos
  if (contenido === '!ayuda' || contenido === '!help') {
    return message.channel.send(
      `📋 **Comandos disponibles:**\n\n` +
      `**Sin mención:**\n` +
      `\`!sound <nombre>\` → Reproduce un sonido en el canal de voz\n` +
      `\`!sounds\` → Lista los sonidos disponibles\n` +
      `\`!ayuda\` → Muestra este mensaje\n\n` +
      `**Mencionando al bot (@Chikolo ...):**\n` +
      `\`recuerdame <cosa> en <N> mins/seg\` → Temporizador\n` +
      `\`tira dado\` / \`tira dado 20\` → Tira un dado\n` +
      `\`8ball <pregunta>\` → Consulta la bola mágica\n` +
      `\`que hora es\` → Hora en Chile\n` +
      `\`elige <A> o <B>\` → El bot elige por ti\n` +
      `\`numero random\` / \`numero random entre X y Y\` → Número aleatorio\n` +
      `\`chiste\` → Un chiste malo\n` +
      `\`verdad\` / \`reto\` → Verdad o reto random\n` +
      `\`cara o sello\` → Lanza una moneda\n` +
      `\`unete a la llamada\` → El bot se une al canal de voz\n` +
      `\`sal del canal\` → El bot se desconecta\n`
    );
  }

  // ─── BLOQUE QUE REQUIERE MENCIÓN O RESPUESTA AL BOT ──────────────────────
  if (!meMencionan && !meRespondieron) return;

  // Conteo de usos
  const uid = message.author.id;
  conteoUsos[uid] = (conteoUsos[uid] || 0) + 1;

  let respuesta;

  // RECORDATORIO
  if (contenido.includes('recuerdame ')) {
    const regex = /recuerdame (.+) en (\d+) ?(s|sec|segundos|min|mins|minutos)/i;
    const match = contenido.match(regex);
    if (match) {
      const tarea = match[1].trim();
      const cantidad = parseInt(match[2]);
      const unidad = match[3].toLowerCase();
      const tiempoMs = unidad.startsWith('s') ? cantidad * 1000 : cantidad * 60 * 1000;
      respuesta = `⏰ Temporizador puesto mi xan! Te recuerdo **"${tarea}"** en ${cantidad} ${unidad}`;
      setTimeout(() => {
        message.channel.send(`⏰ <@${message.author.id}> recuerda: **${tarea}**`);
      }, tiempoMs);
    } else {
      respuesta = "No entendí el tiempo mi xan, escribe algo tipo: *recuerdame tirar mudae en 12 mins*";
    }
  }

  // DADO
  else if (contenido.includes('tira dado') || contenido.includes('tirar dado')) {
    const match = contenido.match(/dado\s*(\d+)?/);
    const caras = match?.[1] ? parseInt(match[1]) : 6;
    const resultado = tirarDado(caras);
    respuesta = `🎲 Tiré un dado de **${caras}** caras y salió: **${resultado}**`;
  }

  // 8BALL
  else if (contenido.includes('8ball') || contenido.includes('bola 8') || contenido.includes('bola8')) {
    respuesta = `🎱 ${getRandom(respuestas8ball)}`;
  }

  // HORA
  else if (contenido.includes('que hora') || contenido.includes('qué hora')) {
    respuesta = `🕐 Son las **${getHoraChile()}** en Chile (si es que te importa saber)`;
  }

  // ELIGE
  else if (contenido.includes('elige ')) {
    const parte = contenido.replace(/<@[^>]+>\s*/g, '').replace('elige ', '');
    const opciones = parte.split(/\s+o\s+/i).map(s => s.trim()).filter(Boolean);
    if (opciones.length < 2) {
      respuesta = "Dame al menos dos opciones separadas por 'o' mi xan";
    } else {
      respuesta = `Claramente **${getRandom(opciones)}**, no hay discusión`;
    }
  }

  // NÚMERO RANDOM
  else if (contenido.includes('numero random') || contenido.includes('número random')) {
    const match = contenido.match(/entre\s+(\d+)\s+y\s+(\d+)/i);
    if (match) {
      const min = parseInt(match[1]);
      const max = parseInt(match[2]);
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      respuesta = `🔢 Número random entre ${min} y ${max}: **${num}**`;
    } else {
      respuesta = `🔢 Número random: **${Math.floor(Math.random() * 100) + 1}**`;
    }
  }

  // CHISTE
  else if (contenido.includes('chiste')) {
    respuesta = `😂 ${getRandom(chistes)}`;
  }

  // VERDAD O RETO
  else if (contenido.includes('verdad')) {
    respuesta = `🔥 Verdad para <@${message.author.id}>: *${getRandom(verdades)}*`;
  }
  else if (contenido.includes('reto')) {
    respuesta = `💀 Reto para <@${message.author.id}>: *${getRandom(retos)}*`;
  }

  // CARA O SELLO
  else if (contenido.includes('cara o sello') || contenido.includes('cara o cruz')) {
    respuesta = Math.random() < 0.5 ? '🪙 Salió **CARA**' : '🪙 Salió **SELLO**';
  }

  // CUÁNTAS VECES ME HAS MOLESTADO
  else if (contenido.includes('cuantas veces') && contenido.includes('molest')) {
    respuesta = `<@${message.author.id}> me has molestado **${conteoUsos[uid]}** veces. Impresionante nivel de cara de raja.`;
  }

  // INSULTOS AL BOT
  else if (contenido.includes('tonto') || contenido.includes('idiota') || contenido.includes('inutil') || contenido.includes('inútil') || contenido.includes('mierda')) {
    respuesta = getRandom(insultos);
  }

  // ELOGIOS AL BOT
  else if (contenido.includes('eres bueno') || contenido.includes('eres el mejor') || contenido.includes('te quiero') || contenido.includes('eres genial')) {
    respuesta = getRandom(elogios);
  }

  // SALUDOS
  else if (contenido.includes('hola') || contenido.includes('ola')) {
    respuesta = getRandom(saludos);
  }

  // PALABRAS CLAVE
  else if (contenido.includes('one piece')) {
    respuesta = "Ta de la perra wan pi 🏴‍☠️";
  }
  else if (contenido.includes('gala')) {
    respuesta = "tay hablando del wekotron del gala?";
  }
  else if (contenido.includes('que es') || contenido.includes('charlo')) {
    respuesta = "hasta a mi me da miedo pensar en esa wa brodel";
  }
  else if (contenido.includes('pico') || contenido.includes('kevin')) {
    respuesta = "ese won es fanático de la diuca";
  }
  else if (contenido.includes('dormir') && contenido.includes('counter')) {
    respuesta = getRandom(frasesDormir);
  }
  else if (contenido.includes('que deberiamos jugar') || contenido.includes('qué deberíamos jugar') || contenido.includes('a que jugamos') || contenido.includes('a qué jugamos')) {
    respuesta = `🎮 Jueguen **${getRandom(juegos)}**`;
  }
  else if (contenido.includes('ya tire') || contenido.includes('ya tiré')) {
    respuesta = "Hay más coxinos que no tiraron 👀";
  }

  // UNIRSE A VOZ
  else if (contenido.includes('unete a la llamada') || contenido.includes('únete a la llamada')) {
    const canal = message.member?.voice?.channel;
    if (!canal) {
      respuesta = "No estoy viendo que estés en un canal de voz, mi xan";
    } else {
      try {
        joinVoiceChannel({
          channelId: canal.id,
          guildId: canal.guild.id,
          adapterCreator: canal.guild.voiceAdapterCreator
        });
        respuesta = "🎤 Ya me uní al canal de voz, mi xan!";
      } catch (err) {
        console.error('❌ Error al unirse:', err.message);
        respuesta = "No pude unirme al canal de voz, algo salió mal";
      }
    }
  }

  // SALIR DE VOZ
  else if (contenido.includes('sal del canal') || contenido.includes('desconectate') || contenido.includes('desconéctate')) {
    const connection = getVoiceConnection(message.guild.id);
    if (connection) {
      connection.destroy();
      respuesta = "Ya me fui del canal de voz 👋";
    } else {
      respuesta = "No estoy en ningún canal de voz mi xan";
    }
  }

  // DEFAULT
  else {
    respuesta = getRandom(respuestas);
  }

  if (respuesta) {
    message.channel.send(respuesta);
  }
});

client.login(process.env.DISCORD_TOKEN);