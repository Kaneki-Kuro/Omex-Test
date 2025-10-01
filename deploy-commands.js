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

try {
  console.log('Started refreshing global application (/) commands.');
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID), // Global commands
    { body: commands }
  );
  console.log('Successfully reloaded global application (/) commands.');
} catch (error) {
  console.error(error);
}
