const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs-extra");

(async () => {
  const url = "https://escapefromtarkov.fandom.com/wiki/Quests";

  // Launch Puppeteer and open the page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Get the page's HTML content
  const html = await page.content();
  await browser.close();

  // Load the HTML into Cheerio for parsing
  const $ = cheerio.load(html);

  const quests = [];

  // Iterate over all quest tables
  $(".wikitable.questtable").each((_, table) => {
    // Get the quest giver (the NPC that gives the quest)
    const questGiver = $(table).find("th[colspan='4'] a").text().trim();

    // Iterate over all quest rows (skip the first header row)
    $(table)
      .find("tr:has(th a)")
      .each((_, row) => {
        const columns = $(row).find("td, th");

        const questName = $(columns[0]).find("a").text().trim();
        const questLink =
          "https://escapefromtarkov.fandom.com" +
          $(columns[0]).find("a").attr("href");

        // Extract objectives
        const objectives = [];
        $(columns[1])
          .find("li")
          .each((_, obj) => objectives.push($(obj).text().trim()));

        // Extract rewards
        const rewards = [];
        $(columns[2])
          .find("li")
          .each((_, reward) => rewards.push($(reward).text().trim()));

        // Check if it's required for the Kappa container
        const requiredForKappa =
          $(columns[3]).text().trim().toLowerCase() === "yes";

        // Push the quest data into the array
        quests.push({
          questGiver,
          name: questName,
          link: questLink,
          objectives,
          rewards,
          requiredForKappa,
        });
      });
  });

  // Save the extracted quests as JSON
  await fs.writeJson("quests.json", quests, { spaces: 4 });

  console.log("Quests extracted and saved to quests.json");
})();
