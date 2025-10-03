import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows information about a user')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The user you want info about')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      // Get the user, default to interaction user if none provided
      const user = interaction.options.getUser('target') || interaction.user;
      const member = interaction.guild.members.cache.get(user.id);

      // Create embed
      const embed = new EmbedBuilder()
        .setTitle(`${user.tag}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Username', value: `${user.username}`, inline: true },
          { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
          { name: 'ID', value: `${user.id}`, inline: true },
          { name: 'Bot', value: `${user.bot ? 'Yes' : 'No'}`, inline: true },
          { name: 'Account Created', value: `${user.createdAt.toLocaleString()}`, inline: true },
          { name: 'Joined Server', value: member ? `${member.joinedAt.toLocaleString()}` : 'N/A', inline: true },
          { name: 'Roles', value: member ? member.roles.cache.filter(r => r.name !== '@everyone').map(r => r.name).join(', ') || 'No roles' : 'N/A', inline: false }
        )
        .setColor('Blue');

      // Reply safely
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: '❌ Error executing command!', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
      }
    }
  },
};
