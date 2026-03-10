const {
  joinVoiceChannel, createAudioPlayer, createAudioResource,
  AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType
} = require('@discordjs/voice');
const path = require('path');
const fs = require('fs');
const frases = require('../data/frases.json');

async function reproducirSonido(message, key) {
  const archivo = frases.sonidos[key];
  if (!archivo) return message.channel.send(`No tengo el sonido **"${key}"**. Disponibles: ${Object.keys(frases.sonidos).join(', ')}`);
  const canal = message.member?.voice?.channel;
  if (!canal) return message.channel.send('No estás en un canal de voz mi xan.');
  const rutaSonido = path.join(__dirname, '..', 'sounds', archivo);
  if (!fs.existsSync(rutaSonido)) return message.channel.send(`No encontré **${archivo}** mi xan.`);
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
    player.on('error', (err) => {
      console.error('❌ Error audio:', err.message);
      connection.destroy();
    });
    return message.channel.send(`🔊 Reproduciendo: **${key}**`);
  } catch (err) {
    console.error('❌ Error canal:', err.message);
    return message.channel.send('No pude unirme al canal de voz mi xan.');
  }
}

module.exports = [
  {
    name: 'sound',
    execute(message, args) {
      const key = args[0];
      if (!key) return message.channel.send(`Dime qué sonido mi xan. Disponibles: ${Object.keys(frases.sonidos).join(', ')}`);
      return reproducirSonido(message, key);
    }
  },
  {
    name: 'sounds',
    execute(message) {
      return message.channel.send(`🎵 Sonidos disponibles: **${Object.keys(frases.sonidos).join(', ')}**\nUsa \`!sound <nombre>\``);
    }
  }
];
