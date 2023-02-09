const { REST, Routes } = require("discord.js");
const config = require("./config.json");
const fs = require("node:fs");

const commands = [];

const commandsFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandsFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);
// deploying commands
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} app (/) commands.`);
    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );
    console.log(`Successfully reloaded ${data.length} app (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
