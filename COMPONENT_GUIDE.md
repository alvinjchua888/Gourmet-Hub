# Component Guide

This document provides detailed information about each component in the GourmetGuide AI application, including their purpose, props, state management, and usage examples.

## Table of Contents

- [App Component](#app-component)
- [RestaurantFinder Component](#restaurantfinder-component)
- [ChatBot Component](#chatbot-component)
- [UI Components](#ui-components)
  - [Card](#card)
  - [Button](#button)
  - [Badge](#badge)
  - [StarRating](#starrating)
  - [Modal](#modal)

---

## App Component

**File**: `App.tsx`

### Purpose

The root component that provides the overall application structure and layout.

### Structure

```
App
├── Navigation Bar
│   ├── Logo and Brand Name
│   └── Google Maps Attribution
├── Main Content
│   └── RestaurantFinder Component
├── Footer
│   └── Copyright Information
└── ChatBot Component (Floating)
```

### Features

- **Sticky Navigation**: Remains visible while scrolling
- **Responsive Layout**: Adapts to different screen sizes
- **Flex Layout**: Ensures footer stays at bottom
- **Glassmorphism**: Semi-transparent navigation with backdrop blur

### Usage

```typescript
import App from './App';

// Rendered in index.tsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## RestaurantFinder Component

**File**: `components/RestaurantFinder.tsx`

### Purpose

The main feature component that handles restaurant search functionality, including location services, filters, results display, and user reviews.

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| `location` | `Coordinates \| null` | User's geographic location |
| `locationStatus` | `'idle' \| 'loading' \| 'success' \| 'error'` | Location fetch status |
| `cuisine` | `string` | Selected cuisine type |
| `price` | `string` | Selected price range |
| `showFilters` | `boolean` | Advanced filters visibility |
| `dietary` | `DietaryRestriction[]` | Selected dietary restrictions |
| `amenities` | `Amenity[]` | Selected amenity requirements |
| `customDish` | `string` | Specific dish search query |
| `isSearching` | `boolean` | Search in progress flag |
| `result` | `RestaurantResult \| null` | Search results from API |
| `error` | `string \| null` | Error message to display |
| `reviews` | `Review[]` | User-submitted reviews (persisted in localStorage) |
| `reviewModalOpen` | `boolean` | Review modal visibility |
| `selectedRestaurant` | `{title: string, uri: string} \| null` | Restaurant being reviewed |
| `newRating` | `number` | Rating being submitted (1-5) |
| `newComment` | `string` | Review comment text |

### Key Functions

#### `requestLocation()`
Requests user's current location using browser Geolocation API.

**Process:**
1. Checks if geolocation is supported
2. Requests current position
3. Updates location state on success
4. Shows error message on failure

**Error Handling:**
- Not supported: "Geolocation is not supported"
- Permission denied: "Unable to retrieve your location"
- Timeout: Handled by browser API

#### `handleSearch()`
Performs restaurant search based on current filters.

**Process:**
1. Validates location is available
2. Sets loading state
3. Calls `findRestaurants()` service
4. Updates result state with data
5. Handles errors gracefully

**Parameters Sent to API:**
- User coordinates
- Cuisine preference
- Price range
- Dietary restrictions (optional)
- Amenities (optional)
- Custom dish query (optional)

#### `toggleFilter<T>()`
Generic function to toggle filter selections (dietary, amenities).

**Parameters:**
- `item`: The filter value to toggle
- `current`: Current array of selected filters
- `setFn`: State setter function

**Logic:**
- If item is in array: Remove it
- If item not in array: Add it

#### `openReviewModal()` / `handleReviewSubmit()`
Manages the review submission workflow.

**Process:**
1. User clicks "Rate" button on restaurant card
2. Modal opens with star rating and comment field
3. User selects rating and writes comment
4. On submit:
   - Creates Review object with timestamp
   - Adds to reviews array
   - Saves to localStorage
   - Closes modal

#### `getRestaurantStats()`
Calculates aggregate rating statistics for a restaurant.

**Returns:**
- `average`: Average rating (e.g., "4.3")
- `count`: Number of reviews
- `null`: If no reviews exist

#### `renderMarkdown()`
Converts markdown text to HTML for display.

**Security:** Uses marked.js which sanitizes output

### UI Sections

#### 1. Header Section
- Title with gradient text
- Subtitle explaining the feature
- Centered layout

#### 2. Control Panel Card
**Location Button:**
- Triggers geolocation request
- Shows status (idle/loading/success/error)
- Visual feedback with icons

**Cuisine Selector:**
- Dropdown with all cuisine types
- Utensils icon decoration

**Price Range Selector:**
- Dropdown with price tiers ($-$$$$)
- Dollar sign icon decoration

**Search Button:**
- Primary action button
- Disabled until location is set
- Shows loading state during search

**Advanced Filters Toggle:**
- Expandable section
- Dietary restrictions (multi-select chips)
- Amenities (multi-select chips)
- Custom dish text input

#### 3. Results Section
**AI Summary Card:**
- Gradient background with sparkles icon
- Markdown-formatted recommendation text
- Prominent placement above restaurant cards

**Restaurant Cards Grid:**
- Responsive grid (1/2/3 columns)
- Each card shows:
  - Restaurant name
  - User rating badge (if available)
  - Review snippet from Google Maps
  - "View Map" link
  - "Rate" button

#### 4. Review Modal
- Star rating component (interactive)
- Text area for comments
- Submit/Cancel buttons
- Smooth animations

### Props

None (self-contained component)

### Usage Example

```typescript
import { RestaurantFinder } from './components/RestaurantFinder';

function App() {
  return (
    <div>
      <RestaurantFinder />
    </div>
  );
}
```

### Integration Points

- **Services**: Calls `findRestaurants()` from `services/gemini.ts`
- **Types**: Uses interfaces from `types.ts`
- **UI Components**: Uses `Button`, `Card`, `Badge`, `Modal`, `StarRating`
- **Browser APIs**: Geolocation API, LocalStorage API
- **External Libraries**: marked.js for markdown rendering

---

## ChatBot Component

**File**: `components/ChatBot.tsx`

### Purpose

Provides an AI-powered chatbot interface for culinary questions and cooking advice.

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isOpen` | `boolean` | Chat window visibility |
| `input` | `string` | Current message being typed |
| `messages` | `ChatMessage[]` | Conversation history |
| `isLoading` | `boolean` | Streaming in progress |
| `messagesEndRef` | `Ref<HTMLDivElement>` | Reference for auto-scroll |

### Key Functions

#### `scrollToBottom()`
Scrolls message list to show latest message.

**Called When:**
- New message added
- Chat window opened
- Component re-renders

#### `handleSend()`
Sends user message and receives streaming AI response.

**Process:**
1. Validates input (non-empty, not loading)
2. Adds user message to chat
3. Clears input field
4. Initiates streaming API call
5. Creates placeholder for AI response
6. Streams response chunks
7. Updates message incrementally
8. Finalizes message when complete
9. Handles errors with user-friendly message

**Streaming Logic:**
```typescript
for await (const chunk of responseStream) {
  fullContent += chunk.text;
  // Update UI with accumulated content
  setMessages(prev => 
    prev.map(msg => 
      msg.id === botMsgId 
        ? { ...msg, content: fullContent }
        : msg
    )
  );
}
```

#### `renderMarkdown()`
Converts markdown to HTML for rich text display.

### UI Structure

#### Toggle Button (Fixed)
- Bottom-right corner positioning
- Rotates 90° when open
- Color changes: Indigo (closed) → Red (open)
- Icons: MessageCircle → X

#### Chat Window
**Header:**
- Gradient background (indigo → purple)
- Bot icon with title
- "Powered by Gemini Pro" subtitle

**Message Area:**
- Scrollable container
- User messages: Right-aligned, indigo background
- AI messages: Left-aligned, white background
- Markdown rendering for AI responses
- Auto-scroll to latest message

**Input Area:**
- Text input field
- Send button (enabled when input has text)
- Enter key shortcut
- Disabled during streaming

### Props

None (self-contained component)

### Usage Example

```typescript
import { ChatBot } from './components/ChatBot';

function App() {
  return (
    <div>
      {/* Other content */}
      <ChatBot />
    </div>
  );
}
```

### Animation States

- **Closed**: `opacity-0 scale-95 pointer-events-none`
- **Open**: `opacity-100 scale-100`
- **Toggle Button**: Rotation transition (0° → 90°)

### Integration Points

- **Services**: Calls `sendMessageStream()` from `services/gemini.ts`
- **Types**: Uses `ChatMessage` interface
- **External Libraries**: marked.js for markdown, lucide-react for icons

---

## UI Components

### Card

**File**: `components/UI.tsx`

#### Purpose
Reusable container component with consistent styling.

#### Props
- `children`: `React.ReactNode` - Content to display
- `className?`: `string` - Additional Tailwind classes

#### Features
- White background
- Rounded corners (xl)
- Shadow and border
- Overflow hidden

#### Usage
```typescript
<Card className="p-4">
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

---

### Button

**File**: `components/UI.tsx`

#### Purpose
Multi-variant button component with loading states.

#### Props
- `children`: `React.ReactNode` - Button label
- `variant?`: `'primary' | 'secondary' | 'outline' | 'ghost'` - Visual style
- `isLoading?`: `boolean` - Show loading spinner
- `className?`: `string` - Additional classes
- `...props`: All native button attributes

#### Variants

| Variant | Background | Text | Use Case |
|---------|-----------|------|----------|
| primary | Indigo | White | Main actions |
| secondary | Teal | White | Secondary actions |
| outline | White | Gray | Tertiary actions |
| ghost | Transparent | Gray | Subtle actions |

#### Features
- Loading state with animated spinner
- Disabled state styling
- Focus ring for accessibility
- Smooth transitions

#### Usage
```typescript
<Button 
  variant="primary" 
  onClick={handleClick}
  isLoading={loading}
>
  Submit
</Button>
```

---

### Badge

**File**: `components/UI.tsx`

#### Purpose
Small label component for tags and status indicators.

#### Props
- `children`: `React.ReactNode` - Badge text
- `color?`: `'indigo' | 'green' | 'red' | 'yellow' | 'gray'` - Color variant

#### Color Meanings
- **Indigo**: Primary/brand
- **Green**: Success/positive
- **Red**: Error/danger
- **Yellow**: Warning/caution
- **Gray**: Neutral/default

#### Usage
```typescript
<Badge color="green">Active</Badge>
<Badge color="red">Closed</Badge>
```

---

### StarRating

**File**: `components/UI.tsx`

#### Purpose
Interactive or display-only star rating component.

#### Props
- `rating`: `number` - Current rating (0-maxRating)
- `maxRating?`: `number` - Maximum rating (default: 5)
- `onRatingChange?`: `(rating: number) => void` - Callback for changes
- `size?`: `'sm' | 'md' | 'lg'` - Star size
- `readonly?`: `boolean` - Disable interaction

#### Modes

**Interactive Mode** (onRatingChange provided):
- Clickable stars
- Hover effects
- Scale animations
- Callback on selection

**Display Mode** (readonly or no callback):
- Shows rating only
- No hover effects
- Non-interactive

#### Usage
```typescript
// Interactive
<StarRating 
  rating={userRating}
  onRatingChange={setUserRating}
  size="lg"
/>

// Display only
<StarRating 
  rating={4.5} 
  readonly 
  size="sm"
/>
```

---

### Modal

**File**: `components/UI.tsx`

#### Purpose
Accessible modal dialog for overlays.

#### Props
- `isOpen`: `boolean` - Controls visibility
- `onClose`: `() => void` - Close callback
- `title`: `string` - Modal header text
- `children`: `React.ReactNode` - Modal content

#### Features
- Full-screen backdrop with blur
- Fade and scale animations
- Header with close button
- High z-index (60)
- Centered on screen

#### Structure
```
Modal
├── Backdrop (black/50 with blur)
└── Container (white, rounded, shadow)
    ├── Header (title + close button)
    └── Content (children)
```

#### Usage
```typescript
<Modal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
>
  <p>Modal content here</p>
  <Button onClick={handleAction}>Confirm</Button>
</Modal>
```

---

## Component Communication

### Data Flow Diagram

```
App (Root)
├── RestaurantFinder
│   ├── Uses: gemini.ts (findRestaurants)
│   ├── Uses: UI components
│   ├── Reads: LocalStorage (reviews)
│   └── Writes: LocalStorage (reviews)
└── ChatBot
    ├── Uses: gemini.ts (sendMessageStream)
    └── Independent state
```

### Shared Dependencies

- **Types**: All components use interfaces from `types.ts`
- **Icons**: All use lucide-react for consistent iconography
- **Styling**: All use Tailwind CSS utility classes
- **External Libraries**: marked.js for markdown rendering

---

## Best Practices

### Component Design

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition**: Build complex UIs from simple components
3. **Props Interface**: Define explicit prop types
4. **Default Props**: Provide sensible defaults
5. **Error Handling**: Gracefully handle failures

### State Management

1. **Local State**: Use useState for component-specific data
2. **Derived State**: Compute from existing state/props
3. **Side Effects**: Use useEffect for subscriptions
4. **Refs**: Use useRef for DOM access and mutable values

### Performance

1. **Minimal Re-renders**: Proper dependency arrays
2. **Memoization**: React.memo for expensive components
3. **Lazy Loading**: Load on demand where possible
4. **Debouncing**: For expensive operations

### Accessibility

1. **Semantic HTML**: Use appropriate elements
2. **ARIA Labels**: Add where needed
3. **Keyboard Navigation**: Ensure all actions are accessible
4. **Focus Management**: Proper focus indicators

---

## Testing Recommendations

### Unit Tests

Test individual component logic:
- State updates
- Event handlers
- Utility functions
- Rendering logic

### Integration Tests

Test component interactions:
- API calls
- State synchronization
- Event propagation
- Data flow

### E2E Tests

Test user workflows:
- Restaurant search
- Chat conversation
- Review submission
- Error scenarios

---

## Future Enhancements

### RestaurantFinder
- [ ] Save favorite restaurants
- [ ] Share results via social media
- [ ] Export results as PDF
- [ ] Advanced sorting/filtering
- [ ] Map view integration

### ChatBot
- [ ] Voice input/output
- [ ] Image upload for food identification
- [ ] Recipe suggestions with ingredients
- [ ] Meal planning integration

### UI Components
- [ ] Toast notifications
- [ ] Loading skeletons
- [ ] Dropdown menu component
- [ ] Tabs component
- [ ] Accordion component

---

## Conclusion

The GourmetGuide AI component library is designed to be modular, reusable, and maintainable. Each component follows React best practices and provides a clean API for integration and customization.

For more information, see:
- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
