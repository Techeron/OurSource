import { ChannelType, PermissionFlagsBits } from "discord.js";
import db from "../db.js";

export const handleModalSubmit = async (interaction) => {
  if (interaction.customId === "initProject") {
    const DefaultLayout = {
      Category: "OurSource",
      Channels: [
        {
          Name: "Announcements",
          Type: "GuildAnnouncement",
        },
        {
          Name: "Chat",
          Type: "GuildVoice",
        },
        {
          Name: "Feed",
          Type: "GuildText",
        },
        {
          Name: "General",
          Type: "GuildText",
        },
        {
          Name: "Help",
          Type: "GuildForum",
        },
        {
          Name: "Issues",
          Type: "GuildForum",
        },
      ],
    };
    const name = interaction.fields.getTextInputValue("projectName");
    const repo = interaction.fields.getTextInputValue("repoLink");
    await interaction.reply(`Generating now...`);
    const guild = await interaction.guild.fetch();
    const user = await interaction.user.fetch();
    // Verify the guild exists in the guilds table
    const guildExists = await db.query(
      `SELECT * FROM Guild WHERE id = ${guild.id}`
    );
    if (guildExists.rows.length === 0) {
      interaction.editReply(
        "This guild is not registered with OurSource. Please contact an administrator to register this guild."
      );
      return;
    }
    // Category
    const category = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });
    // Roles
    const role = await guild.roles.create({
      name: name + " Project",
      reason: "New Init Project",
    });
    const devRole = await guild.roles.create({
      name: name + " Developer",
      reason: "New Init Project",
    });
    // Channels
    const Channels = {};
    await Promise.all(
      DefaultLayout.Channels.map(async (channel) => {
        const newChannel = await guild.channels.create({
          name: channel.Name,
          type: ChannelType[channel.Type],
          parent: category,
        });
        Channels[channel.Name] = newChannel;
      })
    );
    // Webhook
    const webhook = await guild.channels.createWebhook({
      channel: Channels.Feed.id,
      name: name + " Project Webhook",
      reason: "New Init Project",
    });
    await user.send("Your Webhook: " + webhook.url);
    // Permissions
    await guild.channels.edit(category.id, {
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.ManageWebhooks,
          ],
        },
        // Development Role
        {
          id: devRole.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ManageChannels,
          ],
        },
        // Role
        {
          id: role.id,
          allow: [PermissionFlagsBits.ViewChannel],
          deny: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.ManageWebhooks,
          ],
        },
      ],
    });
    // Add Project to DB
    await db.query(`
      INSERT INTO Project (id, name, ownerId, guildId, categoryId, devRoleId, roleId, webhookId)
      VALUES (${category.id}, '${name}', ${user.id}, ${guild.id}, ${category.id}, ${devRole.id}, ${role.id}, ${webhook.id})
    `);
    // Add Channels to DB
    const keys = Object.keys(Channels);
    keys.forEach(async (key) => {
      const channel = Channels[key];
      await db.query(`
            INSERT INTO Channel (id, guildId, projectId, name, type)
            VALUES (${channel.id}, ${guild.id}, ${category.id}, '${channel.name}', '${channel.type}')`);
    });
  }
};
