const HEADERS = { 'Accept': 'application/vnd.api+json' };

module.exports = {
  name: 'trending',
  async execute(message) {
    await message.channel.send('🔥 Buscando los animes más populares ahora...');

    try {
      const res = await fetch('https://kitsu.io/api/edge/trending/anime', { headers: HEADERS });
      const data = await res.json();

      if (!data.data?.length) {
        return message.channel.send('No pude obtener el trending ahora mismo, intenta después 😔');
      }

      const top10 = data.data.slice(0, 10);

      const lista = top10.map((anime, i) => {
        const attr = anime.attributes;
        const rating = attr.averageRating ? `${parseFloat(attr.averageRating).toFixed(1)}/100` : 'Sin rating';
        const estado = traducirEstado(attr.status);
        const tipo = attr.subtype ?? '?';
        return `**${i + 1}.** ${attr.canonicalTitle}\n┗ ${tipo} • ${estado} • ⭐ ${rating}`;
      }).join('\n\n');

      const primero = top10[0].attributes;

      const embed = {
        color: 0xe74c3c,
        title: '🔥 Trending Anime ahora mismo',
        description: lista,
        thumbnail: { url: primero.posterImage?.medium ?? '' },
        footer: { text: 'Datos de Kitsu.io  •  Usa !dato [nombre] para saber más de uno' },
        timestamp: new Date().toISOString(),
      };

      await message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error('[trending.js]', err);
      message.channel.send('Se rompió algo buscando el trending 💀');
    }
  }
};

function traducirEstado(status) {
  const estados = {
    current:    '🟢 En emisión',
    finished:   '✅ Terminado',
    tba:        '⏳ Por confirmar',
    unreleased: '🔒 Sin estrenar',
    upcoming:   '📅 Próximamente',
  };
  return estados[status] ?? status;
}
