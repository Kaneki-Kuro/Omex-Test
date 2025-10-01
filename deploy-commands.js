import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Register for a single guild (faster for testing)
const GUILD_ID = 'YOUR_TEST_GUILD_ID';

try {
  console.log('Started refreshing application (/) commands.');
  await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID), { body: commands });
  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
