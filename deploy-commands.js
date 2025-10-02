// deploy-commands.js
import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const { default: command } = await import(`./commands/${file}`);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
    }
  } catch (err) {
    console.error(`Error loading command ${file}:`, err);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} global application (/) commands.`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded ${commands.length} global application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
