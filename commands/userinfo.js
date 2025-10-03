import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Shows detailed info about a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to get info about')
      .setRequired(false)
  );

export async function execute(interaction, args = []) {
  try {
    let user;
    let member;

    // Check if it's a slash command
    if (interaction.isChatInputCommand?.()) {
      user = interaction.options.getUser('user') || interaction.user;
      member = interaction.guild.members.cache.get(user.id);
    } else {
      // Prefix command: get first mention or ID from args
      user = interaction.mentions?.users?.first() || (args[0] ? await interaction.guild.members.fetch(args[0]).then(m => m.user).catch(() => null) : null) || interaction.user;
      member = interaction.guild.members.cache.get(user.id);
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTitle('User Info')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Username', value: `${user.username}`, inline: true },
        { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
        { name: 'ID', value: `${user.id}`, inline: true },
        { name: 'Bot?', value: `${user.bot ? 'Yes' : 'No'}`, inline: true },
        { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setColor('Blue')
      .setTimestamp();

    // Reply
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
}
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Shows detailed info about a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to get info about')
      .setRequired(false)
  );

export async function execute(interaction, args = []) {
  try {
    let user;
    let member;

    // Check if it's a slash command
    if (interaction.isChatInputCommand?.()) {
      user = interaction.options.getUser('user') || interaction.user;
      member = interaction.guild.members.cache.get(user.id);
    } else {
      // Prefix command: get first mention or ID from args
      user = interaction.mentions?.users?.first() || (args[0] ? await interaction.guild.members.fetch(args[0]).then(m => m.user).catch(() => null) : null) || interaction.user;
      member = interaction.guild.members.cache.get(user.id);
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTitle('User Info')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Username', value: `${user.username}`, inline: true },
        { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
        { name: 'ID', value: `${user.id}`, inline: true },
        { name: 'Bot?', value: `${user.bot ? 'Yes' : 'No'}`, inline: true },
        { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setColor('Blue')
      .setTimestamp();

    // Reply
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
}
