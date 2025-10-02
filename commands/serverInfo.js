import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows detailed server info'),

  async execute(interaction) {
    try {
      const guild = interaction.guild;

      // Roles excluding @everyone
      const roleList = guild.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name)
        .join(', ') || 'No Roles';

      // Channels count
      const categoryChannels = guild.channels.cache.filter(c => c.type === 4).size; // GUILD_CATEGORY
      const textChannels = guild.channels.cache.filter(c => c.type === 0).size; // GUILD_TEXT
      const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size; // GUILD_VOICE

      // Create embed
      const embed = new EmbedBuilder()
        .setTitle(`${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
          { name: 'Category Channels', value: `${categoryChannels}`, inline: true },
          { name: 'Text Channels', value: `${textChannels}`, inline: true },
          { name: 'Voice Channels', value: `${voiceChannels}`, inline: true },
          { name: 'Role List', value: roleList, inline: false },
          { name: 'Server ID | Created', value: `${guild.id} | ${guild.createdAt.toLocaleString()}` }
        )
        .setColor('Blue');

      // Reply properly
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      // Send ephemeral error message
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: '❌ Error executing command!', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
      }
    }
  },
};
