module.exports = {
  name: 'ranking',
  execute(message, args, client, estado) {
    const ranking = Object.entries(estado.rankingToxicos)
      .sort((a, b) => b[1].puntos - a[1].puntos)
      .slice(0, 10);

    if (ranking.length === 0) {
      return message.channel.send('Nadie ha dicho nada tóxico todavía... raro.');
    }

    const medallas = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    const lista = ranking.map(([, data], i) =>
      `${medallas[i]} **${data.nombre}** — ${data.puntos} garabatos`
    ).join('\n');

    return message.channel.send(
      `🏆 **Ranking de Tóxicos del Server**\n*(se reinicia cuando el bot se reinicia)*\n\n${lista}`
    );
  }
};
