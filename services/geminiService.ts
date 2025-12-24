
import { GoogleGenAI, Type } from "@google/genai";
import { Team, AuctionSettings } from "../types";

export const getAuctionAdvice = async (
  currentTeam: Team,
  settings: AuctionSettings,
  playerName: string,
  allTeams: Team[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const remainingBudget = settings.pursePerTeam - currentTeam.spent;
  const remainingSlots = settings.rosterSize - currentTeam.playersAcquired.length;
  
  const prompt = `
    Auction Strategy Request:
    Sport: ${settings.sportName}
    Total Budget: ${settings.pursePerTeam}
    Roster Size: ${settings.rosterSize}
    Current Team Status:
    - Name: ${currentTeam.name}
    - Remaining Budget: ${remainingBudget}
    - Remaining Slots: ${remainingSlots}
    - Player being considered: ${playerName}
    
    Context:
    - Minimum bid allowed: ${settings.minBid}
    - Other teams average budget: ${(allTeams.reduce((acc, t) => acc + (settings.pursePerTeam - t.spent), 0) / allTeams.length).toFixed(2)}
    
    Provide strategic advice on whether to aggressively bid for this player, considering the need to fill the remaining roster.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedMaxBid: { type: Type.NUMBER }
          },
          required: ["summary", "recommendations", "suggestedMaxBid"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      summary: "AI strategist unavailable. Rely on your budget math.",
      recommendations: ["Ensure you save at least 1 for every remaining roster slot."],
      suggestedMaxBid: remainingBudget
    };
  }
};
