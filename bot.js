// bot.js
import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import cors from "cors";

// --- Discord Bot ---
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ]
});

let pronouns = {}; // store pronouns by user ID

client.on("messageCreate", msg => {
  if (msg.content.startsWith("!pronouns")) {
    const value = msg.content.split(" ").slice(1).join(" ");
    pronouns[msg.author.id] = value;
    msg.reply(`Saved your pronouns: ${value}`);
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN not set!");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);

// --- Express API ---
const app = express();

// ENABLE CORS
app.use(cors({
  origin: '*', // allow all domains; replace with your website for production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Pronouns endpoint
app.get("/pronouns/:id", (req, res) => {
  const id = req.params.id;
  res.json({ pronouns: pronouns[id] || "Not set" });
});

// Listen on Render's dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
