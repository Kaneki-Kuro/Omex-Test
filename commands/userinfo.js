import { EmbedBuilder } from "discord.js";

export const data = {
  name: "userinfo"
};

export async function execute(interactionOrMessage, args) {
  try {
    const isSlash = typeof interactionOrMessage.isChatInputCommand === "function";

    // Determine user
    let user;
    if (isSlash) {
      user = interactionOrMessage.options.getUser("target") || interactionOrMessage.user;
    } else {
      const message = interactionOrMessage;
      user = message.mentions.users.first() || message.author;
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "ID", value: user.id, inline: true },
        { name: "Username", value: user.username, inline: true },
        { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
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
    if (interactionOrMessage.channel) {
      await interactionOrMessage.channel.send("❌ Error executing command!");
    }
  }
}
