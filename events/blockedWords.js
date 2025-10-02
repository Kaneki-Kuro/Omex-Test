import { PermissionsBitField } from 'discord.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // ===== Blocked Words List =====
    const blockedWords = ['Fuck', 'Bitch', 'Bastard']; // add your banned words here
    const content = message.content.toLowerCase();

    // Allow Owner/Admins
    const isOwner = message.guild.ownerId === message.author.id;
    const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!isOwner && !isAdmin) {
      const foundWord = blockedWords.find(word => content.includes(word));
      if (foundWord) {
        await message.delete();
        await message.channel.send(`${message.author}, that word is not allowed!`);
        return; // Stop processing this message
      }
    }
  }
};
