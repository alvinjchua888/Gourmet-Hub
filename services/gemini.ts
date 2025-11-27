/**
 * Gemini AI Service Module
 * 
 * This module handles all interactions with Google's Gemini AI models.
 * It provides two main functionalities:
 * 1. Restaurant search with Google Maps grounding (gemini-2.5-flash)
 * 2. Conversational chatbot (gemini-3-pro-preview)
 * 
 * @module services/gemini
 */

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Coordinates, RestaurantResult, DietaryRestriction, Amenity } from "../types";

// Initialize Gemini Client
// The API key is injected by Vite from the GEMINI_API_KEY environment variable
// Make sure to set this in your .env.local file
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Finds restaurants using Google Maps Grounding with Gemini AI
 * 
 * This function constructs a natural language query based on user preferences
 * and uses Gemini 2.5 Flash with Google Maps grounding to find real restaurants.
 * 
 * How it works:
 * 1. Builds a detailed prompt from user filters (cuisine, price, dietary, amenities, dishes)
 * 2. Sends the prompt to Gemini with Maps grounding tool enabled
 * 3. Includes user's coordinates for location-based results
 * 4. Returns both AI-generated summary text and structured grounding data
 * 
 * @param coords - User's geographic coordinates (latitude/longitude)
 * @param cuisine - Selected cuisine type (e.g., 'Italian', 'Any Cuisine')
 * @param price - Price range filter (e.g., '$', '$$', 'Any Price')
 * @param dietary - Array of dietary restrictions (e.g., ['Vegan', 'Gluten-Free'])
 * @param amenities - Array of required amenities (e.g., ['Wi-Fi', 'Parking'])
 * @param dishes - Optional specific dish search (e.g., 'Truffle Pizza')
 * 
 * @returns Promise containing AI text summary and array of restaurant grounding chunks
 * @throws Error if the API call fails or returns invalid data
 * 
 * @example
 * const result = await findRestaurants(
 *   { latitude: 37.7749, longitude: -122.4194 },
 *   'Italian',
 *   '$$',
 *   ['Vegetarian'],
 *   ['Outdoor Seating'],
 *   'Margherita Pizza'
 * );
 */
export const findRestaurants = async (
  coords: Coordinates,
  cuisine: string,
  price: string,
  dietary: DietaryRestriction[],
  amenities: Amenity[],
  dishes?: string
): Promise<RestaurantResult> => {
  // Use gemini-2.5-flash for speed and tool capability (Google Maps grounding)
  const model = "gemini-2.5-flash";
  
  // Build filter text from user's advanced filter selections
  let filterText = "";
  
  // Add dietary restrictions to the query if specified
  if (dietary.length > 0) {
    filterText += `The user specifically requires these dietary options: ${dietary.join(', ')}. `;
  }
  
  // Add amenity requirements to the query if specified
  if (amenities.length > 0) {
    filterText += `The user specifically requires these amenities: ${amenities.join(', ')}. `;
  }
  
  // Add specific dish search to the query if provided
  if (dishes) {
    filterText += `The user is interested in these specific dishes: ${dishes}. `;
  }

  // Construct the main prompt with all user preferences
  // This natural language prompt is optimized for Gemini to understand user intent
  const prompt = `Find top-rated ${cuisine === 'Any Cuisine' ? '' : cuisine} restaurants near me that are in the ${price === 'Any Price' ? 'any' : price} price range. 
  ${filterText}
  Provide a helpful summary of the top recommendations, mentioning their ratings, specific matches for the user's requirements, and what they are known for.
  Do not invent places. Only use the Google Maps tool to find real places.`;

  try {
    // Call Gemini API with Maps grounding tool configuration
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // Enable Google Maps tool for real restaurant data
        tools: [{ googleMaps: {} }],
        toolConfig: {
          // Configure retrieval with user's location for nearby results
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        }
      }
    });

    // Extract the AI-generated text summary from the response
    const text = response.text || "No details found.";
    
    // Extract grounding chunks (real restaurant data from Google Maps)
    // Safe navigation to handle potential undefined values in the response structure
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks
    };
  } catch (error) {
    // Log the error for debugging and re-throw for caller to handle
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

/**
 * Chatbot service using Gemini 3 Pro for high-quality conversational AI
 * 
 * This section manages the chat session state and provides streaming responses
 * for the interactive chatbot feature.
 */

// Global chat session instance
// Maintained across multiple messages for conversational context
let chatSession: Chat | null = null;

/**
 * Gets or creates a chat session with Gemini 3 Pro
 * 
 * Uses the singleton pattern to maintain one chat session across the application.
 * This preserves conversation context and history.
 * 
 * Model selection: gemini-3-pro-preview is used for its superior conversational
 * abilities compared to the flash model.
 * 
 * @returns Chat session instance for sending messages
 */
export const getChatSession = (): Chat => {
  // Create new session if one doesn't exist
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        // System instruction defines the AI's role and behavior
        systemInstruction: "You are a helpful culinary assistant and food expert. You help users decide what to eat, explain culinary terms, and give general food advice. Be concise and friendly.",
      },
    });
  }
  return chatSession;
};

/**
 * Sends a message to the chat session and returns a streaming response
 * 
 * Streaming allows the UI to display responses as they're generated,
 * providing a better user experience with faster perceived response times.
 * 
 * @param message - User's message text
 * @returns Async iterable stream of response chunks
 * 
 * @example
 * const stream = await sendMessageStream("What's the best way to cook pasta?");
 * for await (const chunk of stream) {
 *   console.log(chunk.text);
 * }
 */
export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  // Returns an async iterable that yields response chunks as they arrive
  return await chat.sendMessageStream({ message });
};