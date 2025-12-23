const { ezra } = require(__dirname + "/../fredi/ezra");

// Simple "beautiful" command that sends a stylized message with the bot thumbnail
ezra({
    nomCom: "beautiful",
    reaction: "✨",
    aliases: ["beauty","pretty"],
    desc: "Send a beautiful styled message",
    categorie: "VIPERLUVBYTE-Menu"
}, async (dest, zk, context) => {
    const { respond, prefix, nomAuteurMessage } = context;
    const text = `✨ 𝓑𝓮𝓪𝓾𝓽𝓲𝓯𝓾𝓵 𝓜𝓮𝓼𝓼𝓪𝓰𝓮 ✨\n\nHello ${nomAuteurMessage || ''}!\nYou are shining today. Keep creating and smiling.\n\n• Bot: VIPERLUVBYTE\n• Owner: T20_STARBOY\n• Channel: https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d\n• Group: https://chat.whatsapp.com/DJMA7QOT4V8FuRD6MpjPpt?mode=ems_copy_t`;

    try {
        await zk.sendMessage(dest, {
            image: { url: "https://files.catbox.moe/d83yip.png" },
            caption: text,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420222821450@newsletter',
                    newsletterName: 'blaze tech',
                    serverMessageId: -1
                }
            }
        });
    } catch (e) {
        console.error('beautiful cmd error', e);
        respond('Sorry, something went wrong while sending the beautiful message.');
    }
});
