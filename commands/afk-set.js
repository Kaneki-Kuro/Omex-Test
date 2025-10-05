import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// Store AFK users
const afkUsers = new Map();

// ===== Slash Command: /afk set =====
export const data = new SlashCommandBuilder()
  .setName('afk') // main command
  .setDescription('AFK commands')
  .addSubcommand(sub =>
    sub.setName('set') // /afk set
      .setDescription('Set your AFK status')
      .addStringOption(option =>
        option.setName('reason')
          .setDescription('Reason for going AFK')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  if (interaction.options.getSubcommand() !== 'set') return;

  const user = interaction.user;
  const reason = interaction.options.getString('reason') || 'AFK';

  // Set user as AFK
  afkUsers.set(user.id, { reason, timestamp: Date.now() });

  const embed = new EmbedBuilder()
    .setDescription(`✅ You are now AFK\nReason: \`${reason}\``)
    .setColor('Yellow');

  await interaction.reply({ embeds: [embed] });
}

export { afkUsers };

// ===== Message Handler =====
export async function handleMessage(message) {
  if (message.author.bot) return;

  const userId = message.author.id;

  // 1️⃣ Remove AFK if the author was AFK
  if (afkUsers.has(userId)) {
    const afkData = afkUsers.get(userId);
    const afkTimeMs = Date.now() - afkData.timestamp;
    const minutes = Math.floor(afkTimeMs / 60000);
    const seconds = Math.floor((afkTimeMs % 60000) / 1000);

    const embed = new EmbedBuilder()
      .setTitle('🏠 Welcome Back!')
      .setDescription(`${message.author} is back from AFK.\nAFK Duration: ${minutes}m ${seconds}s`)
      .setFooter({
        text: `AFK Start: <t:${Math.floor(afkData.timestamp / 1000)}:F> | Back: <t:${Math.floor(Date.now() / 1000)}:F>`
      })
      .setColor('Green');

    await message.channel.send({ embeds: [embed] });
    afkUsers.delete(userId);
  }

  // 2️⃣ Notify if someone mentions an AFK user (without pinging)
  message.mentions.users.forEach(async mentionedUser => {
    if (afkUsers.has(mentionedUser.id)) {
      const afkInfo = afkUsers.get(mentionedUser.id);
      const embed = new EmbedBuilder()
        .setDescription(`💤 **${mentionedUser.username}** is currently AFK\nReason: \`${afkInfo.reason}\``)
        .setColor('Orange')
        .setFooter({
          text: `AFK Start: <t:${Math.floor(afkInfo.timestamp / 1000)}:F>`
        });

      await message.reply({ embeds: [embed], allowedMentions: { users: [] } });
    }
  });
}
