/**
 * Type Definitions for GourmetGuide AI
 * 
 * This file contains all TypeScript interfaces, types, and enums used throughout the application.
 * It provides type safety and better IDE support for the entire codebase.
 */

/**
 * Geographic coordinates for location-based searches
 * Used with the browser's Geolocation API and Google Maps Grounding
 */
export interface Coordinates {
  /** Latitude in decimal degrees (positive for North, negative for South) */
  latitude: number;
  /** Longitude in decimal degrees (positive for East, negative for West) */
  longitude: number;
}

/**
 * Enum of supported cuisine types for restaurant filtering
 * Users can select from these options to narrow down restaurant searches
 */
export enum CuisineType {
  ANY = 'Any Cuisine',           // No cuisine filter applied
  ITALIAN = 'Italian',           // Italian restaurants (pasta, pizza, etc.)
  MEXICAN = 'Mexican',           // Mexican restaurants (tacos, burritos, etc.)
  CHINESE = 'Chinese',           // Chinese restaurants (dim sum, stir-fry, etc.)
  JAPANESE = 'Japanese',         // Japanese restaurants (sushi, ramen, etc.)
  INDIAN = 'Indian',             // Indian restaurants (curry, tandoori, etc.)
  AMERICAN = 'American',         // American restaurants (burgers, BBQ, etc.)
  FRENCH = 'French',             // French restaurants (fine dining, bistro, etc.)
  THAI = 'Thai',                 // Thai restaurants (pad thai, curry, etc.)
  MEDITERRANEAN = 'Mediterranean', // Mediterranean restaurants (Greek, Turkish, etc.)
  VEGAN = 'Vegan'                // Plant-based restaurants
}

/**
 * Enum of price range filters for restaurant searches
 * Follows common restaurant pricing conventions ($ to $$$$)
 */
export enum PriceRange {
  ANY = 'Any Price',      // No price filter applied
  CHEAP = '$',            // Budget-friendly options (under $10 per person)
  MODERATE = '$$',        // Mid-range pricing ($10-$25 per person)
  EXPENSIVE = '$$$',      // Higher-end dining ($25-$50 per person)
  LUXURY = '$$$$'         // Fine dining (over $50 per person)
}

/**
 * Represents a grounding chunk from Google Maps API
 * Contains real restaurant data including location, reviews, and metadata
 */
export interface GroundingChunk {
  /** Maps-specific data returned by Google Maps Grounding */
  maps?: {
    /** Direct URL to the restaurant's Google Maps page */
    uri: string;
    /** Restaurant name/title */
    title: string;
    /** Unique Google Place ID for the restaurant (optional) */
    placeId?: string;
    /** Additional place-specific data sources */
    placeAnswerSources?: {
      /** Snippets from user reviews */
      reviewSnippets?: {
        /** Review text content */
        content: string;
      }[];
    };
  };
}

/**
 * Complete result from a restaurant search query
 * Combines AI-generated text with structured grounding data
 */
export interface RestaurantResult {
  /** AI-generated summary and recommendations in markdown format */
  text: string;
  /** Array of grounding chunks with real restaurant data from Google Maps */
  groundingChunks: GroundingChunk[];
}

/**
 * Represents a single message in the chat conversation
 * Used for both user messages and AI assistant responses
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Message sender: 'user' for human, 'model' for AI */
  role: 'user' | 'model';
  /** Message text content (supports markdown) */
  content: string;
  /** Flag indicating if the message is currently being streamed */
  isStreaming?: boolean;
}

/**
 * User-submitted review for a restaurant
 * Stored in browser localStorage for persistence
 */
export interface Review {
  /** Unique identifier for the review */
  id: string;
  /** Name of the restaurant being reviewed */
  restaurantTitle: string;
  /** Star rating from 1-5 */
  rating: number;
  /** Optional text comment/feedback */
  comment: string;
  /** Unix timestamp (milliseconds) when the review was created */
  timestamp: number;
}

/**
 * Dietary restriction options for filtering restaurants
 * Used in advanced search filters
 */
export type DietaryRestriction = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal';

/**
 * Amenity options for filtering restaurants
 * Used in advanced search filters to find restaurants with specific features
 */
export type Amenity = 'Outdoor Seating' | 'Wi-Fi' | 'Pet Friendly' | 'Parking';