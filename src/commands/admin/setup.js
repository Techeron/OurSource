import { SlashCommandBuilder } from "discord.js";
import DB from "../../db.js";

const command = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Configure this discord server for use with the bot.")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to send the custom role message to.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message to send to the channel.")
  );
const execute = async (interaction) => {
  // Check if user is an admin
  if (!interaction.member.permissions.has("ADMINISTRATOR")) {
    await interaction.reply(
      "You must be an administrator to use this command."
    );
    return;
  }
  // Get the Channel and message, then make the post
  const channel = interaction.channel;
  const message =
    interaction.options.getString("message") ||
    "Join a project by reacting to this message!";
  const post = await channel.send(message);
  const qry = `
  INSERT INTO Guild (id, roleId)
  VALUES (${interaction.guild.id}, ${post.id})
  ON CONFLICT (id) DO UPDATE SET roleId = ${post.id};
`;
  console.log(qry);
  await DB.query(qry);
  // Respond to user
  await interaction.reply("Setup complete.");
};
export default {
  data: command,
  execute,
};
