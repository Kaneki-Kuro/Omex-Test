import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// ===== Global Prefix =====
const PREFIX = '-';

// ===== Discord Bot Setup =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ===== Load Commands Dynamically =====
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const commandModule = await import(url.pathToFileURL(path.join(__dirname, 'commands', file)).href);
  if (commandModule?.data && commandModule?.execute) {
    client.commands.set(commandModule.data.name, commandModule);
    commands.push(commandModule.data.toJSON());
  } else {
    console.warn(`[WARNING] Command ${file} is missing "data" or "execute".`);
  }
}

// ===== Global Slash Command Registration =====
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🔄 Refreshing ${commands.length} global (/) commands...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log(`✅ Successfully registered ${commands.length} global (/) commands.`);
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
})();

// ===== Load Events =====
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const eventModule = await import(url.pathToFileURL(path.join(__dirname, 'events', file)).href);
  if (eventModule?.default) {
    const event = eventModule.default;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

// ===== Handle Slash Interactions Safely =====
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
    } else {
      await interaction.followUp({ content: '❌ Error executing command!', ephemeral: true });
    }
  }
});

// ===== Handle Prefix Commands =====
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    // Fake interaction object for backward compatibility
    const fakeInteraction = {
      user: message.author,
      channel: message.channel,
      guild: message.guild,
      replied: false,
      deferred: false,
      reply: async (options) => message.channel.send(options.content || options),
      editReply: async (options) => message.channel.send(options.content || options),
    };

    await command.execute(fakeInteraction, args);
  } catch (err) {
    console.error(err);
    message.channel.send('❌ Error executing command!');
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
