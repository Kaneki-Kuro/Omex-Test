import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows detailed server info'),

  async execute(interaction) {
    const guild = interaction.guild;

    // Fetch roles and mentionable roles
    const roleList = guild.roles.cache
      .filter(role => role.name !== '@everyone')
      .map(role => role.name)
      .join(', ') || 'No Roles';

    const categoryChannels = guild.channels.cache.filter(c => c.type === 4).size; // GUILD_CATEGORY = 4
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size; // GUILD_TEXT = 0
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size; // GUILD_VOICE = 2

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

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  },
};
