import { EmbedBuilder } from 'discord.js';

export default {
  name: 'userinfo',
  description: 'Shows info about a user',

  async execute(message, args) {
    try {
      // Get the user from mention or default to author
      const user = message.mentions.users.first() || message.author;
      const member = message.guild.members.cache.get(user.id);

      const embed = new EmbedBuilder()
        .setTitle(`${user.tag}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Username', value: `${user.username}`, inline: true },
          { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
          { name: 'ID', value: `${user.id}`, inline: true },
          { name: 'Bot', value: `${user.bot ? 'Yes' : 'No'}`, inline: true },
          { name: 'Joined Server', value: `${member ? member.joinedAt.toLocaleString() : 'N/A'}`, inline: true },
          { name: 'Roles', value: member ? member.roles.cache.filter(r => r.name !== '@everyone').map(r => r.name).join(', ') || 'No Roles' : 'N/A', inline: false }
        )
        .setColor('Blue')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await message.channel.send('❌ Error executing command!');
    }
  },
};
