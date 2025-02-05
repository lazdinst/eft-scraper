import express from "express";
import cors from "cors";
import { fetchQuests } from "./fetchQuests";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API to fetch latest quests dynamically from the wiki
app.get("/api/quests", async (req, res) => {
  try {
    const quests = await fetchQuests();
    res.json(quests);
  } catch (err) {
    console.error("❌ Error fetching quests:", err);
    res.status(500).json({ error: "Failed to fetch quests." });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
