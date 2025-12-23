const { ezra } = require("../fredi/ezra");
const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "..", "data", "autoreply.json");

function ensureStore() {
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(storePath)) {
    const initial = {
      enabled: true,
      triggers: [
        { trigger: "hi", reply: "Hello 👋 I'm VIPERLUVBYTE — how can I help you?" },
        { trigger: "hello", reply: "Hey! I'm VIPERLUVBYTE. Need something?" },
        { trigger: "good morning", reply: "Good morning ☀️ Have a great day!" },
        { trigger: "good night", reply: "Good night 🌙 Sleep well!" },
        { trigger: "thanks", reply: "You're welcome! 😊" },
        { trigger: "help", reply: "Send +menu to see available commands." }
      ]
    };
    fs.writeFileSync(storePath, JSON.stringify(initial, null, 2));
  }
}

function loadStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(storePath));
  } catch (e) {
    return { enabled: false, triggers: [] };
  }
}

function saveStore(obj) {
  ensureStore();
  fs.writeFileSync(storePath, JSON.stringify(obj, null, 2));
}

let listenerAttached = false;
let currentListener = null;

function attachListener(zk) {
  if (listenerAttached) return;
  currentListener = async (update) => {
    const { messages } = update;
    for (const ms of messages) {
      if (!ms.message) continue;
      if (ms.key && ms.key.fromMe) continue;

      // prefer extended text or conversation
      const text = ms.message.conversation || ms.message.extendedTextMessage?.text || "";
      if (!text) continue;
      const cfg = loadStore();
      if (!cfg.enabled) continue;
      const tLower = text.toLowerCase().trim();

      for (const item of cfg.triggers) {
        const trig = item.trigger.toLowerCase().trim();
        if (!trig) continue;
        // exact match or contains
        if (tLower === trig || tLower.includes(trig)) {
          try {
            await zk.sendMessage(ms.key.remoteJid, { text: item.reply }, { quoted: ms });
          } catch (e) {
            // ignore send errors
          }
          break;
        }
      }
    }
  };

  zk.ev.on("messages.upsert", currentListener);
  listenerAttached = true;
}

function detachListener(zk) {
  if (!listenerAttached || !currentListener) return;
  try {
    zk.ev.off("messages.upsert", currentListener);
  } catch (e) {}
  listenerAttached = false;
  currentListener = null;
}

ezra({ nomCom: "ar", categorie: "Owner", reaction: "🤖", description: "Manage auto-replies (on/off/add/del/list)" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, superUser } = commandeOptions;

  if (!superUser) {
    return repondre("Only the bot owner or sudo can manage auto-replies.");
  }

  const cfg = loadStore();
  const sub = arg && arg.length ? arg[0].toLowerCase() : "";

  if (sub === "on" || sub === "enable") {
    cfg.enabled = true;
    saveStore(cfg);
    attachListener(zk);
    return repondre("Auto-reply has been enabled.");
  }

  if (sub === "off" || sub === "disable") {
    cfg.enabled = false;
    saveStore(cfg);
    // keep listener attached but disabled; optionally detach
    // detachListener(zk);
    return repondre("Auto-reply has been disabled.");
  }

  if (sub === "add") {
    const rest = arg.slice(1).join(" ");
    if (!rest || !rest.includes("|")) return repondre("Usage: ar add trigger|reply");
    const [trigger, reply] = rest.split("|").map(s => s.trim()).filter(Boolean);
    if (!trigger || !reply) return repondre("Both trigger and reply are required.");
    cfg.triggers.push({ trigger, reply });
    saveStore(cfg);
    return repondre(`Added auto-reply for '${trigger}'.`);
  }

  if (sub === "del" || sub === "remove") {
    const trigger = arg.slice(1).join(" ").trim();
    if (!trigger) return repondre("Usage: ar del trigger");
    const before = cfg.triggers.length;
    cfg.triggers = cfg.triggers.filter(t => t.trigger.toLowerCase() !== trigger.toLowerCase());
    saveStore(cfg);
    return repondre(before === cfg.triggers.length ? "No such trigger found." : `Removed trigger '${trigger}'.`);
  }

  if (sub === "list") {
    if (!cfg.triggers.length) return repondre("No auto-reply triggers configured.");
    let txt = "Auto-reply triggers:\n";
    cfg.triggers.forEach((t, i) => {
      txt += `${i + 1}. ${t.trigger} -> ${t.reply}\n`;
    });
    return repondre(txt);
  }

  if (sub === "status") {
    return repondre(`Auto-reply is ${cfg.enabled ? "enabled" : "disabled"}. Triggers: ${cfg.triggers.length}`);
  }

  // If no management subcommand, show help and ensure listener is attached
  attachListener(zk);
  return repondre("Auto-reply plugin ready. Use: ar on | off | add trigger|reply | del trigger | list | status");
});
