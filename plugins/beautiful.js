const { ezra } = require('../fredi/ezra');

ezra({
  nomCom: 'beautiful',
  aliases: ['stylish','shine'],
  categorie: 'Fredi-Extra',
  reaction: '✨'
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const caption = `✨ Welcome to VIPERLUVBYTE ✨\n\n` +
    `• Owner: T20_STARBOY\n` +
    `• Channel: https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d\n` +
    `• Group: https://chat.whatsapp.com/DJMA7QOT4V8FuRD6MpjPpt?mode=ems_copy_t\n\n` +
    `╭─ ✦ Stylish Commands ✦ ─╮\n` +
    `│ • .menu — Fancy command list\n` +
    `│ • .beautiful — This card\n` +
    `│ • .logo — Generate a logo\n` +
    `╰─────────────────────╯\n\n` +
    `Made with ❤ by T20_STARBOY`;

  try {
    await zk.sendMessage(dest, {
      image: { url: 'https://files.catbox.moe/d83yip.png' },
      caption,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420222821450@newsletter',
          newsletterName: 'blaze tech',
          serverMessageId: -1
        },
        externalAdReply: {
          title: '✨VIPERLUVBYTE✨',
          body: 'Stylish Card',
          thumbnailUrl: 'https://files.catbox.moe/d83yip.png',
          sourceUrl: 'https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });
  } catch (e) {
    console.error('Beautiful command error', e);
    repondre('An error occurred while sending the stylish card.');
  }
});
