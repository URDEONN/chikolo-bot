module.exports = {
  name: 'curiosidad',
  aliases: ['fact', 'dato2'],
  async execute(message) {
    try {
      await message.channel.send('🧠 Buscando una curiosidad...');

      // 1. Obtener dato random
      const factRes = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
      const factData = await factRes.json();
      const textoOriginal = factData.text;

      if (!textoOriginal) {
        return message.channel.send('no encontré ninguna curiosidad ahora, intenta después won 😔');
      }

      // 2. Traducir con MyMemory (gratis, sin API key)
      const traduccionRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoOriginal)}&langpair=en|es`
      );
      const traduccionData = await traduccionRes.json();
      const textoTraducido = traduccionData.responseData?.translatedText ?? textoOriginal;

      // 3. Mandar embed
      const embed = {
        color: 0xF59E0B,
        title: '🧠 Curiosidad random',
        description: textoTraducido,
        footer: { text: 'uselessfacts.jsph.pl • traducido por MyMemory' },
        timestamp: new Date().toISOString(),
      };

      await message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error('[curiosidad.js]', err);
      message.channel.send('se rompió algo buscando la curiosidad 💀');
    }
  }
};
