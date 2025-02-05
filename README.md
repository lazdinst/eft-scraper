# EFT Scraper

A web scraper and API for extracting Escape from Tarkov quest data from the Fandom wiki.

---

## Features
- Scrapes quests from the EFT Fandom wiki and stores them in quests.json.
- Node.js API serves the latest quest data dynamically.
- React frontend displays the quest list with filtering options.
- Filters by NPC vendor and toggles quests required for Kappa.

---

## Project Structure
```
eft-scraper/
│── client/            # React frontend
│── server/            # Node.js backend
│   ├── src/
│   │   ├── index.ts    # Express API server
│   │   ├── fetchQuests.ts # Puppeteer scraper
│   │   ├── scrapeQuests.ts # Alternative scraper with caching
│── quests.json        # Cached quest data
│── README.md          # Documentation
```

---

## Setup Instructions

### Install Dependencies
Navigate to the root of the project and install dependencies for both client and server.

```sh
cd server
npm install
cd ../client
npm install
```

### Run the Backend Server
```sh
cd server
npm run dev
```
The API will be available at `http://localhost:3001/api/quests`.

### Run the Frontend
```sh
cd client
npm run dev
```
The UI will be available at `http://localhost:5173`.

---

## API Endpoints

### Get Quests
Fetches the latest quests.

```
GET /api/quests
```

Response:
```json
[
  {
    "questGiver": "Prapor",
    "name": "Debut",
    "link": "https://escapefromtarkov.fandom.com/wiki/Debut",
    "objectives": [
      "Eliminate 5 Scavs all over the Tarkov territory",
      "Obtain and hand over 2 MP-133 12ga shotguns"
    ],
    "rewards": [
      "+1,700 EXP",
      "Prapor Rep +0.02",
      "15,000 Roubles",
      "PP-91 Kedr 9x18PM submachine gun"
    ],
    "requiredForKappa": true
  }
]
```

### Trigger a Fresh Scrape
```
GET /api/scrape
```
Forces a new scrape from the Fandom wiki and updates `quests.json`.

---

## Contributing
- Ensure your code follows the existing structure.
- Open an issue or submit a pull request with improvements.

---

## License
This project is licensed under the MIT License.
