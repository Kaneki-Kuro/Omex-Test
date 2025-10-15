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

    // Prevent banning self or bot
    if (user.id === interaction.user.id)
      return await interaction.reply({ content: '❌ You cannot ban yourself.', ephemeral: true });
    if (user.id === interaction.client.user.id)
      return await interaction.reply({ content: '❌ You cannot ban the bot.', ephemeral: true });

    // Check role hierarchy
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return await interaction.reply({ content: '❌ You cannot ban this user because they have a higher or equal role.', ephemeral: true });

    // Check bannability
    if (!member.bannable)
      return await interaction.reply({ content: '❌ I cannot ban this user. Check my
