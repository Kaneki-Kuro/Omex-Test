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
  try {
    const isSlash = typeof interactionOrMessage.isChatInputCommand === "function";

    let user;
    if (isSlash) {
      user = interactionOrMessage.options.getUser("target") || interactionOrMessage.user;
    } else {
      const message = interactionOrMessage;
      user =
        message.mentions.users.first() ||
        (args?.[0] ? await message.client.users.fetch(args[0]).catch(() => null) : null) ||
        message.author;
    }

    if (!user) {
      if (isSlash) {
        return await interactionOrMessage.reply({
          content: "❌ Couldn't find that user!",
          ephemeral: true
        });
      } else {
        return await interactionOrMessage.channel.send("❌ Couldn't find that user!");
      }
    }

    const member = await interactionOrMessage.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "ID", value: user.id, inline: true },
        { name: "Username", value: user.username, inline: true },
        { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
        {
          name: "Joined Server",
          value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "N/A",
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
      if (!interactionOrMessage.replied && !interactionOrMessage.deferred) {
        await interactionOrMessage.reply({ embeds: [embed] });
      }
    } else {
      await interactionOrMessage.channel.send({ embeds: [embed] });
    }

  } catch (err) {
    console.error("❌ Error in userinfo:", err);
    // safe error message
    if (interactionOrMessage.reply && !interactionOrMessage.replied && !interactionOrMessage.deferred) {
      await interactionOrMessage.reply({ content: "❌ Error executing command!", ephemeral: true });
    } else if (interactionOrMessage.channel) {
      await interactionOrMessage.channel.send("❌ Error executing command!");
    }
  }
}
