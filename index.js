// index.js
import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("Put DISCORD_TOKEN in .env");
  process.exit(1);
}

// Create a client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Ready handler
client.once('ready', () => {
  console.log(`Omex online as ${client.user.tag}`);
});

// Simple message command (prefix)
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong! 🏓');
  }
});

// Register one simple slash command (/ping) for your development guild
const register = async () => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  const pingCmd = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');
  try {
    // Replace GUILD_ID with your test server ID to register fast during development.
    const GUILD_ID = 'PUT_YOUR_TEST_GUILD_ID_HERE';
    await rest.put(Routes.applicationGuildCommands(client.user?.id || (await rest.get(Routes.oauth2CurrentApplication())).id, GUILD_ID), { body: [pingCmd.toJSON()] });
    console.log('Slash command registered.');
  } catch (err) {
    console.error('Failed to register command (ignore if first run):', err);
  }
};

// Slash command handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong! (slash) 🏓');
  }
});

// Login then register commands
client.login(TOKEN).then(() => {
  // after login we can register guild commands (do one-time during dev)
  register().catch(console.error);
});
