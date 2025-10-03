import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Get detailed information about a user')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('Select a user')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('target') || interaction.user;
  const member = interaction.guild.members.cache.get(user.id);

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(`User Info: ${user.tag}`)
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .addFields(
      { name: '❯ Username', value: `${user.username}`, inline: true },
      { name: '❯ Discriminator', value: `#${user.discriminator}`, inline: true },
      { name: '❯ ID', value: `${user.id}`, inline: false },
      { name: '❯ Status', value: `${member.presence?.status || 'offline'}`, inline: true },
      { name: '❯ Roles', value: `${member.roles.cache.map(r => r).join(', ').slice(0, 1024) || 'None'}`, inline: false },
      { name: '❯ Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
      { name: '❯ Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
