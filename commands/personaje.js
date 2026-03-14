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
      // 1. Traer los primeros 10 resultados
      const searchRes = await fetch(
        `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=10`,
        { headers: HEADERS }
      );
      const searchData = await searchRes.json();

      if (!searchData.data?.length) {
        return message.channel.send(`No encontré ese anime won 😔`);
      }

      // 2. Ordenar: TV primero, luego el resto
      const resultados = [
        ...searchData.data.filter(a => a.attributes.subtype === 'TV'),
        ...searchData.data.filter(a => a.attributes.subtype !== 'TV'),
      ];

      // 3. Iterar hasta encontrar uno que tenga personajes cargados
      let acData = null;
      let anime = null;

      for (const candidato of resultados) {
        const res = await fetch(
          `https://kitsu.io/api/edge/anime-characters?filter[animeId]=${candidato.id}&page[limit]=20`,
          { headers: HEADERS }
        );
        const data = await res.json();
        if (data.data?.length) {
          acData = data;
          anime = candidato;
          break;
        }
      }

      if (!anime || !acData) {
        return message.channel.send(`No encontré personajes de **${query}** en Kitsu won 😔`);
      }

      const animeId = anime.id;
      const tituloAnime = anime.attributes.canonicalTitle;

      // 4. Elegir personaje random y obtener su ID y rol
      const acRandom = acData.data[Math.floor(Math.random() * acData.data.length)];
      const rol = acRandom.attributes?.role === 'main' ? '⭐ Principal' : '👤 Secundario';
      const charId = acRandom.relationships?.character?.data?.id;

      if (!charId) {
        return message.channel.send(`No pude obtener el personaje, intenta de nuevo won`);
      }

      // 5. Buscar datos reales del personaje
      const charRes = await fetch(
        `https://kitsu.io/api/edge/characters/${charId}`,
        { headers: HEADERS }
      );
      const charData = await charRes.json();
      const pAttr = charData.data?.attributes;

      if (!pAttr) {
        return message.channel.send(`No pude cargar los datos del personaje, intenta de nuevo won`);
      }

      // 6. Buscar seiyū — opcional, no rompe si falla
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
      } catch { /* sin seiyū no pasa nada */ }

      // 7. Armar descripción
      const desc = pAttr.description
        ? pAttr.description.substring(0, 300) + (pAttr.description.length > 300 ? '...' : '')
        : '*Sin descripción disponible.*';

      // 8. Construir embed
      const fields = [
        { name: 'Rol',   value: rol,         inline: true },
        { name: 'Anime', value: tituloAnime,  inline: true },
      ];

      if (seiyu) fields.push({ name: 'Seiyū (JP)', value: seiyu, inline: true });
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
