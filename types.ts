export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum CuisineType {
  ANY = 'Any Cuisine',
  ITALIAN = 'Italian',
  MEXICAN = 'Mexican',
  CHINESE = 'Chinese',
  JAPANESE = 'Japanese',
  INDIAN = 'Indian',
  AMERICAN = 'American',
  FRENCH = 'French',
  THAI = 'Thai',
  MEDITERRANEAN = 'Mediterranean',
  VEGAN = 'Vegan'
}

export enum PriceRange {
  ANY = 'Any Price',
  CHEAP = '$',
  MODERATE = '$$',
  EXPENSIVE = '$$$',
  LUXURY = '$$$$'
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    };
  };
}

export interface RestaurantResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export interface Review {
  id: string;
  restaurantTitle: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export type DietaryRestriction = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal';
export type Amenity = 'Outdoor Seating' | 'Wi-Fi' | 'Pet Friendly' | 'Parking';