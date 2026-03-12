const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────
const categorias = {
  juegos: {
    emoji: '🎮',
    label: 'Juegos',
    color: 0xFF4757,
    descripcion: 'Pa entretenerse con los weones del server',
    comandos: [
      { cmd: '`!ruleta`', desc: 'Ruleta rusa — alguien del canal de voz se lleva 30s muteado 💀' },
      { cmd: '`!blindtest`', desc: 'Adivina el sonido que suena, flaite culto' },
      { cmd: '`!doxeo [@alguien]`', desc: 'Doxeo falso — puro weeo, no se asuste' },
    ]
  },
  entretenimiento: {
    emoji: '🔮',
    label: 'Entretenimiento',
    color: 0xA855F7,
    descripcion: 'Comandos pa reírse y pasarlo bien',
    comandos: [
      { cmd: '`!misuerte <signo>`', desc: 'Tu horóscopo del día pero a lo chileno 🇨🇱' },
    ]
  },
  stats: {
    emoji: '📊',
    label: 'Stats',
    color: 0xF59E0B,
    descripcion: 'Pa saber quién es el mas xoro',
    comandos: [
      { cmd: '`!ranking`', desc: 'Ranking de los más xoros del server 👑' },
    ]
  },
  sonidos: {
    emoji: '🔊',
    label: 'Sonidos',
    color: 0x10B981,
    descripcion: 'Reproduce weás en el canal de voz',
    comandos: [
      { cmd: '`!sound <nombre>`', desc: 'Reproduce un sonido en el canal de voz' },
      { cmd: '`!sounds`', desc: 'Lista todos los sonidos disponibles' },
    ]
  },
  chikolo: {
    emoji: '🗣️',
    label: '@Chikolo',
    color: 0x3B82F6,
    descripcion: 'Mencioná a @Chikolo y dile lo que querís',
    comandos: [
      { cmd: '`que opinas de @alguien`', desc: 'Opinión random sobre alguien' },
      { cmd: '`predice / adivina @alguien`', desc: 'Predicción del futuro' },
      { cmd: '`insulta a @alguien`', desc: 'Insulto creativo garantizado' },
      { cmd: '`recuerdame <cosa> en <N> mins`', desc: 'Temporizador' },
      { cmd: '`tira dado / tira dado 20`', desc: 'Tira un dado' },
      { cmd: '`8ball <pregunta>`', desc: 'La bola mágica responde' },
      { cmd: '`que hora es`', desc: 'Hora de cualquier país' },
      { cmd: '`elige <A> o <B>`', desc: 'El bot decide por ti, weon' },
      { cmd: '`numero random entre X y Y`', desc: 'Número al azar' },
      { cmd: '`chiste`', desc: 'Chiste malo garantizado' },
      { cmd: '`verdad / reto`', desc: 'Verdad o reto random' },
      { cmd: '`cara o sello`', desc: 'Moneda al aire' },
    ]
  }
};

// ─── EMBED PRINCIPAL (MENÚ) ───────────────────────────────────────────────────
function buildMenuEmbed() {
  return new EmbedBuilder()
    .setColor(0x2B2D31)
    .setTitle('🤙  CHIKOLO BOT  🤙')
    .setDescription(
      '> *El bot más xoro del serv.*\n\n' +
      '**Elige una categoría** pa ver los comandos:\n\n' +
      Object.entries(categorias).map(([, cat]) =>
        `${cat.emoji} **${cat.label}** — ${cat.descripcion}`
      ).join('\n') +
      '\n\n🌙 **Modo curao** activo entre las **2am – 6am** (hora Chile)'
    )
    .setFooter({ text: 'Chikolo Bot • Hecho con ❤️ y pisco' })
    .setTimestamp();
}

// ─── EMBED DE CATEGORÍA ───────────────────────────────────────────────────────
function buildCategoryEmbed(catKey) {
  const cat = categorias[catKey];
  return new EmbedBuilder()
    .setColor(cat.color)
    .setTitle(`${cat.emoji}  ${cat.label.toUpperCase()}`)
    .setDescription(`*${cat.descripcion}*\n\u200b`)
    .addFields(
      cat.comandos.map(c => ({
        name: c.cmd,
        value: `↳ ${c.desc}`,
        inline: false,
      }))
    )
    .setFooter({ text: '← Vuelve al menú con el botón 🏠 Inicio' });
}

// ─── FILAS DE BOTONES ─────────────────────────────────────────────────────────
function buildButtons(activeCat = null) {
  const keys = Object.keys(categorias);

  const row1 = new ActionRowBuilder().addComponents(
    keys.slice(0, 3).map(key =>
      new ButtonBuilder()
        .setCustomId(`ayuda_cat_${key}`)
        .setLabel(`${categorias[key].emoji} ${categorias[key].label}`)
        .setStyle(activeCat === key ? ButtonStyle.Primary : ButtonStyle.Secondary)
    )
  );

  const row2 = new ActionRowBuilder().addComponents(
    ...keys.slice(3).map(key =>
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
      time: 120_000, // 2 minutos
    });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: 'Ese menú no es tuyo weon, escribe `!ayuda` tú mismo 😤',
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
