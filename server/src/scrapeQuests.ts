import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs-extra";
import path from "path";

const QUESTS_URL = "https://escapefromtarkov.fandom.com/wiki/Quests";

/**
 * Scrapes Escape from Tarkov quest data from the wiki.
 * Saves the extracted data into quests.json.
 */
export async function scrapeQuests(): Promise<void> {
  console.log("🚀 Starting quest scraping...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(QUESTS_URL, { waitUntil: "networkidle2" });

  // Load page content into Cheerio
  const html = await page.content();
  const $ = cheerio.load(html);
  await browser.close();

  const quests: {
    questGiver: string;
    name: string;
    link: string;
    objectives: string[];
    rewards: string[];
    requiredForKappa: boolean;
  }[] = [];

  // Iterate over all quest tables
  $(".wikitable.questtable").each((_, table) => {
    const questGiver = $(table).find("th[colspan='4'] a").text().trim();

    // Extract each quest row (skip the header)
    $(table)
      .find("tr:has(th a)")
      .each((_, row) => {
        const columns = $(row).find("td, th");

        const questName = $(columns[0]).find("a").text().trim();
        const questLink =
          "https://escapefromtarkov.fandom.com" +
          $(columns[0]).find("a").attr("href");
        const objectives: string[] = [];

        $(columns[1])
          .find("li")
          .each((_, obj) => {
            objectives.push($(obj).text().trim());
          });

        const rewards: string[] = [];
        $(columns[2])
          .find("li")
          .each((_, reward) => {
            rewards.push($(reward).text().trim());
          });

        const requiredForKappa =
          $(columns[3]).text().trim().toLowerCase() === "yes";

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

  // Save quests to JSON
  const outputPath = path.join(__dirname, "../quests.json");
  await fs.writeJson(outputPath, quests, { spaces: 4 });

  console.log(`✅ Scraped ${quests.length} quests and saved to ${outputPath}`);
}
