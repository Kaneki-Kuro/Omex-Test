import { SlashCommandBuilder, EmbedBuilder, InteractionResponseType, InteractionResponseFlags } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows detailed server info'),

  async execute(interaction) {
    try {
      // Defer reply first
      await interaction.deferReply({ ephemeral: false });

      const guild = interaction.guild;

      // Roles list
      const roleList = guild.roles.cache
        .filter(r => r.name !== '@everyone')
        .map(r => r.name)
        .join(', ') || 'No Roles';

      // Channels
      const categoryChannels = guild.channels.cache.filter(c => c.type === 4).size;
      const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
      const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;

      // Embed
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

      // Edit the deferred reply
      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Error executing command!', flags: InteractionResponseFlags.Ephemeral });
      } else {
        await interaction.editReply({ content: '❌ Error executing command!' });
      }
    }
  },
};
