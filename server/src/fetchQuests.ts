import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs-extra"; // Ensure this is at the top

const QUESTS_URL = "https://escapefromtarkov.fandom.com/wiki/Quests";

/**
 * Fetches Escape from Tarkov quests from the wiki and returns them as JSON.
 */
export async function fetchQuests(): Promise<any[]> {
  console.log("🚀 Fetching latest quest data...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(QUESTS_URL, { waitUntil: "networkidle2" });

  const html = await page.content();
  await fs.writeFile("./raw_response.html", html);

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

  $(".wikitable.questtable").each((_, table) => {
    const questGiver = $(table).find("th[colspan='4'] a").first().text().trim();

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

  console.log(`✅ Fetched ${quests.length} quests`);
  await fs.writeJson("./quests.json", quests, { spaces: 4 });

  return quests;
}
