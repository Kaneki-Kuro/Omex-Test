import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import mongoose from 'mongoose';
import express from 'express';

// ===== Discord Bot Setup =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ===== Load Commands =====
client.commands = new Collection();
const commands = []; // will hold slash command data

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON()); // prepare for deploy
  } else {
    console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
  }
}

// ===== Auto-Deploy Slash Commands Globally =====
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🔄 Refreshing ${commands.length} global (/) commands...`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // Global deploy
      { body: commands },
    );
    console.log(`✅ Successfully registered ${commands.length} global (/) commands.`);
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
})();

// ===== Load Events =====
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const { default: event } = await import(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ===== Handle Interactions =====
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: '❌ There was an error executing this command!', ephemeral: true });
  }
});

// ===== Login Bot =====
client.login(process.env.TOKEN);

// ===== Express Server for UptimeRobot =====
const app = express();
app.get("/", (req, res) => {
  res.send("Omex bot is running 🚀");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
