import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bans a user from the server')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to ban')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for the ban')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setDMPermission(false);

export async function execute(interaction) {
  try {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return await interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    if (user.id === interaction.user.id)
      return await interaction.reply({ content: '❌ You cannot ban yourself.', ephemeral: true });

    if (user.id === interaction.client.user.id)
      return await interaction.reply({ content: '❌ You cannot ban the bot.', ephemeral: true });

    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return await interaction.reply({ content: '❌ You cannot ban this user because they have a higher or equal role.', ephemeral: true });

    if (!member.bannable)
      return await interaction.reply({ content: '❌ I cannot ban this user. Check my role permissions.', ephemeral: true });

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setTitle('🔨 User Banned')
      .setColor('Red')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Banned By', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason, inline: false },
      )
      .setFooter({ text: `Banned at • ${new Date().toLocaleString()}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: '❌ Error executing command!', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
    }
  }
}
