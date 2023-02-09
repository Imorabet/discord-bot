const config = require("./config.json");
const discord = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
// ? creating a new client instance(bot)
const client = new discord.Client({
  intents: [discord.GatewayIntentBits.Guilds],
}); //! Guilds are the servers
// ? loading files for bot in startup
client.commands = new discord.Collection();

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandsFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else
    console.log(
      `[WARNING] The command at ${filePath} is missing a required 'data' ot 'execute' property.`
    );
}
// ? welcome newcomers
client.on('guildMemberAdd', async member => {
  if (member.guild.id !== config.guildId) return;
  var channel = client.channels.cache.get(config.channelID);
  channel.send(`Marhba beek a zeen , <@!${member.id}>!`);
});

//!handeling slash commands only
client.on(discord.Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return; //! it exits if the command isnt a slash command
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try{
    await command.execute(interaction)
  }catch(error){
    console.error(error)
    await interaction.reply({content:'There was an error while executing this command!', ephemeral:true})
  }
});
// ? make connection :)
client.once(discord.Events.ClientReady, (clt) => {
  console.log(`Ready! logged in as ${clt.user.tag} :3`);
});
// ?log in to discord using the bot's token
client.login(config.BOT_TOKEN);
