module.exports = {
  name: 'ruleta',
  async execute(message) {
    const canal = message.member?.voice?.channel;
    if (!canal) {
      return message.channel.send('Tiene que haber gente en un canal de voz pa jugar la ruleta mi xan 🎯');
    }

    const miembrosVoz = canal.members.filter(m => !m.user.bot);
    if (miembrosVoz.size < 2) {
      return message.channel.send('Necesito al menos 2 personas en el canal pa que tenga gracia la ruleta');
    }

    const victima = miembrosVoz.random();
    const sobrevivientes = miembrosVoz.filter(m => m.id !== victima.id);
    const sobrevivienteNombres = sobrevivientes.map(m => `**${m.user.username}**`).join(', ');

    await message.channel.send(`🎯 Girando la ruleta...`);
    await new Promise(r => setTimeout(r, 2000));
    await message.channel.send(`🔫 **¡BANG!** <@${victima.id}> perdió la ruleta rusa 💀\n${sobrevivienteNombres} se salva(n) por esta vez.`);

    // Intentar mutear si el bot tiene permisos
    try {
      await victima.voice.setMute(true, 'Perdió la ruleta rusa de Chikolo');
      await message.channel.send(`🔇 <@${victima.id}> muteado por 30 segundos, sufre.`);
      setTimeout(async () => {
        try {
          await victima.voice.setMute(false, 'Ruleta rusa terminó');
          message.channel.send(`🔊 <@${victima.id}> ya puede hablar de nuevo. Aprende a esquivar balas.`);
        } catch { /* ya salió del canal */ }
      }, 30000);
    } catch {
      message.channel.send(`*(No tengo permisos pa mutear, pero moralmente <@${victima.id}> debería callarse 30 segundos)*`);
    }
  }
};
