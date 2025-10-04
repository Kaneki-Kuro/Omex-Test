import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Shows detailed info about a user')
  .addUserOption(option =>
    option
      .setName('target')
      .setDescription('Select a user')
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    // Get target user or default to command sender
    const user = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    // Roles excluding @everyone
    const roleList = member.roles.cache
      .filter(role => role.name !== '@everyone')
      .map(role => role.name)
      .join(', ') || 'No Roles';

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'User ID', value: `${user.id}`, inline: true },
        { name: 'Joined Server', value: `${member.joinedAt.toLocaleString()}`, inline: true },
        { name: 'Account Created', value: `${user.createdAt.toLocaleString()}`, inline: true },
        { name: 'Roles', value: `${member.roles.cache.size}`, inline: true },
        { name: 'Role List', value: roleList, inline: false }
      )
      .setColor('Blue')
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

  } catch (err) {
    console.error('❌ Error in userinfo:', err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
    } else {
      await interaction.editReply({ content: '❌ Error executing command!', ephemeral: true });
    }
  }
}
