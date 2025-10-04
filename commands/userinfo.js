// commands/userinfo.js
import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("userinfo")
  .setDescription("Get information about a user")
  .addUserOption(option =>
    option.setName("target").setDescription("Select a user").setRequired(false)
  );

export async function execute(interaction) {
  // Slash command execution
  const user = interaction.options.getUser("target") || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);

  const embed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`User Info - ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "ID", value: user.id, inline: true },
      { name: "Username", value: user.username, inline: true },
      { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
      { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
      { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

// ===== PREFIX COMMAND SUPPORT =====
export async function prefixExecute(message, args) {
  // Only run if message starts with "-"
  if (!message.content.startsWith("-userinfo")) return;

  const user =
    message.mentions.users.first() ||
    message.client.users.cache.get(args[0]) ||
    message.author;

  const member = await message.guild.members.fetch(user.id);

  const embed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`User Info - ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "ID", value: user.id, inline: true },
      { name: "Username", value: user.username, inline: true },
      { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
      { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
      { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: `Requested by ${message.author.tag}` })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}
```
