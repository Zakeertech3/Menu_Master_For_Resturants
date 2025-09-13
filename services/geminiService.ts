import { GoogleGenAI, Type } from "@google/genai";
import type { UserPreferences, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getScenarioInstruction = (scenario?: string): string => {
  switch (scenario) {
    case 'price_conscious':
      return 'The user is price-conscious. Please highlight items under $15, suggest budget-friendly combinations, and mention any value-oriented sections of the menu.';
    case 'healthy':
      return 'The user is focused on healthy options. Please highlight salads, grilled items, and dishes with lots of vegetables. Point out lighter fare and healthier preparation methods mentioned on the menu.';
    case 'sharing':
      return 'The user is planning to share dishes with friends. Please suggest good combinations for sharing, like an appetizer and a main, or a pizza and a salad. Mention any family-style platters or large-format dishes.';
    case 'quick_lunch':
      return 'The user needs a quick lunch. Please highlight items that are typically fast to prepare, such as sandwiches, soups, and pre-made salads. Identify any "lunch special" sections.';
    case 'first_time_ingredient': // Example for future use, can be expanded
        return 'The user is trying a specific ingredient for the first time. Explain its benefits, taste, and what it pairs well with.';
    default:
      return 'The user is exploring the menu generally. Provide a balanced overview.';
  }
}

const buildPrompt = (preferences: UserPreferences): string => {
  const scenarioInstruction = getScenarioInstruction(preferences.diningScenario);

  return `
    You are MenuMaster, an advanced multimodal restaurant assistant. Your goal is to analyze the provided menu image and user preferences to transform a confusing menu into clear, actionable dining guidance.

    **USER PREFERENCES:**
    - **Primary Goal:** ${scenarioInstruction}
    - **Likes:** ${preferences.likes}
    - **Dislikes / Allergies:** ${preferences.dislikes}
    - **Spice Level Tolerance:** ${preferences.spiceLevel}

    **YOUR TASK:**
    Based on the menu image and the user's preferences, provide a detailed analysis. Your response MUST be a valid JSON object that adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object.

    **RESPONSE FORMAT INSTRUCTIONS:**
    - **menuScanResults**: Briefly summarize the menu.
    - **dishDecoder**: Identify and explain several potentially confusing or interesting items from the menu. Be concise.
    - **smartRecommendations**: Recommend 2-3 dishes that match the user's preferences AND their primary goal. Explain WHY you are recommending them in the context of both.
    - **dietaryAlerts**: Highlight dishes the user should avoid based on their dislikes. Explain WHY.
    - **culturalInsights**: If relevant, provide interesting cultural context, history, or dining etiquette related to the cuisine. If not relevant, provide a generic positive dining message.
    - **orderingStrategy**: Give practical advice tailored to the user's primary goal (e.g., for 'price_conscious', suggest how to build a meal under a budget; for 'sharing', suggest order of dishes).
  `;
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    menuScanResults: {
      type: Type.OBJECT,
      properties: {
        cuisineType: { type: Type.STRING, description: "Detected cuisine style (e.g., Italian, Ethiopian, Japanese)." },
        restaurantStyle: { type: Type.STRING, description: "Restaurant style (e.g., Casual, Fine dining, Fast-casual)." },
        language: { type: Type.STRING, description: "Language of the menu. Note if translation was provided." }
      },
      required: ["cuisineType", "restaurantStyle", "language"]
    },
    dishDecoder: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "Simple 1-sentence explanation." },
          keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          tasteProfile: { type: Type.STRING, description: "Flavor description (e.g., mild, spicy, sweet, savory)." },
          allergenAlerts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of common allergens present." }
        },
        required: ["dishName", "explanation", "keyIngredients", "tasteProfile"]
      }
    },
    smartRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          reason: { type: Type.STRING, description: "Brief reason for the recommendation based on user preferences." }
        },
        required: ["dishName", "reason"]
      }
    },
    dietaryAlerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          reason: { type: Type.STRING, description: "Reason to avoid this dish based on user dislikes/restrictions." }
        },
        required: ["dishName", "reason"]
      }
    },
    culturalInsights: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING }
      },
      required: ["title", "content"]
    },
    orderingStrategy: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING }
      },
      required: ["title", "content"]
    }
  },
  required: ["menuScanResults", "dishDecoder", "smartRecommendations", "dietaryAlerts", "culturalInsights", "orderingStrategy"]
};

export const analyzeMenu = async (image: File, preferences: UserPreferences): Promise<AnalysisResult> => {
  const imagePart = await fileToGenerativePart(image);
  const textPart = { text: buildPrompt(preferences) };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });

  const jsonString = response.text.trim();
  try {
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonString);
    throw new Error("The response from the AI was not in the correct format.");
  }
};