const HEADERS = { 'Accept': 'application/vnd.api+json' };

module.exports = {
  name: 'dato',
  async execute(message, args) {
    if (!args || args.length === 0) {
      return message.channel.send('Ponme el nombre de un anime, ej: `!dato jujutsu kaisen` 🙄');
    }

    const query = args.join(' ');
    await message.channel.send(`🎲 Buscando un dato random de **${query}**...`);

    try {
      // 1. Buscar el anime
      const searchRes = await fetch(
        `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=1`,
        { headers: HEADERS }
      );
      const searchData = await searchRes.json();

      if (!searchData.data?.length) {
        return message.channel.send(`No encontré ese anime mi xan 😔`);
      }

      const anime = searchData.data[0];
      const animeId = anime.id;
      const titulo = anime.attributes.canonicalTitle;

      // 2. Recopilar datos de múltiples fuentes en paralelo
      const [epData, charData, genreData, streamData] = await Promise.all([
        fetch(`https://kitsu.io/api/edge/episodes?filter[mediaId]=${animeId}&page[limit]=20`, { headers: HEADERS }).then(r => r.json()),
        fetch(`https://kitsu.io/api/edge/anime-characters?filter[animeId]=${animeId}&include=character&page[limit]=20`, { headers: HEADERS }).then(r => r.json()),
        fetch(`https://kitsu.io/api/edge/anime/${animeId}/genres`, { headers: HEADERS }).then(r => r.json()),
        fetch(`https://kitsu.io/api/edge/anime/${animeId}/streaming-links?include=streamer`, { headers: HEADERS }).then(r => r.json()),
      ]);

      // 3. Construir el pool de datos disponibles
      const attr = anime.attributes;
      const pool = [];

      // --- Datos generales del anime ---
      if (attr.synopsis) {
        const sinopsis = attr.synopsis.substring(0, 180).trim();
        pool.push({
          emoji: '📖',
          titulo: 'Sinopsis',
          texto: sinopsis + (attr.synopsis.length > 180 ? '...' : ''),
          thumbnail: attr.posterImage?.medium ?? null,
        });
      }

      if (attr.episodeCount) {
        pool.push({
          emoji: '🎬',
          titulo: 'Episodios totales',
          texto: `**${titulo}** tiene **${attr.episodeCount} episodios** en total, cada uno de ~${attr.episodeLength ?? '?'} minutos.`,
          thumbnail: attr.posterImage?.medium ?? null,
        });
      }

      if (attr.averageRating) {
        const rating = parseFloat(attr.averageRating).toFixed(1);
        const estrellas = rating >= 85 ? '⭐⭐⭐⭐⭐' : rating >= 70 ? '⭐⭐⭐⭐' : '⭐⭐⭐';
        pool.push({
          emoji: '📊',
          titulo: 'Rating en Kitsu',
          texto: `**${titulo}** tiene un rating de **${rating}/100** ${estrellas}\nRanking de popularidad: **#${attr.popularityRank ?? '?'}**`,
          thumbnail: attr.posterImage?.medium ?? null,
        });
      }

      if (attr.startDate) {
        const estado = traducirEstado(attr.status);
        pool.push({
          emoji: '📅',
          titulo: 'Fechas de emisión',
          texto: `**${titulo}** empezó el **${attr.startDate}**${attr.endDate ? ` y terminó el **${attr.endDate}**` : ', y aún está en emisión'}.\nEstado actual: ${estado}`,
          thumbnail: attr.coverImage?.small ?? null,
        });
      }

      if (attr.ageRating) {
        pool.push({
          emoji: '🔞',
          titulo: 'Clasificación de edad',
          texto: `**${titulo}** tiene clasificación **${attr.ageRating}**${attr.ageRatingGuide ? ` — *${attr.ageRatingGuide}*` : ''}.`,
          thumbnail: attr.posterImage?.medium ?? null,
        });
      }

      // --- Episodio random ---
      if (epData.data?.length) {
        const ep = epData.data[Math.floor(Math.random() * epData.data.length)];
        const epAttr = ep.attributes;
        const sinEp = epAttr.synopsis
          ? epAttr.synopsis.substring(0, 150) + (epAttr.synopsis.length > 150 ? '...' : '')
          : null;
        pool.push({
          emoji: '🎞️',
          titulo: `Episodio ${epAttr.number ?? '?'}`,
          texto: `**${epAttr.canonicalTitle ?? `Episodio ${epAttr.number}`}**\n📆 Emitido: ${epAttr.airdate ?? 'desconocido'}${epAttr.length ? `\n⏱️ Duración: ${epAttr.length} min` : ''}${sinEp ? `\n\n${sinEp}` : ''}`,
          thumbnail: epAttr.thumbnail?.original ?? attr.posterImage?.medium ?? null,
        });
      }

      // --- Personaje random ---
      if (charData.included?.length) {
        const personaje = charData.included[Math.floor(Math.random() * charData.included.length)];
        const pAttr = personaje.attributes;

        // Buscar el rol del personaje en animeCharacters
        const relacion = charData.data?.find(
          ac => ac.relationships?.character?.data?.id === personaje.id
        );
        const rol = relacion?.attributes?.role === 'main' ? '⭐ Principal' : '👤 Secundario';

        const desc = pAttr.description
          ? pAttr.description.substring(0, 180) + (pAttr.description.length > 180 ? '...' : '')
          : 'Sin descripción disponible.';

        pool.push({
          emoji: '🧑‍🎤',
          titulo: `Personaje: ${pAttr.name ?? 'Desconocido'}`,
          texto: `**Rol:** ${rol}\n\n${desc}`,
          thumbnail: pAttr.image?.original ?? attr.posterImage?.medium ?? null,
        });
      }

      // --- Géneros ---
      if (genreData.data?.length) {
        const nombres = genreData.data.map(g => g.attributes.name).join(', ');
        pool.push({
          emoji: '🏷️',
          titulo: 'Géneros',
          texto: `**${titulo}** está catalogado como:\n**${nombres}**`,
          thumbnail: attr.posterImage?.medium ?? null,
        });
      }

      // --- Plataformas de streaming ---
      if (streamData.data?.length) {
        const plataformas = streamData.included
          ?.filter(i => i.type === 'streamers')
          .map(s => s.attributes.siteName)
          .filter(Boolean);

        if (plataformas?.length) {
          pool.push({
            emoji: '📺',
            titulo: 'Dónde verlo',
            texto: `Puedes ver **${titulo}** en:\n**${plataformas.join(', ')}**`,
            thumbnail: attr.posterImage?.medium ?? null,
          });
        }
      }

      // 4. Elegir un dato random del pool
      if (!pool.length) {
        return message.channel.send(`Encontré el anime pero no hay datos disponibles 😅`);
      }

      const dato = pool[Math.floor(Math.random() * pool.length)];

      // 5. Armar el embed
      const embed = {
        color: 0x7b2d8b,
        author: {
          name: `🎲 Dato random — ${titulo}`,
        },
        title: `${dato.emoji} ${dato.titulo}`,
        description: dato.texto,
        footer: { text: `Datos de Kitsu.io  •  Usa !dato ${query} para otro dato` },
        timestamp: new Date().toISOString(),
      };

      if (dato.thumbnail) embed.thumbnail = { url: dato.thumbnail };

      await message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error('[dato.js]', err);
      message.channel.send('Se rompió algo buscando el dato, intenta de nuevo 💀');
    }
  }
};

function traducirEstado(status) {
  const estados = {
    current:    '🟢 En emisión',
    finished:   '✅ Terminado',
    tba:        '⏳ Fecha por confirmar',
    unreleased: '🔒 Sin estrenar',
    upcoming:   '📅 Próximamente',
  };
  return estados[status] ?? status;
}
