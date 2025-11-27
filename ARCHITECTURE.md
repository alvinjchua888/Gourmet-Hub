# GourmetGuide AI - Architecture Documentation

## Overview

GourmetGuide AI is a modern web application built with React and TypeScript that leverages Google's Gemini AI and Google Maps Grounding to provide intelligent restaurant recommendations. This document explains the architectural decisions, data flow, and design patterns used in the application.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│  (React Components + Tailwind CSS)                       │
├─────────────────────────────────────────────────────────┤
│  App.tsx                                                 │
│  ├── RestaurantFinder.tsx (Main Feature)                │
│  │   ├── Location Services (Browser Geolocation API)    │
│  │   ├── Search Filters (Cuisine, Price, Dietary, etc.) │
│  │   ├── Results Display                                │
│  │   └── Review System (LocalStorage)                   │
│  ├── ChatBot.tsx (AI Assistant)                         │
│  │   ├── Message Management                             │
│  │   └── Streaming Response Handler                     │
│  └── UI.tsx (Reusable Components)                       │
│      ├── Button, Card, Badge                            │
│      ├── Modal, StarRating                              │
│      └── Form Components                                │
├─────────────────────────────────────────────────────────┤
│                   Service Layer                          │
│  services/gemini.ts                                      │
│  ├── findRestaurants() - Maps Grounding                 │
│  ├── getChatSession() - Chat Management                 │
│  └── sendMessageStream() - Streaming Messages           │
├─────────────────────────────────────────────────────────┤
│               External Services                          │
│  ├── Google Gemini AI (gemini-2.5-flash)                │
│  ├── Google Gemini AI (gemini-3-pro-preview)            │
│  ├── Google Maps Grounding API                          │
│  └── Browser APIs (Geolocation, LocalStorage)           │
└─────────────────────────────────────────────────────────┘
```

## Core Architectural Principles

### 1. Separation of Concerns

The application follows a clear separation between:
- **Presentation Layer**: React components handle UI rendering and user interactions
- **Service Layer**: API integration and business logic isolated in services
- **Type Layer**: Centralized type definitions ensure consistency

### 2. Component-Based Architecture

React components are organized by functionality:
- **Feature Components**: `RestaurantFinder`, `ChatBot` (complex, stateful)
- **UI Components**: `Button`, `Card`, `Modal` (simple, reusable)
- **Layout Components**: `App` (structural)

### 3. Type Safety

TypeScript provides compile-time type checking:
- All props and function parameters are typed
- Enums for fixed value sets (CuisineType, PriceRange)
- Interfaces for data structures (Coordinates, RestaurantResult, etc.)

### 4. Single Responsibility

Each module has a single, well-defined purpose:
- `gemini.ts`: All AI API interactions
- `types.ts`: All type definitions
- `UI.tsx`: Reusable UI components
- Each feature component manages its own domain

## Data Flow

### Restaurant Search Flow

```
1. User Input
   ↓
2. RestaurantFinder Component State Update
   ↓
3. handleSearch() Function Call
   ↓
4. services/gemini.ts → findRestaurants()
   ↓
5. Gemini API Request with Maps Grounding
   ↓
6. API Response Processing
   ↓
7. State Update with Results
   ↓
8. UI Re-render with Restaurant Cards
```

### Chat Message Flow

```
1. User Types Message
   ↓
2. ChatBot Component Adds User Message to State
   ↓
3. handleSend() Calls sendMessageStream()
   ↓
4. services/gemini.ts Streams Response
   ↓
5. For Each Chunk:
   - Update Message Content
   - Re-render UI
   ↓
6. Finalize Message When Stream Complete
```

## State Management

### Component State (useState)

Used for UI-specific state that doesn't need global access:

**RestaurantFinder:**
- `location`: User's coordinates
- `cuisine`, `price`: Search filters
- `dietary`, `amenities`: Advanced filters
- `result`: Search results
- `reviews`: User ratings
- `isSearching`: Loading state

**ChatBot:**
- `isOpen`: Chat window visibility
- `messages`: Conversation history
- `input`: Current message text
- `isLoading`: Streaming state

### Persistent State (LocalStorage)

User reviews are stored in browser localStorage:
- Survives page refreshes
- Scoped to current domain
- Simple key-value storage

### Session State

Chat session maintained in memory:
- Preserved during application lifetime
- Reset on page reload
- Allows contextual conversations

## API Integration Strategy

### Model Selection

**gemini-2.5-flash** (Restaurant Search):
- **Why**: Fast response times, tool usage capability
- **Use Case**: Real-time restaurant search with grounding
- **Config**: Maps grounding enabled, location-based retrieval

**gemini-3-pro-preview** (Chatbot):
- **Why**: Superior conversational quality and context understanding
- **Use Case**: Natural language Q&A about food and cooking
- **Config**: System instruction for culinary expertise

### Google Maps Grounding

Provides real restaurant data:
- Restaurant names and locations
- Review snippets
- Google Maps links
- Place IDs for detailed information

**Benefits:**
- No invented/fake data
- Real-time accuracy
- Direct linking to Maps
- Trust through verification

### Error Handling

Three-layer error handling:
1. **Try-Catch**: Service layer catches API errors
2. **State Management**: Components display error messages
3. **User Feedback**: Clear error messages in UI

## Design Patterns

### 1. Singleton Pattern

**Used In**: Chat session management

```typescript
let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({...});
  }
  return chatSession;
};
```

**Why**: Maintains conversation context across multiple messages

### 2. Composition Pattern

**Used In**: UI components

```typescript
<Card>
  <Button>
    <Icon />
  </Button>
</Card>
```

**Why**: Flexible, reusable component assembly

### 3. Streaming Pattern

**Used In**: Chat responses

```typescript
for await (const chunk of responseStream) {
  // Update UI with each chunk
}
```

**Why**: Better UX with progressive content display

### 4. Observer Pattern

**Used In**: React hooks (useState, useEffect)

```typescript
const [state, setState] = useState(initial);
// Component re-renders when state changes
```

**Why**: Automatic UI updates on data changes

## Performance Optimizations

### 1. Lazy Loading

- Components only render when needed
- Modal content loaded on demand

### 2. Debouncing

- Search triggered explicitly (button click)
- Prevents excessive API calls

### 3. Efficient Re-renders

- Proper key usage in lists
- State updates batched by React

### 4. Code Splitting

- Vite automatically splits vendor code
- React components lazy-loaded

### 5. Streaming Responses

- Display content as it arrives
- Perceived performance improvement

## Browser API Usage

### Geolocation API

```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    // Success: Extract coordinates
  },
  (error) => {
    // Error: Handle permission denial
  }
);
```

**Features Used:**
- One-time position request
- Error handling for permissions
- Timeout and accuracy options

### LocalStorage API

```typescript
// Save reviews
localStorage.setItem('restaurant_reviews', JSON.stringify(reviews));

// Load reviews
const saved = localStorage.getItem('restaurant_reviews');
const reviews = saved ? JSON.parse(saved) : [];
```

**Features Used:**
- Persistent key-value storage
- JSON serialization
- Error handling with try-catch

## Security Considerations

### 1. API Key Protection

- API key stored in environment variable
- Never exposed in client code
- Loaded at build time by Vite

### 2. Input Validation

- TypeScript ensures type safety
- User inputs sanitized before API calls
- No SQL/command injection risks (API-based)

### 3. XSS Prevention

- React's automatic escaping
- `dangerouslySetInnerHTML` used only for markdown
- Marked.js sanitizes markdown output

### 4. HTTPS Required

- Geolocation requires secure context
- API calls over HTTPS only

## Scalability Considerations

### Current Limitations

1. **Client-Side Only**: No backend server
2. **Single User**: No multi-user support
3. **Local Storage**: Limited to 5-10MB
4. **API Rate Limits**: Subject to Gemini API quotas

### Future Enhancements

1. **Backend Server**: 
   - Centralized API key management
   - User authentication
   - Database for reviews

2. **Caching Layer**:
   - Cache restaurant results
   - Reduce API calls
   - Faster repeated searches

3. **Real-Time Updates**:
   - WebSocket for live data
   - Push notifications

4. **Advanced Features**:
   - Restaurant reservations
   - Meal planning
   - Social sharing

## Build and Deployment

### Development

```bash
npm run dev
# Vite dev server with HMR
# Port: 3000
# Host: 0.0.0.0 (accessible on network)
```

### Production Build

```bash
npm run build
# Creates optimized bundle in dist/
# Minification, tree-shaking enabled
# Source maps generated
```

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
   - Build and deploy dist/ folder
   - Add environment variables in hosting platform
   
2. **CDN Deployment**
   - Upload to CDN bucket (S3, Cloud Storage)
   - Configure with CloudFront/Cloud CDN

3. **AI Studio**
   - Direct deployment to Google AI Studio
   - Integrated environment

## Testing Strategy

### Current State

No automated tests currently implemented.

### Recommended Additions

1. **Unit Tests**: Component logic, utility functions
2. **Integration Tests**: API service layer
3. **E2E Tests**: User flows (search, chat, review)
4. **Visual Tests**: Component snapshots

### Tools Suggestion

- **Jest**: Unit and integration tests
- **React Testing Library**: Component tests
- **Playwright/Cypress**: E2E tests
- **Storybook**: Component development and documentation

## Monitoring and Debugging

### Development Tools

- React DevTools: Component inspection
- Browser DevTools: Network, console, performance
- Vite HMR: Fast refresh during development

### Error Tracking

- Console logging for API errors
- User-friendly error messages in UI
- State inspection via React DevTools

### Performance Monitoring

- Lighthouse: Performance audits
- Chrome DevTools: Performance profiling
- Network tab: API call timing

## Conclusion

GourmetGuide AI follows modern web development best practices with a focus on:
- Clean separation of concerns
- Type safety with TypeScript
- Efficient API usage with streaming
- User-friendly error handling
- Responsive, accessible UI

The architecture is designed to be maintainable, testable, and extensible for future enhancements.
