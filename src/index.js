/* Node file Imports */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
/* Discord.js Imports */
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
/* dotenv Imports */
import "dotenv/config";
/* File Locations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
/* Discord Client */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandBody = [];

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default;
    console.log(Object.keys(command));
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      commandBody.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.login(process.env.DISCORD_TOKEN).then(() => {
  // Guilds
  client.guilds.fetch().then((guilds) => {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    guilds.forEach(async (guild) => {
      // Register Slash Commands per guild
      await registerCommands(rest, guild.id, commandBody);
    });
  });
  console.log("Logged in!");
});

const registerCommands = async (rest, guildId, commands) => {
  console.log(guildId);
  console.log(commands);
  const data = await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_APPLICATION_ID,
      guildId
    ),
    {
      body: commands,
    }
  );

  console.log("Successfully reloaded " + data.length + " (/) commands.");
};
