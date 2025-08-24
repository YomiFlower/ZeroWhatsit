// bot.js
import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import cors from "cors";

// --- Discord Bot Setup ---
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

// Login the bot
if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN is not set!");
  process.exit(1);
}
client.login(process.env.DISCORD_TOKEN);

// --- Express API Setup ---
const app = express();

// CORS: allow any origin (works for testing). For production, replace '*' with your domain
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Pronouns endpoint
app.get("/pronouns/:id", (req, res) => {
  const id = req.params.id;
  res.json({ pronouns: pronouns[id] || "Not set" });
});

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

