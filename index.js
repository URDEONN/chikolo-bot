require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ]
});

// ─── CARGAR COMANDOS PREFIX (!) ───────────────────────────────────────────────
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const loaded = require(`./commands/${file}`);
  const cmds = Array.isArray(loaded) ? loaded : [loaded];
  for (const cmd of cmds) {
    if (cmd.name && !cmd.data) {
      // Comando de prefix (!)
      client.commands.set(cmd.name, cmd);
      if (cmd.aliases) cmd.aliases.forEach(a => client.commands.set(a, cmd));
    }
  }
}

// ─── CARGAR SLASH COMMANDS (/) ────────────────────────────────────────────────
client.slashCommands = new Collection();
const slashFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
const slashCommandsData = [];

for (const file of slashFiles) {
  const cmd = require(`./commands/${file}`);
  if (cmd.data && cmd.execute) {
    client.slashCommands.set(cmd.data.name, cmd);
    slashCommandsData.push(cmd.data.toJSON());
  }
}

// ─── REGISTRAR SLASH COMMANDS EN DISCORD ─────────────────────────────────────
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);

  if (slashCommandsData.length > 0) {
    try {
      console.log(`🔄 Registrando ${slashCommandsData.length} slash command(s)...`);

      // Registrar globalmente (tarda hasta 1 hora en propagarse)
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: slashCommandsData }
      );

      // Si quieres registrar solo en un server (instantáneo, para pruebas):
      // await rest.put(
      //   Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
      //   { body: slashCommandsData }
      // );

      console.log(`✅ Slash commands registrados correctamente`);
    } catch (error) {
      console.error('❌ Error registrando slash commands:', error);
    }
  }
});

// ─── CARGAR EVENTOS ───────────────────────────────────────────────────────────
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

// ─── MANEJAR SLASH COMMANDS ───────────────────────────────────────────────────
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error ejecutando /${interaction.commandName}:`, error);
    const msg = { content: 'Cagó algo weon, intenta de nuevo 😬', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
