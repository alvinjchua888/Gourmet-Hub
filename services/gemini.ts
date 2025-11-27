import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Coordinates, RestaurantResult, DietaryRestriction, Amenity } from "../types";

// Initialize Gemini Client
// We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Finds restaurants using Maps Grounding.
 * Uses gemini-2.5-flash for speed and tool capability.
 */
export const findRestaurants = async (
  coords: Coordinates,
  cuisine: string,
  price: string,
  dietary: DietaryRestriction[],
  amenities: Amenity[],
  dishes?: string
): Promise<RestaurantResult> => {
  const model = "gemini-2.5-flash";
  
  let filterText = "";
  if (dietary.length > 0) {
    filterText += `The user specifically requires these dietary options: ${dietary.join(', ')}. `;
  }
  if (amenities.length > 0) {
    filterText += `The user specifically requires these amenities: ${amenities.join(', ')}. `;
  }
  if (dishes) {
    filterText += `The user is interested in these specific dishes: ${dishes}. `;
  }

  const prompt = `Find top-rated ${cuisine === 'Any Cuisine' ? '' : cuisine} restaurants near me that are in the ${price === 'Any Price' ? 'any' : price} price range. 
  ${filterText}
  Provide a helpful summary of the top recommendations, mentioning their ratings, specific matches for the user's requirements, and what they are known for.
  Do not invent places. Only use the Google Maps tool to find real places.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        }
      }
    });

    const text = response.text || "No details found.";
    // Safe navigation for grounding chunks
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

/**
 * Chatbot service using gemini-3-pro-preview for high-quality conversational responses.
 */
let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: "You are a helpful culinary assistant and food expert. You help users decide what to eat, explain culinary terms, and give general food advice. Be concise and friendly.",
      },
    });
  }
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  return await chat.sendMessageStream({ message });
};