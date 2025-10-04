import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("userinfo")
  .setDescription("Shows detailed user info")
  .addUserOption(option =>
    option.setName("target")
      .setDescription("Select a user")
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const user = interaction.options.getUser("target") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "ID", value: user.id, inline: true },
        { name: "Username", value: user.username, inline: true },
        { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
        { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setColor("Purple")
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: "❌ Error executing command!", ephemeral: true });
    } else {
      await interaction.reply({ content: "❌ Error executing command!", ephemeral: true });
    }
  }
}
