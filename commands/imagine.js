import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("style")
    .setDescription("Generate an image in a given style")
    .addStringOption(option =>
      option
        .setName("prompt")
        .setDescription("Describe what you want")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("style")
        .setDescription("Choose a style")
        .setRequired(true)
        .addChoices(
          { name: "Default", value: "default" },
          { name: "Realistic", value: "realistic" },
          { name: "Anime", value: "anime" },
          { name: "Pixar Style", value: "pixar" },
          { name: "Sticker", value: "sticker" },
          { name: "Cyberpunk", value: "cyberpunk" },
          { name: "Oil Painting", value: "oilpainting" }
        )
    ),

  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    const style = interaction.options.getString("style");

    // Initial reply showing progress
    await interaction.reply(`🎨 Generating your image... (style: ${style}, speed: fast)`);

    // Simulate some progress with timeout
    setTimeout(async () => {
      // Normally, here you'd call your image generation API (e.g. Stable Diffusion, OpenAI, etc.)
      // For example: const imageUrl = await generateImage(prompt, style);
      const imageUrl = "https://placehold.co/600x400/png?text=Generated+" + style;

      // Create embed
      const embed = new EmbedBuilder()
        .setTitle("✅ Image Generated")
        .setDescription(`**Prompt:** ${prompt}\n**Style:** ${style}`)
        .setImage(imageUrl)
        .setColor("Purple");

      // Create buttons
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

      // Edit reply with embed + buttons
      await interaction.editReply({
        content: "",
        embeds: [embed],
        components: [row]
      });
    }, 4000); // 4s delay to simulate generation
  }
};
