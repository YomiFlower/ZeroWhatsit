// bot.js
import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds] });

let pronouns = {}; // store by user ID

client.on("messageCreate", msg => {
  if (msg.content.startsWith("!pronouns")) {
    const value = msg.content.split(" ").slice(1).join(" ");
    pronouns[msg.author.id] = value;
    msg.reply(`Saved your pronouns: ${value}`);
  }
});

// tiny API server
const app = express();
app.get("/pronouns/:id", (req, res) => {
  res.json({ pronouns: pronouns[req.params.id] || "Not set" });
});
app.listen(3000, () => console.log("API running on port 3000"));

// login
client.login("YOUR_BOT_TOKEN");
