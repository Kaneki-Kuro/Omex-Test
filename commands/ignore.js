import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// In-memory storage for ignored users (resets on bot restart)
const ignoredUsers = new Set();

export const data = new SlashCommandBuilder()
  .setName('ignore')
  .setDescription('Make the bot ignore a user')
  .addUserOption(option => 
    option.setName('user')
          .setDescription('Select a user to ignore')
          .setRequired(true)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user');

  if (ignoredUsers.has(user.id)) {
    ignoredUsers.delete(user.id);
    const embed = new EmbedBuilder()
      .setDescription(`✅ <@${user.id}> is no longer ignored.`)
      .setColor('Green');
    return interaction.reply({ embeds: [embed] });
  }

  ignoredUsers.add(user.id);
  const embed = new EmbedBuilder()
    .setDescription(`🚫 <@${user.id}> is now ignored by the bot.`)
    .setColor('Red');
  await interaction.reply({ embeds: [embed] });
}

// Export ignoredUsers so you can use it in other commands or events
export { ignoredUsers };
