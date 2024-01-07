// Delete your project from the discord

import { SlashCommandBuilder } from "discord.js";
import DB from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Deletes your project from the discord")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The Cateory your project is associated with")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    // Verify this user owns the Project
    const project = await DB.query(
      `
        SELECT * FROM Project WHERE id = ${channel.id} AND ownerId = ${interaction.user.id}
    `
    );
    if (!project || project?.rowCount === 0) {
      await interaction.reply("You do not own this project");
      return;
    } else {
      console.log(project.rowCount);
      // Webhook
      const webhook = await DB.query(`
        SELECT * FROM Webhook WHERE projectId = ${channel.id}
      `);
      if (webhook.rowCount > 0) {
        await interaction.client.webhooks.delete(webhook.rows[0].id);
        await DB.query(`
                DELETE FROM Webhook WHERE projectId = ${channel.id}
            `);
      }
      // Role
      const role = await DB.query(`
            SELECT * FROM Role WHERE projectId = ${channel.id}
        `);
      if (role.rowCount > 0) {
        await interaction.guild.roles.delete(role.rows[0].id);
        await DB.query(`
                DELETE FROM Role WHERE projectId = ${channel.id}
            `);
      }
      // Channel
      const Channels = await DB.query(`
            SELECT * FROM Channel WHERE projectId = ${channel.id}
        `);
      if (Channels.rowCount > 0) {
        Channels.rows.forEach(async (channel) => {
          await interaction.guild.channels.delete(channel.id);
        });
        await DB.query(`
            DELETE FROM Channel WHERE projectId = ${channel.id}
        `);
      }
      // Project
      await interaction.guild.channels.delete(channel.id);
      await DB.query(`
            DELETE FROM Project WHERE id = ${channel.id}
        `);

      await interaction.reply("Project deleted");
    }
  },
};
