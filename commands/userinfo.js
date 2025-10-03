import { EmbedBuilder } from 'discord.js';

export default {
  name: 'userinfo',
  description: 'Shows detailed info about a user',

  async execute(interaction, args) {
    try {
      let member;

      // If prefix command: args[0] may be mention or ID
      if (args && args.length > 0) {
        const id = args[0].replace(/[<@!>]/g, '');
        member = await interaction.guild.members.fetch(id).catch(() => null);
      }

      // If no mention/ID, use the message author or interaction user
      if (!member) {
        member = interaction.guild.members.cache.get(interaction.user.id);
      }

      if (!member) {
        return interaction.reply({ content: '❌ Could not find that user!' });
      }

      const user = member.user;

      // Roles excluding @everyone
      const roleList = member.roles.cache
        .filter(r => r.name !== '@everyone')
        .map(r => r.name)
        .join(', ') || 'No Roles';

      // Create embed
      const embed = new EmbedBuilder()
        .setTitle(`${user.tag}'s Info`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'ID', value: `${user.id}`, inline: true },
          { name: 'Username', value: `${user.username}`, inline: true },
          { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
          { name: 'Bot?', value: `${user.bot ? 'Yes' : 'No'}`, inline: true },
          { name: 'Status', value: `${member.presence?.status || 'offline'}`, inline: true },
          { name: 'Joined Server', value: `${member.joinedAt.toLocaleString()}`, inline: true },
          { name: 'Roles', value: `${member.roles.cache.size}`, inline: true },
          { name: 'Role List', value: roleList, inline: false },
          { name: 'Account Created', value: `${user.createdAt.toLocaleString()}`, inline: true }
        )
        .setColor('Blue');

      // Send reply
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Error fetching user info!' });
    }
  },
};
