const { SlashCommandBuilder } = require("discord.js");
const config = require("./../config.json");
const axios = require("axios");

async function getRandomJoke() {
  const options = {
    method: "GET",
    url: "https://dad-jokes.p.rapidapi.com/random/joke",
    headers: {
      "X-RapidAPI-Key": config.ApiKey,
      "X-RapidAPI-Host": "dad-jokes.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return `${response.data.body[0].setup}\n${response.data.body[0].punchline}`;
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Replies with a random joke :)"),
  async execute(interaction) {
    const joke = await getRandomJoke();
    await interaction.reply(joke);
  },
};
