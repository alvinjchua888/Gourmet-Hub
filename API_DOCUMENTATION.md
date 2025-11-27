# API Documentation

## Overview

This document provides detailed information about the APIs and external services used in GourmetGuide AI, including configuration, usage patterns, and integration details.

## Table of Contents

- [Google Gemini AI](#google-gemini-ai)
- [Google Maps Grounding](#google-maps-grounding)
- [Browser APIs](#browser-apis)
- [Environment Configuration](#environment-configuration)
- [Error Handling](#error-handling)
- [Rate Limits and Quotas](#rate-limits-and-quotas)

---

## Google Gemini AI

### Overview

GourmetGuide AI uses two Gemini models for different purposes:

1. **gemini-2.5-flash**: Fast responses for restaurant search with tool usage
2. **gemini-3-pro-preview**: High-quality conversational AI for chatbot

### Authentication

**API Key Setup:**

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. The key is injected at build time via Vite configuration

### Model: gemini-2.5-flash

**Purpose**: Restaurant search with Google Maps grounding

**Configuration:**

```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    tools: [{ googleMaps: {} }],
    toolConfig: {
      retrievalConfig: {
        latLng: {
          latitude: number,
          longitude: number
        }
      }
    }
  }
});
```

**Key Features:**
- Fast response times (typically < 2 seconds)
- Tool usage capability (Google Maps integration)
- Location-aware results
- Grounding metadata in responses

**Use Cases:**
- Restaurant recommendations
- Location-based searches
- Real-time data retrieval

**Response Structure:**

```typescript
interface GenerateContentResponse {
  text: string;                      // AI-generated summary
  candidates: [{
    groundingMetadata: {
      groundingChunks: GroundingChunk[]; // Real restaurant data
    }
  }]
}
```

**Example Prompt:**

```text
Find top-rated Italian restaurants near me that are in the $$ price range.
The user specifically requires these dietary options: Vegetarian.
The user specifically requires these amenities: Outdoor Seating, Wi-Fi.
Provide a helpful summary of the top recommendations, mentioning their 
ratings, specific matches for the user's requirements, and what they are 
known for. Do not invent places. Only use the Google Maps tool to find 
real places.
```

### Model: gemini-3-pro-preview

**Purpose**: Conversational chatbot for food and cooking advice

**Configuration:**

```typescript
const chatSession = ai.chats.create({
  model: "gemini-3-pro-preview",
  config: {
    systemInstruction: "You are a helpful culinary assistant..."
  }
});
```

**Key Features:**
- Superior conversation quality
- Context awareness across messages
- Natural language understanding
- Streaming responses

**Streaming Messages:**

```typescript
// Send message with streaming
const stream = await chat.sendMessageStream({ message: userInput });

// Process chunks
for await (const chunk of stream) {
  const text = chunk.text;
  // Update UI with partial response
}
```

---

## Google Maps Grounding

### Overview

Google Maps Grounding provides real-world location data to Gemini AI, ensuring accurate restaurant information.

### How It Works

1. User's coordinates sent with query
2. Gemini searches Google Maps near location
3. Returns structured data with grounding metadata
4. Application displays real restaurant information

### Data Structure

**GroundingChunk Interface:**

```typescript
interface GroundingChunk {
  maps?: {
    uri: string;           // Google Maps URL
    title: string;         // Restaurant name
    placeId?: string;      // Unique Google Place ID
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;   // Review excerpt
      }[];
    };
  };
}
```

### Example Response

```json
{
  "text": "Here are some great Italian restaurants...",
  "candidates": [{
    "groundingMetadata": {
      "groundingChunks": [
        {
          "maps": {
            "uri": "https://maps.google.com/?cid=12345",
            "title": "Mario's Italian Bistro",
            "placeId": "ChIJ...",
            "placeAnswerSources": {
              "reviewSnippets": [{
                "content": "Amazing pasta! Great service."
              }]
            }
          }
        }
      ]
    }
  }]
}
```

### Benefits

- **Accuracy**: Real, verified restaurant data
- **Freshness**: Up-to-date information from Maps
- **Trust**: Links to Google Maps for verification
- **Rich Data**: Reviews, ratings, locations included

### Limitations

- Requires valid coordinates
- Results limited to Google Maps coverage
- Subject to Maps API availability

---

## Browser APIs

### Geolocation API

**Purpose**: Get user's current location for nearby searches

**Usage:**

```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    // Use coordinates for search
  },
  (error) => {
    // Handle error (permission denied, timeout, etc.)
    console.error("Geolocation error:", error);
  },
  {
    enableHighAccuracy: true,  // Request precise location
    timeout: 10000,            // 10 second timeout
    maximumAge: 300000         // Cache for 5 minutes
  }
);
```

**Error Codes:**

- `PERMISSION_DENIED` (1): User denied location access
- `POSITION_UNAVAILABLE` (2): Location not available
- `TIMEOUT` (3): Request timed out

**Requirements:**
- HTTPS connection (required for security)
- User permission (browser prompt)
- GPS/network location enabled

### LocalStorage API

**Purpose**: Persist user reviews and ratings

**Usage:**

```typescript
// Save data
const reviews = [...];
localStorage.setItem('restaurant_reviews', JSON.stringify(reviews));

// Load data
const saved = localStorage.getItem('restaurant_reviews');
const reviews = saved ? JSON.parse(saved) : [];

// Remove data
localStorage.removeItem('restaurant_reviews');

// Clear all
localStorage.clear();
```

**Characteristics:**
- Synchronous API
- String storage only (use JSON for objects)
- ~5-10MB storage limit
- Persists across sessions
- Domain-specific

**Error Handling:**

```typescript
try {
  const saved = localStorage.getItem('key');
  const data = saved ? JSON.parse(saved) : defaultValue;
} catch (error) {
  // Handle JSON parse error or storage unavailable
  console.error("LocalStorage error:", error);
  return defaultValue;
}
```

---

## Environment Configuration

### Required Environment Variables

Create `.env.local` in project root:

```env
# Gemini API Key (required)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Vite Configuration

`vite.config.ts` handles environment variable injection:

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    }
  };
});
```

### Security Notes

- Never commit `.env.local` to version control
- Add to `.gitignore`
- Use different keys for development/production
- Rotate keys regularly

---

## Error Handling

### API Error Patterns

**Restaurant Search Errors:**

```typescript
try {
  const result = await findRestaurants(...);
  // Success
} catch (error) {
  // API error, network error, or invalid response
  console.error("Search error:", error);
  setError("Failed to fetch recommendations. Please try again.");
}
```

**Chat Errors:**

```typescript
try {
  const stream = await sendMessageStream(message);
  // Process stream
} catch (error) {
  console.error("Chat error:", error);
  setMessages(prev => [...prev, {
    id: Date.now().toString(),
    role: 'model',
    content: 'Sorry, I encountered an error. Please try again.'
  }]);
}
```

### Common Error Scenarios

1. **Invalid API Key**
   - Error: 401 Unauthorized
   - Solution: Check GEMINI_API_KEY in .env.local

2. **Rate Limit Exceeded**
   - Error: 429 Too Many Requests
   - Solution: Implement backoff, upgrade API tier

3. **Network Error**
   - Error: Network request failed
   - Solution: Check internet connection, retry

4. **Location Permission Denied**
   - Error: PERMISSION_DENIED
   - Solution: Request permission, provide manual entry

5. **Invalid Coordinates**
   - Error: Empty grounding results
   - Solution: Validate coordinates before API call

---

## Rate Limits and Quotas

### Gemini API Limits

**Free Tier:**
- 60 requests per minute
- 1,500 requests per day
- Subject to change

**Best Practices:**
- Cache results when possible
- Implement debouncing for searches
- Show loading states during requests
- Handle rate limit errors gracefully

### Google Maps Grounding

- Included with Gemini API usage
- Subject to Gemini rate limits
- No separate Maps API key needed

### LocalStorage Limits

- ~5-10MB per domain
- Varies by browser
- Check before writing:

```typescript
try {
  localStorage.setItem('key', value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Storage full - handle gracefully
    alert('Storage full. Please clear old data.');
  }
}
```

---

## Integration Examples

### Complete Restaurant Search Flow

```typescript
// 1. Get user location
const [location, setLocation] = useState<Coordinates | null>(null);

navigator.geolocation.getCurrentPosition(
  (position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }
);

// 2. Perform search
const handleSearch = async () => {
  if (!location) return;
  
  try {
    setIsLoading(true);
    const result = await findRestaurants(
      location,
      cuisine,
      price,
      dietary,
      amenities,
      customDish
    );
    setResult(result);
  } catch (error) {
    setError("Search failed");
  } finally {
    setIsLoading(false);
  }
};

// 3. Display results
{result?.groundingChunks.map((chunk, idx) => (
  <RestaurantCard key={idx} data={chunk.maps} />
))}
```

### Complete Chat Flow

```typescript
// 1. Initialize chat session
const chat = getChatSession();

// 2. Send message
const handleSend = async (userMessage: string) => {
  // Add user message
  setMessages(prev => [...prev, {
    id: Date.now().toString(),
    role: 'user',
    content: userMessage
  }]);
  
  // Stream AI response
  try {
    const stream = await sendMessageStream(userMessage);
    
    const botMsgId = (Date.now() + 1).toString();
    let fullContent = '';
    
    // Add placeholder
    setMessages(prev => [...prev, {
      id: botMsgId,
      role: 'model',
      content: '',
      isStreaming: true
    }]);
    
    // Update with chunks
    for await (const chunk of stream) {
      fullContent += chunk.text;
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, content: fullContent }
            : msg
        )
      );
    }
    
    // Finalize
    setMessages(prev => 
      prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      )
    );
  } catch (error) {
    console.error(error);
  }
};
```

---

## Testing API Integration

### Manual Testing

1. **Restaurant Search:**
   - Enable location services
   - Try various filter combinations
   - Verify grounding data appears
   - Check Google Maps links work

2. **Chatbot:**
   - Send various food-related questions
   - Verify streaming works
   - Check markdown rendering
   - Test error recovery

### Monitoring

**Network Tab:**
- Check API response times
- Verify request/response structure
- Monitor for errors

**Console Logs:**
- API errors logged automatically
- Check for rate limit warnings
- Verify data structure

---

## Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

---

## Support

For API-related issues:
1. Check API key validity
2. Verify environment configuration
3. Review error messages in console
4. Check API status: [Google Cloud Status](https://status.cloud.google.com/)
