// Initialize a Repository
// =======================
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
} from "discord.js";
import DB from "../../db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("init")
    .setDescription("Initialize Your Project!"),
  async execute(interaction) {
    // Verify that the server is setup
    const res = await DB.query(`
        SELECT * FROM Guild WHERE id = ${interaction.guild.id}
    `);
    if (res.rows.length === 0) {
      await interaction.reply(
        "This server is not setup. Please contact an administrator to setup this server."
      );
      return;
    }
    const modal = new ModalBuilder()
      .setCustomId("initProject")
      .setTitle("Initialize Your Project!");

    const name = new TextInputBuilder()
      .setCustomId("projectName")
      // The label is the prompt the user sees for this input
      .setLabel("What's your project's name?")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    const link = new TextInputBuilder()
      .setCustomId("repoLink")
      // The label is the prompt the user sees for this input
      .setLabel("What's your repository link?")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(name);
    const secondActionRow = new ActionRowBuilder().addComponents(link);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  },
};
