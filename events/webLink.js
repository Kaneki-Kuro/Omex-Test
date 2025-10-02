export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // ===== Website Link Protection =====
    const websitePattern = /(https?:\/\/[^\s]+)/i;

    // Allow admins/owner
    const isOwner = message.guild.ownerId === message.author.id;
    const isAdmin = message.member.permissions.has('Administrator');

    if (websitePattern.test(message.content) && !isOwner && !isAdmin) {
      await message.delete();
      await message.channel.send(`${message.author}, posting website links is not allowed!`);
      return; // Stop further processing for this message
    }
  }
};
