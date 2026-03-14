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
      // 1. Buscar el anime — traer varios y priorizar TV
      const searchRes = await fetch(
        `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=10`,
        { headers: HEADERS }
      );
      const searchData = await searchRes.json();

      if (!searchData.data?.length) {
        return message.channel.send(`No encontré ese anime won 😔`);
      }

      const resultados = [
        ...searchData.data.filter(a => a.attributes.subtype === 'TV'),
        ...searchData.data.filter(a => a.attributes.subtype !== 'TV'),
      ];

      // 2. Iterar hasta encontrar anime con personajes incluidos
      let anime = null;
      let personajes = []; // array de objetos character completos
      let roles = {};      // charId -> rol

      for (const candidato of resultados) {
        const res = await fetch(
          `https://kitsu.io/api/edge/anime-characters?filter[animeId]=${candidato.id}&include=character&page[limit]=20`,
          { headers: HEADERS }
        );
        const data = await res.json();

        // data.data = relaciones (con el rol)
        // data.included = personajes reales
        if (data.included?.length) {
          anime = candidato;
          personajes = data.included.filter(i => i.type === 'characters');

          // mapear charId -> rol desde data.data
          for (const rel of (data.data ?? [])) {
            const charId = rel.relationships?.character?.data?.id;
            if (charId) roles[charId] = rel.attributes?.role ?? 'supporting';
          }
          break;
        }
      }

      if (!anime || !personajes.length) {
        return message.channel.send(`No encontré personajes de **${query}** en Kitsu won 😔`);
      }

      const animeId = anime.id;
      const tituloAnime = anime.attributes.canonicalTitle;

      // 3. Elegir personaje random del included
      const pData = personajes[Math.floor(Math.random() * personajes.length)];
      const pAttr = pData.attributes;
      const charId = pData.id;
      const rolRaw = roles[charId] ?? 'supporting';
      const rol = rolRaw === 'main' ? '⭐ Principal' : '👤 Secundario';

      // 4. Buscar seiyū — opcional
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

      // 5. Descripción
      const desc = pAttr.description
        ? pAttr.description.substring(0, 300) + (pAttr.description.length > 300 ? '...' : '')
        : '*Sin descripción disponible.*';

      // 6. Embed
      const fields = [
        { name: 'Rol',   value: rol,        inline: true },
        { name: 'Anime', value: tituloAnime, inline: true },
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
