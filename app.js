const fs = require("fs");
const request = require("request-promise");
const cron = require("node-cron");
const cheerio = require("cheerio");

cron.schedule("*/2 * * * *", async () => {
  try {
    const data = await request.get(
      "https://www.the-numbers.com/movies/franchise/Star-Wars#tab=summary"
    );
    const $ = cheerio.load(data);
    const starwarsdata = [];

    $("#franchise_movies_overview > tbody > tr").each((index, element) => {
      const [release, title, budget, opening, domestic, worldwide] = $(element)
        .find("td")
        .map((i, el) => $(el).text())
        .get();
      starwarsdata.push({ release, title, budget, opening, domestic, worldwide });
    });

    fs.writeFileSync(
      "starwarsdata.json",
      JSON.stringify({ starwarsdata }, null, 4)
    );
    console.log("Dados obtidos e atualizados.");
  } catch (error) {
    console.log(error);
  }
});
