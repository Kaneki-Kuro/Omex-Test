import User from '../models/User.js';

export default {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    // AutoMod: delete Discord invites
    if (message.content.includes('discord.gg')) {
      await message.delete();
      message.channel.send(`${message.author}, invite links are not allowed!`);
    }

    // Leveling system
    let user = await User.findOne({ userId: message.author.id });
    if (!user) user = new User({ userId: message.author.id, xp: 0, level: 1 });

    user.xp += Math.floor(Math.random() * 10) + 1;
    if (user.xp >= user.level * 100) {
      user.level += 1;
      user.xp = 0;
      message.channel.send(`${message.author}, you leveled up to level ${user.level}!`);
    }

    await user.save();
  }
};
