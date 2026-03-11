const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const signos = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

const emojisSigno = {
  'Aries': '🐏', 'Tauro': '🐂', 'Géminis': '👯', 'Cáncer': '🦀',
  'Leo': '🦁', 'Virgo': '🌾', 'Libra': '⚖️', 'Escorpio': '🦂',
  'Sagitario': '🏹', 'Capricornio': '🐐', 'Acuario': '🪣', 'Piscis': '🐟'
};

const horoscopos = {
  'Aries': [
    'Oye weon, hoy día te vai a comer el mundo o te vai a quedar pegao en la cama viendo tiktoks. No hay término medio po.',
    'Los astros te dicen que alguien te va a tirar la mano hoy, pero tú como siempre vai a estar mirando el celular. Cachai o no cachai?',
    'Marte te tiene con las pilas puestas hoy weon. Aprovecha de cobrar esa plata que te deben porque si no, chao no más.',
  ],
  'Tauro': [
    'Tú y la comida son una sola cosa hoy día. No gastes toda la plata en delivery weon, que después andas llorando.',
    'Venus te ilumina pero tú tienes la billetera más seca que el desierto de Atacama. Quizás hoy se da vuelta la tortilla po.',
    'Los astros dicen que te mereces un descanso. Todos los días dicen lo mismo contigo, weon, sal a hacer algo.',
  ],
  'Géminis': [
    'Hoy día tienes dos personalidades más de lo normal. Decide de una vez qué vai a hacer con tu vida, ctm.',
    'Alguien de tu pasado te va a escribir hoy. Déjalo en visto no más, tú ya sabes cómo terminó esa historia.',
    'Mercurio te tiene con la lengua suelta. Cuidado con lo que decís hoy porque te vai a mandar una cagá.',
  ],
  'Cáncer': [
    'Hoy día vas a llorar por algo que pasó hace tres años. Normal en ti weon, ya sabemos cómo soi.',
    'La Luna te tiene sensible. Cualquier cosa te va a parecer una ofensa personal. Respira antes de mandar ese audio.',
    'Hoy es buen día pa hablar con tu mamá. O pa comer lo que ella hace. Preferentemente lo segundo.',
  ],
  'Leo': [
    'Oye cuico, hoy día todos te van a mirar. Quizás porque traes algo en la cara, no sé. Igual aprovecha.',
    'El Sol te da energía de más hoy. Cuidado con decirle a todo el mundo cómo hacer las cosas, que ya estai cansando.',
    'Hoy día vas a ser el centro de atención. Como siempre po, no es novedad contigo. Al menos invita algo pa la once.',
  ],
  'Virgo': [
    'Hoy día vai a encontrar un error en algo que nadie más vio. Felicidades, igual nadie te va a agradecer weon.',
    'Los astros te piden que descanses pero tú vai a hacer una lista de pendientes igual. Así soi tú.',
    'Alguien va a hacer algo mal y tú lo vai a saber. Decide si le decís o te guardai esa rabia pa ti.',
  ],
  'Libra': [
    'Hoy día no puedes decidir ni qué comer. Los astros tampoco saben qué hacer contigo, honestamente.',
    'Alguien te va a pedir tu opinión y tú vas a decir "igual, lo que quierai tú". Típico po.',
    'Venus te tiene carismático hoy. Úsalo pa pedir ese favor que llevai meses postergando.',
  ],
  'Escorpio': [
    'Tú ya sabías que esto iba a pasar. Siempre sabís todo y nunca decís nada. Misterioso el weon.',
    'Hoy día alguien te va a tratar de engañar. Mala idea de su parte, porque tú tenís memoria de elefante y venganza de cangrejo.',
    'Los astros ven mucho fuego en ti hoy. Channéalo pa algo útil antes de que le mandeis un mensaje pasado de copas a alguien.',
  ],
  'Sagitario': [
    'Hoy día se te va a ocurrir un viaje que no puedes pagar. Como siempre weon, soñai en grande y gastai en más.',
    'Júpiter te tiene con energía aventurera. Lo más lejos que vai a llegar hoy es al Líder del barrio, pero bueno.',
    'Alguien te va a decir una verdad que no querías escuchar. Tú igual la sabías pero preferiste ignorarla.',
  ],
  'Capricornio': [
    'Trabajai más que todos y ganai lo mismo. Los astros te dicen que eso no está bien pero tampoco te dan solución.',
    'Hoy día podrías descansar un poco. Pero no vai a poder porque tenís mil cosas pendientes que nadie te pidió que hicieras.',
    'Saturno te tiene con cara de jefe hoy. Alguien te va a pedir consejo financiero y por una vez en tu vida, cóbrale.',
  ],
  'Acuario': [
    'Hoy tenís una idea revolucionaria que nadie va a entender. Como todas las semanas po, pero esta vez quizás sí.',
    'Los astros ven que tienes razón en algo importante, pero la estáis explicando tan raro que nadie te pesca.',
    'Alguien de tu pasado necesita ayuda. Tú vai a ayudar porque soi así, pero después no llores si no te lo agradecen.',
  ],
  'Piscis': [
    'Hoy día vai a vivir en tu cabeza más de lo normal. Suerte con eso, que ahí adentro hai cosas raras.',
    'Los astros ven lágrimas... o quizás es que viste un video de perritos. Con Piscis nunca se sabe.',
    'Neptuno te tiene soñador. Bájate de la nube un momento y paga esa cuenta que llevai postergando hace dos meses.',
  ],
};

const suerte = [
  'Un completo italiano', 'El asiento del fondo en la micro', 'Encontrar $500 en el bolsillo',
  'Un abrazo de tu mamá', 'Que el WiFi funcione bien', 'Una empanada de pino',
  'Pillar estacionamiento a la primera', 'Que no haya fila en la caja', 'Un meme que te manden',
  'Que no llueva cuando salgas', 'Un tecito con galletas', 'Que te paguen lo que te deben',
];

const colores = [0xFF6B6B, 0xFFD93D, 0x6BCB77, 0x4D96FF, 0xFF922B, 0xCC5DE8];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('horoscopo_flaite')
    .setDescription('Tu horóscopo del día, pero a lo chileno 🔮')
    .addStringOption(option =>
      option.setName('signo')
        .setDescription('¿Cuál es tu signo?')
        .setRequired(true)
        .addChoices(
          ...signos.map(s => ({ name: s, value: s }))
        )
    ),

  async execute(interaction) {
    const signo = interaction.options.getString('signo');
    const predicciones = horoscopos[signo];
    const prediccion = predicciones[Math.floor(Math.random() * predicciones.length)];
    const suerteDia = suerte[Math.floor(Math.random() * suerte.length)];
    const emoji = emojisSigno[signo];
    const color = colores[Math.floor(Math.random() * colores.length)];

    const diasSuerte = Math.floor(Math.random() * 7) + 1;
    const numeroDeSuerte = Math.floor(Math.random() * 100);

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${emoji} Horóscopo Flaite — ${signo} ${emoji}`)
      .setDescription(`*"${prediccion}"*`)
      .addFields(
        { name: '🍀 Tu suerte hoy', value: suerteDia, inline: true },
        { name: '🔢 Número de suerte', value: `${numeroDeSuerte}`, inline: true },
        { name: '📅 Días buenos esta semana', value: `${diasSuerte} de 7`, inline: true },
      )
      .setFooter({ text: 'Los astros hablan, weon. Escúchalos.' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
