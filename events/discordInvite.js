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
        return; // stop here
      }
    }

  } // end of execute
}; // end of export default
