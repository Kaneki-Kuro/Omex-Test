import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("userinfo")
  .setDescription("Shows info about a user")
  .addUserOption(option =>
    option.setName("target")
      .setDescription("The user to get info about")
      .setRequired(false)
  );

export async function execute(interactionOrMessage, args) {
  // Detect if it's slash or prefix
  const isSlash = !!interactionOrMessage.isChatInputCommand;

  let user;
  if (isSlash) {
    // Slash command case
    user = interactionOrMessage.options.getUser("target") || interactionOrMessage.user;
  } else {
    // Prefix case
    const message = interactionOrMessage;
    user =
      message.mentions.users.first() ||
      (args?.[0] ? await message.client.users.fetch(args[0]).catch(() => null) : null) ||
      message.author;
  }

  if (!user) {
    if (isSlash) {
      return interactionOrMessage.reply({ content: "❌ Couldn't find that user!", ephemeral: true });
    } else {
      return interactionOrMessage.channel.send("❌ Couldn't find that user!");
    }
  }

  const member = await interactionOrMessage.guild.members.fetch(user.id);

  const embed = new EmbedBuilder()
    .setTitle(`${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "ID", value: user.id, inline: true },
      { name: "Username", value: user.username, inline: true },
      { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
      {
        name: "Joined Server",
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true
      },
      {
        name: "Account Created",
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        inline: true
      }
    )
    .setColor("Purple")
    .setFooter({
      text: `Requested by ${isSlash ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`,
      iconURL: (isSlash ? interactionOrMessage.user : interactionOrMessage.author).displayAvatarURL()
    })
    .setTimestamp();

  if (isSlash) {
    await interactionOrMessage.reply({ embeds: [embed] });
  } else {
    await interactionOrMessage.channel.send({ embeds: [embed] });
  }
}
