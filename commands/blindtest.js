const {
  joinVoiceChannel, createAudioPlayer, createAudioResource,
  AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType
} = require('@discordjs/voice');
const path = require('path');
const fs = require('fs');
const frases = require('../data/frases.json');

module.exports = {
  name: 'blindtest',
  async execute(message, args, client, estado) {
    if (estado.blindTestActivo) {
      return message.channel.send('Ya hay un blind test activo mi xan, adivinen ese primero');
    }

    const canal = message.member?.voice?.channel;
    if (!canal) return message.channel.send('Entra a un canal de voz primero mi xan');

    const sonidosDisponibles = Object.keys(frases.sonidos);
    if (sonidosDisponibles.length === 0) {
      return message.channel.send('No hay sonidos disponibles mi xan');
    }

    const respuestaCorrecta = sonidosDisponibles[Math.floor(Math.random() * sonidosDisponibles.length)];
    const archivo = frases.sonidos[respuestaCorrecta];
    const rutaSonido = path.join(__dirname, '..', 'sounds', archivo);

    if (!fs.existsSync(rutaSonido)) {
      return message.channel.send(`No encontré el archivo de sonido mi xan`);
    }

    try {
      const connection = joinVoiceChannel({
        channelId: canal.id, guildId: canal.guild.id,
        adapterCreator: canal.guild.voiceAdapterCreator, selfDeaf: false
      });
      await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
      const player = createAudioPlayer();
      const resource = createAudioResource(fs.createReadStream(rutaSonido), {
        inputType: StreamType.Arbitrary, inlineVolume: true
      });
      resource.volume?.setVolume(1);
      connection.subscribe(player);
      player.play(resource);
      player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    } catch (err) {
      return message.channel.send('No pude reproducir el sonido mi xan');
    }

    await message.channel.send(`🎵 **BLIND TEST** — Adivina qué sonido es! Tienen 30 segundos. Escriban el nombre solo.`);

    const timeout = setTimeout(() => {
      if (estado.blindTestActivo) {
        estado.blindTestActivo = null;
        message.channel.send(`⏰ Se acabó el tiempo! Era **${respuestaCorrecta}**. Qlaos todos.`);
      }
    }, 30000);

    estado.blindTestActivo = {
      respuesta: respuestaCorrecta,
      canal: message.channel.id,
      timeout
    };
  }
};
