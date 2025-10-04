import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
const afkUsers = new Map();

// ===== Slash Command: /afk-set =====
export const data = new SlashCommandBuilder()
  .setName('afk-set') // ✅ correct: no spaces
  .setDescription('Set your AFK status')
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for going AFK')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.user;
  const reason = interaction.options.getString('reason') || 'AFK';

  afkUsers.set(user.id, { reason, timestamp: Date.now() });

  const embed = new EmbedBuilder()
    .setDescription(`✅ You are now AFK: ${reason}`)
    .setColor('Yellow');

  await interaction.reply({ embeds: [embed] });
}

export { afkUsers };

// ===== Message Handler for AFK =====
export async function handleMessage(message) {
  if (message.author.bot) return;

  // 1️⃣ If the author was AFK, remove AFK
  const afkData = afkUsers.get(message.author.id);
  if (afkData) {
    const afkTime = Date.now() - afkData.timestamp;
    const minutes = Math.floor(afkTime / 60000);
    const seconds = Math.floor((afkTime % 60000) / 1000);

    const embed = new EmbedBuilder()
      .setTitle('🏠 Welcome Back!')
      .setDescription(`${message.author} is back from AFK after ${minutes}m ${seconds}s.`)
      .setFooter({
        text: `AFK Start: <t:${Math.floor(afkData.timestamp / 1000)}:F> | Back: <t:${Math.floor(Date.now() / 1000)}:F>`
      })
      .setColor('Green');

    await message.channel.send({ embeds: [embed] });
    afkUsers.delete(message.author.id);
  }

  // 2️⃣ If someone mentions an AFK user
  message.mentions.users.forEach(async user => {
    if (afkUsers.has(user.id)) {
      const afkInfo = afkUsers.get(user.id);
      const embed = new EmbedBuilder()
        .setDescription(`💤 **${user.username}** is currently AFK\nReason: ${afkInfo.reason}`)
        .setColor('Orange');

      await message.reply({ embeds: [embed], ephemeral: true }); // only visible to mentioner
    }
  });
}
