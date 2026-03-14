const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const VERSION = 'v1.3.0';

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────
const categorias = {
  juegos: {
    emoji: '🎮',
    label: 'Juegos',
    color: 0xFF4757,
    descripcion: 'pa entretenerse con los won del server',
    comandos: [
      { cmd: '`!ruleta`',           desc: 'Ruleta rusa — alguien del canal de voz se lleva 30s muteado' },
      { cmd: '`!blindtest`',        desc: 'Adivina el sonido que suena' },
      { cmd: '`!doxeo [@alguien]`', desc: 'Doxeo falso, puro weeo, no se asuste' },
    ]
  },
  entretenimiento: {
    emoji: '🔮',
    label: 'Entretenimiento',
    color: 0xA855F7,
    descripcion: 'pa reírse y pasarlo bien',
    comandos: [
      { cmd: '`!misuerte <signo>`', desc: 'Tu horóscopo del día pero a lo chileno' },
    ]
  },
  stats: {
    emoji: '📊',
    label: 'Stats',
    color: 0xF59E0B,
    descripcion: 'pa saber quién es el más xoro del server',
    comandos: [
      { cmd: '`!ranking`', desc: 'Ranking de los más xoros 👑' },
    ]
  },
  sonidos: {
    emoji: '🔊',
    label: 'Sonidos',
    color: 0x10B981,
    descripcion: 'reproduce cosas en el canal de voz',
    comandos: [
      { cmd: '`!sound <nombre>`', desc: 'Reproduce un sonido en el canal de voz' },
      { cmd: '`!sounds`',         desc: 'Lista todos los sonidos disponibles' },
    ]
  },
  anime: {
    emoji: '🎌',
    label: 'Anime',
    color: 0x7b2d8b,
    descripcion: 'info de anime pa los won cultivaos',
    comandos: [
      { cmd: '`!dato <anime>`',      desc: 'Dato random — episodios, rating, personajes...' },
      { cmd: '`!personaje <anime>`', desc: 'Personaje random con imagen, rol y seiyū' },
      { cmd: '`!trending`',          desc: 'Top 10 animes más populares ahora' },
    ]
  },
  config: {
    emoji: '⚙️',
    label: 'Config',
    color: 0x64748B,
    descripcion: 'ajustes del bot, solo pa el dueño',
    comandos: [
      { cmd: '`!prefix <nuevo>`', desc: 'Cambia el prefix de los comandos, ej: `!prefix ch`' },
    ]
  },
  chikolo: {
    emoji: '🗣️',
    label: '@Chikolo',
    color: 0x3B82F6,
    descripcion: 'mencioná a @Chikolo y dile lo que querí',
    comandos: [
      { cmd: '`que opinas de @x` / `insulta a @x` / `predice @x`', desc: 'Opiniones, insultos y predicciones' },
      { cmd: '`8ball <pregunta>` / `chiste` / `verdad` / `reto`',   desc: 'Respuestas mágicas y juegos' },
      { cmd: '`elige <A> o <B>` / `cara o sello` / `tira dado`',    desc: 'Decisiones al azar' },
      { cmd: '`numero random entre X y Y` / `que hora es`',         desc: 'Utilidades' },
      { cmd: '`recuerdame <cosa> en <N> mins`',                     desc: 'Temporizador' },
      { cmd: '`borra los últimos <N> mensajes`',                    desc: 'Limpia los mensajes del bot' },
    ]
  }
};

// ─── EMBED PRINCIPAL ──────────────────────────────────────────────────────────
function buildMenuEmbed() {
  const lineas = Object.entries(categorias).map(([, cat]) =>
    `${cat.emoji}  **${cat.label}** — *${cat.descripcion}*`
  ).join('\n');

  return new EmbedBuilder()
    .setColor(0x2B2D31)
    .setTitle('CHIKOLO BOT')
    .setDescription(
      '*El bot más xoro del serv.*\n\u200b\n' +
      lineas +
      '\n\u200b\n' +
      '> Elige una categoría abajo pa ver los comandos.\n' +
      '> Entre las **2am – 6am** (Chile) el modo curao está activo 🌙'
    )
    .setFooter({ text: `Chikolo Bot ${VERSION} • hecho con cariño y pisco` })
    .setTimestamp();
}

// ─── EMBED DE CATEGORÍA ───────────────────────────────────────────────────────
function buildCategoryEmbed(catKey) {
  const cat = categorias[catKey];

  return new EmbedBuilder()
    .setColor(cat.color)
    .setTitle(`${cat.emoji}  ${cat.label}`)
    .setDescription(`*${cat.descripcion}*\n\u200b`)
    .addFields(
      cat.comandos.map(c => ({
        name: c.cmd,
        value: `↳ ${c.desc}`,
        inline: false,
      }))
    )
    .setFooter({ text: `Chikolo Bot ${VERSION} • Vuelve al menú con el botón Inicio` });
}

// ─── BOTONES ──────────────────────────────────────────────────────────────────
function buildButtons(activeCat = null) {
  const keys = Object.keys(categorias);

  // row 1: primeras 4 categorías
  const row1 = new ActionRowBuilder().addComponents(
    keys.slice(0, 4).map(key =>
      new ButtonBuilder()
        .setCustomId(`ayuda_cat_${key}`)
        .setLabel(`${categorias[key].emoji} ${categorias[key].label}`)
        .setStyle(activeCat === key ? ButtonStyle.Primary : ButtonStyle.Secondary)
    )
  );

  // row 2: resto + botón inicio
  const row2 = new ActionRowBuilder().addComponents(
    ...keys.slice(4).map(key =>
      new ButtonBuilder()
        .setCustomId(`ayuda_cat_${key}`)
        .setLabel(`${categorias[key].emoji} ${categorias[key].label}`)
        .setStyle(activeCat === key ? ButtonStyle.Primary : ButtonStyle.Secondary)
    ),
    new ButtonBuilder()
      .setCustomId('ayuda_menu')
      .setLabel('🏠 Inicio')
      .setStyle(activeCat === null ? ButtonStyle.Success : ButtonStyle.Secondary)
  );

  return [row1, row2];
}

function buildDisabledButtons() {
  return buildButtons(null).map(row => {
    row.components.forEach(btn => btn.setDisabled(true));
    return row;
  });
}

// ─── COMANDO ──────────────────────────────────────────────────────────────────
module.exports = {
  name: 'ayuda',
  aliases: ['help'],
  async execute(message) {
    const msg = await message.channel.send({
      embeds: [buildMenuEmbed()],
      components: buildButtons(null),
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120_000,
    });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: 'ese menú no es tuyo won, escribe `!ayuda` tú mismo 😤',
          ephemeral: true,
        });
      }

      const id = interaction.customId;

      if (id === 'ayuda_menu') {
        await interaction.update({
          embeds: [buildMenuEmbed()],
          components: buildButtons(null),
        });
      } else if (id.startsWith('ayuda_cat_')) {
        const catKey = id.replace('ayuda_cat_', '');
        await interaction.update({
          embeds: [buildCategoryEmbed(catKey)],
          components: buildButtons(catKey),
        });
      }
    });

    collector.on('end', () => {
      msg.edit({ components: buildDisabledButtons() }).catch(() => {});
    });
  },
};
