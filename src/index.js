/* Node file Imports */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
/* Local Imports */
import { handleModalSubmit } from "./events/Modal.js";
import db from "./db.js";
/* Discord.js Imports */
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
/* dotenv Imports */
import "dotenv/config";
/* Database Setup */
// import db from "./db.js";
/* File Locations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandBody = [];
// Command Registration
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default;
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
// Command Execution
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    // Handle Slash Commands
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isModalSubmit()) {
    // Handle Modal Responses
    handleModalSubmit(interaction);
  }
});
// Login
client.login(process.env.DISCORD_TOKEN).then(async () => {
  // DB Connection
  await db.connect();
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
