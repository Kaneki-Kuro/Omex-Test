```js
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Generate an AI image from a prompt")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Describe what you want to generate")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("style")
        .setDescription("Choose an art style")
        .setRequired(true)
        .addChoices(
          { name: "Default", value: "default" },
          { name: "Realistic", value: "realistic" },
          { name: "Anime", value: "anime" },
          { name: "Pixar Style", value: "pixar" },
          { name: "Sticker", value: "sticker" },
          { name: "Cyberpunk", value: "cyberpunk" },
          { name: "Oil Painting", value: "oil painting" }
        )
    ),

  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    const style = interaction.options.getString("style");

    // Send initial progress message
    let progressMsg = await interaction.reply({
      content: `🎨 Generating your **${style}** image... (0%)`,
      fetchReply: true,
    });

    // Fake progress updates
    let percent = 0;
    const progressInterval = setInterval(async () => {
      percent += Math.floor(Math.random() * 25) + 10;
      if (percent >= 100) percent = 100;
      await progressMsg.edit({
        content: `🎨 Generating your **${style}** image... (${percent}%)`,
      });
      if (percent === 100) clearInterval(progressInterval);
    }, 1500);

    try {
      // Generate image with OpenAI
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `${prompt} in ${style} style`,
        size: "1024x1024",
      });

      const imageUrl = response.data[0].url;

      const embed = new EmbedBuilder()
        .setTitle("✨ Your AI Image")
        .setDescription(`Prompt: \`${prompt}\`\nStyle: **${style}**`)
        .setImage(imageUrl)
        .setColor("Purple");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("retry")
          .setLabel("🔄 Retry (different style)")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setLabel("⬇️ Download")
          .setStyle(ButtonStyle.Link)
          .setURL(imageUrl)
      );

      await progressMsg.edit({
        content: "",
        embeds: [embed],
        components: [row],
      });

      // Button handling
      const collector = progressMsg.createMessageComponentCollector({
        time: 60_000,
      });

      collector.on("collect", async (btn) => {
        if (btn.customId === "retry") {
          await btn.reply({
            content: "🔄 Please use `/imagine` again with another style!",
            ephemeral: true,
          });
        }
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Failed to generate image.");
    }
  },
};
```
