module.exports = {
  name: 'ayuda',
  aliases: ['help'],
  execute(message) {
    return message.channel.send(
      `📋 **Comandos de Chikolo:**\n\n` +
      `**🎮 Juegos:**\n` +
      `\`!ruleta\` → Ruleta rusa: alguien del canal de voz pierde y es muteado 30s\n` +
      `\`!blindtest\` → Adivina el sonido que suena\n` +
      `\`!doxeo [@alguien]\` → Doxeo falso (es puro bluff)\n\n` +
      `**📊 Stats:**\n` +
      `\`!ranking\` → Ranking de los más tóxicos del server\n\n` +
      `**🔊 Sonidos:**\n` +
      `\`!sound <nombre>\` → Reproduce sonido en canal de voz\n` +
      `\`!sounds\` → Lista de sonidos disponibles\n\n` +
      `**🗣️ Mencionando @Chikolo:**\n` +
      `\`que opinas de @alguien\` → Opinión random\n` +
      `\`predice / adivina @alguien\` → Predicción del futuro\n` +
      `\`insulta a alguien / @alguien\` → Insulto\n` +
      `\`recuerdame <cosa> en <N> mins\` → Temporizador\n` +
      `\`tira dado / tira dado 20\` → Dado\n` +
      `\`8ball <pregunta>\` → Bola mágica\n` +
      `\`que hora es\` → Hora de cualquier país\n` +
      `\`elige <A> o <B>\` → Decisión\n` +
      `\`numero random entre X y Y\` → Número\n` +
      `\`chiste\` → Chiste malo\n` +
      `\`verdad / reto\` → Verdad o reto\n` +
      `\`cara o sello\` → Moneda\n\n` +
      `**🌙 Modo borracho:** activo entre las 2am y 6am (hora Chile)\n`
    );
  }
};
