import { PermissionsBitField } from 'discord.js';

// ===== Blocked Words List =====
const blockedWords = ['foo', 'bar', 'baz']; // Add your banned words here (lowercase)

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // ===== Owner/Admin Bypass =====
    const isOwner = message.guild.ownerId === message.author.id;
    const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
    if (isOwner || isAdmin) return;

    // ===== Blocked Words Check =====
    const foundWord = blockedWords.find(word => content.includes(word));
    if (foundWord) {
      await message.delete().catch(() => {}); // delete the message
      await message.channel.send(`${message.author}, that word is not allowed!`);
      return; // Stop further processing
    }
  }
};
