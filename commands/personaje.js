const HEADERS = { 'Accept': 'application/vnd.api+json' };

module.exports = {
  name: 'personaje',
  async execute(message, args) {
    if (!args || args.length === 0) {
      return message.channel.send('Ponme el nombre del anime, ej: `!personaje jujutsu kaisen` 🙄');
    }

    const query = args.join(' ');
    await message.channel.send(`🎲 Buscando personaje random de **${query}**...`);

    try {
      // 1. Buscar el anime y obtener su ID
      const searchRes = await fetch(
        `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=1`,
        { headers: HEADERS }
      );
      const searchData = await searchRes.json();

      if (!searchData.data?.length) {
        return message.channel.send(`No encontré ese anime won 😔`);
      }

      const anime = searchData.data[0];
      const animeId = anime.id;
      const tituloAnime = anime.attributes.canonicalTitle;

      // 2. Buscar los anime-characters del anime (relación + rol)
      const acRes = await fetch(
        `https://kitsu.io/api/edge/anime-characters?filter[animeId]=${animeId}&page[limit]=20`,
        { headers: HEADERS }
      );
      const acData = await acRes.json();

      if (!acData.data?.length) {
        return message.channel.send(`No encontré personajes de **${tituloAnime}** en la base de datos won 😔`);
      }

      // 3. Elegir una relación anime-character random y obtener el ID del personaje
      const acRandom = acData.data[Math.floor(Math.random() * acData.data.length)];
      const rol = acRandom.attributes?.role === 'main' ? '⭐ Principal' : '👤 Secundario';
      const charId = acRandom.relationships?.character?.data?.id;

      if (!charId) {
        return message.channel.send(`No pude obtener el personaje, intenta de nuevo won`);
      }

      // 4. Buscar los datos reales del personaje por su ID
      const charRes = await fetch(
        `https://kitsu.io/api/edge/characters/${charId}`,
        { headers: HEADERS }
      );
      const charData = await charRes.json();
      const pAttr = charData.data?.attributes;

      if (!pAttr) {
        return message.channel.send(`No pude cargar los datos del personaje, intenta de nuevo won`);
      }

      // 5. Buscar seiyū (actor de voz japonés) — opcional, no rompe si falla
      let seiyu = null;
      try {
        const castRes = await fetch(
          `https://kitsu.io/api/edge/castings?filter[mediaId]=${animeId}&filter[characterId]=${charId}&filter[isVoiceActor]=true&filter[language]=Japanese&include=person&page[limit]=1`,
          { headers: HEADERS }
        );
        const castData = await castRes.json();
        if (castData.included?.length) {
          seiyu = castData.included[0].attributes?.name ?? null;
        }
      } catch { /* si no hay seiyū no pasa nada */ }

      // 6. Armar descripción
      const desc = pAttr.description
        ? pAttr.description.substring(0, 300) + (pAttr.description.length > 300 ? '...' : '')
        : '*Sin descripción disponible.*';

      // 7. Construir embed
      const fields = [
        { name: 'Rol',   value: rol,         inline: true },
        { name: 'Anime', value: tituloAnime,  inline: true },
      ];

      if (seiyu) {
        fields.push({ name: 'Seiyū (JP)', value: seiyu, inline: true });
      }

      fields.push({ name: 'Descripción', value: desc, inline: false });

      const embed = {
        color: 0x7b2d8b,
        title: pAttr.name ?? 'Personaje desconocido',
        fields,
        footer: { text: `Datos de Kitsu.io  •  Usa !personaje ${query} pa otro random` },
        timestamp: new Date().toISOString(),
      };

      if (pAttr.image?.original) {
        embed.image = { url: pAttr.image.original };
      } else if (anime.attributes.posterImage?.medium) {
        embed.thumbnail = { url: anime.attributes.posterImage.medium };
      }

      await message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error('[personaje.js]', err);
      message.channel.send('Se rompió algo buscando el personaje 💀');
    }
  }
};
