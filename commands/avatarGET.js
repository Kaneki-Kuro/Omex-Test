import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('avatar') // command name
  .setDescription('Get the avatar of a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to get the avatar of')
      .setRequired(false)
  );

export async function execute(interaction) {
  // Get the user mentioned or default to the command user
  const user = interaction.options.getUser('user') || interaction.user;

  // Create embed with avatar
  const embed = new EmbedBuilder()
    .setTitle(`${user.username}'s Avatar`)
    .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setColor('Random')
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
