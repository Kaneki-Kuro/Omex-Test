import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
const afkUsers = new Map();

export const data = new SlashCommandBuilder()
  .setName('afk set')
  .setDescription('Set your AFK status')
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for going AFK')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.user;
  const reason = interaction.options.getString('reason') || 'AFK';

  afkUsers.set(user.id, { reason, timestamp: Date.now() });

  const embed = new EmbedBuilder()
    .setDescription(`✅ You are now AFK: ${reason}`)
    .setColor('Yellow');

  await interaction.reply({ embeds: [embed] });
}

export { afkUsers };
