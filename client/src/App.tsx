import { useEffect, useState } from "react";
import Select from "react-select";
import "./App.css";

const API_URL = "http://localhost:3001/api/quests"; // Backend API URL

interface Quest {
  questGiver: string;
  name: string;
  link: string;
  objectives: string[];
  rewards: string[];
  requiredForKappa: boolean;
}

function App() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [npcFilter, setNpcFilter] = useState<string | null>(null);
  const [showKappaOnly, setShowKappaOnly] = useState(false);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setQuests(data);
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuests();
  }, []);

  // Get unique NPCs for filtering
  const npcOptions = [
    { value: null, label: "All NPCs" },
    ...Array.from(new Set(quests.map((q) => q.questGiver))).map((npc) => ({
      value: npc,
      label: npc,
    })),
  ];

  // Filtered quests based on NPC and Kappa toggle
  const filteredQuests = quests.filter((quest) => {
    return (
      (!npcFilter || quest.questGiver === npcFilter) &&
      (!showKappaOnly || quest.requiredForKappa)
    );
  });

  return (
    <div className="container">
      <h1>Escape from Tarkov Quests</h1>

      {/* Loader */}
      {loading && <p>Loading quests...</p>}

      {!loading && (
        <>
          {/* Filters */}
          <div className="filters">
            <Select
              options={npcOptions}
              onChange={(option) => setNpcFilter(option?.value || null)}
              placeholder="Filter by NPC Vendor"
            />
            <button onClick={() => setShowKappaOnly(!showKappaOnly)}>
              {showKappaOnly ? "Show All Quests" : "Show Only Kappa Required"}
            </button>
          </div>

          {/* Quest Table */}
          <table>
            <thead>
              <tr>
                <th>Quest Giver</th>
                <th>Quest Name</th>
                <th>Objectives</th>
                <th>Rewards</th>
                <th>Kappa Required</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuests.map((quest, index) => (
                <tr key={index}>
                  <td>{quest.questGiver}</td>
                  <td>
                    <a
                      href={quest.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {quest.name}
                    </a>
                  </td>
                  <td>{quest.objectives.join(", ")}</td>
                  <td>{quest.rewards.join(", ")}</td>
                  <td
                    style={{ color: quest.requiredForKappa ? "red" : "green" }}
                  >
                    {quest.requiredForKappa ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
