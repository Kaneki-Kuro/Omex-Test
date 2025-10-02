import { PermissionsBitField } from 'discord.js';
import User from '../models/User.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // ===== Invite Link Protection =====
    if (message.content.includes('discord.gg')) {
      const isOwner = message.guild.ownerId === message.author.id;
      const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);

      if (!isOwner && !isAdmin) {
        await message.delete();
        await message.channel.send(`${message.author}, invite links are not allowed!`);
        return; // ⬅️ stop here (NO leveling check for invite messages)
      }
    }

    // ===== Leveling System =====
    let user = await User.findOne({ userId: message.author.id });
    if (!user) user = new User({ userId: message.author.id, xp: 0, level: 1 });

    user.xp += Math.floor(Math.random() * 10) + 1;

    if (user.xp >= user.level * 100) {
      user.level += 1;
      user.xp = 0;
      await message.channel.send(`${message.author}, you leveled up to level ${user.level}!`);
    }

    await user.save();
  }
};
