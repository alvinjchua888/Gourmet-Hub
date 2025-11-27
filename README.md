<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GourmetGuide AI 🍽️

A smart, location-based restaurant discovery application powered by Google's Gemini AI and Google Maps Grounding. Find the perfect dining spot with intelligent recommendations based on your location, cuisine preferences, dietary restrictions, and more.

View your app in AI Studio: https://ai.studio/apps/drive/11Z_wWUO1lgjSrrPdG02ljosgk6sOCMhv

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [API Integration](#api-integration)
- [Development](#development)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔍 Smart Restaurant Discovery
- **Location-Based Search**: Uses browser geolocation to find restaurants near you
- **Multiple Filters**: Filter by cuisine type, price range, dietary restrictions, and amenities
- **Specific Dish Search**: Look for restaurants serving specific dishes (e.g., "Truffle Pizza", "Pad Thai")
- **Real-Time Data**: Powered by Google Maps for accurate, up-to-date restaurant information

### 🤖 AI-Powered Features
- **Intelligent Recommendations**: Gemini 2.5 Flash analyzes and suggests the best restaurants based on your criteria
- **Interactive Chatbot**: Ask culinary questions, get cooking tips, and food recommendations using Gemini 3 Pro
- **Review Analysis**: AI-powered summaries of restaurant reviews and ratings

### 💬 Interactive Chat Assistant
- Real-time streaming responses for instant feedback
- Culinary expertise for cooking tips and food advice
- Persistent chat sessions for contextual conversations

### ⭐ User Reviews & Ratings
- Rate restaurants on a 5-star scale
- Write detailed reviews
- View aggregate user ratings
- Local storage persistence for your reviews

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Clean, intuitive interface with Tailwind CSS
- Smooth animations and transitions
- Accessible components

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.2.0**: Modern UI library with hooks and functional components
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Fast build tool and development server

### AI & APIs
- **Google Gemini AI**: 
  - Gemini 2.5 Flash for fast restaurant recommendations with grounding
  - Gemini 3 Pro for high-quality conversational AI
- **Google Maps Grounding**: Real-time location data and restaurant information
- **@google/genai 1.30.0**: Official Gemini AI SDK

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Lucide React 0.555.0**: Beautiful, consistent icon library
- **Custom Components**: Reusable UI components (Button, Card, Modal, StarRating)

### Data Management
- **Browser Geolocation API**: Location services
- **LocalStorage**: Persistent review storage
- **Markdown Rendering**: marked.js for rich text formatting

## 📁 Project Structure

```
Gourmet-Hub/
├── components/              # React components
│   ├── RestaurantFinder.tsx # Main restaurant search interface
│   ├── ChatBot.tsx          # AI chatbot component
│   └── UI.tsx               # Reusable UI components
├── services/                # API and external services
│   └── gemini.ts           # Gemini AI integration
├── App.tsx                 # Root application component
├── index.tsx               # Application entry point
├── index.html              # HTML template
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

### Component Overview

#### `App.tsx`
The root component that provides the application layout including:
- Navigation bar with branding
- Main content area
- Footer
- ChatBot integration

#### `RestaurantFinder.tsx`
The main feature component handling:
- Location detection and management
- Search filters (cuisine, price, dietary, amenities)
- Restaurant search results display
- User review system
- Advanced filter options

#### `ChatBot.tsx`
An interactive AI assistant that:
- Streams responses from Gemini 3 Pro
- Maintains chat history
- Provides culinary advice and cooking tips
- Features a floating button interface

#### `UI.tsx`
Reusable component library including:
- `Button`: Multiple variants (primary, secondary, outline, ghost) with loading states
- `Card`: Container component with consistent styling
- `Badge`: Small label components with color variants
- `StarRating`: Interactive star rating component
- `Modal`: Accessible modal dialog component

#### `services/gemini.ts`
API integration layer providing:
- `findRestaurants()`: Search function with Google Maps grounding
- `getChatSession()`: Chat session management
- `sendMessageStream()`: Streaming message API

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alvinjchua888/Gourmet-Hub.git
   cd Gourmet-Hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

## 📖 Usage Guide

### Finding Restaurants

1. **Enable Location**: Click "Use My Location" to allow the app to access your location
2. **Set Preferences**: 
   - Select your preferred cuisine type
   - Choose a price range
   - (Optional) Click "Advanced Filters" for more options
3. **Search**: Click "Find Restaurants" to get AI-powered recommendations
4. **View Results**: Browse restaurant cards with ratings, reviews, and Google Maps links

### Advanced Filters

- **Dietary Restrictions**: Filter for Vegetarian, Vegan, Gluten-Free, or Halal options
- **Amenities**: Find restaurants with Outdoor Seating, Wi-Fi, Pet Friendly spaces, or Parking
- **Specific Dishes**: Enter dish names to find restaurants that serve them

### Using the Chatbot

1. Click the chat icon in the bottom-right corner
2. Type your question about food, cooking, or cuisines
3. Get real-time streaming responses from Gemini AI
4. Chat history is maintained during your session

### Rating Restaurants

1. Find a restaurant in the search results
2. Click the "Rate" button on the restaurant card
3. Select a star rating (1-5 stars)
4. Write an optional review
5. Submit - your rating is saved locally

## 🔌 API Integration

### Gemini AI Models

The application uses two Gemini models:

1. **gemini-2.5-flash**: Fast responses for restaurant recommendations
   - Optimized for speed and tool usage (Google Maps)
   - Handles structured queries with grounding

2. **gemini-3-pro-preview**: High-quality conversational AI
   - Used for the chatbot feature
   - Provides detailed, contextual responses

### Google Maps Grounding

Maps grounding provides:
- Real restaurant locations
- Current ratings and reviews
- Place IDs and direct links
- Address and contact information

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 🔧 Development

### Available Scripts

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **React**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Absolute imports supported via `@/` alias

### Key Technologies Used

- **React Hooks**: useState, useEffect, useRef for state management
- **Async/Await**: For API calls and data fetching
- **TypeScript Interfaces**: Strong typing for props and data structures
- **Tailwind CSS**: Utility classes for styling
- **ESNext Modules**: Modern JavaScript module syntax

## 🏗️ Architecture

### Data Flow

1. User interaction triggers state changes in React components
2. Components call service functions in `services/gemini.ts`
3. Service functions communicate with Gemini API
4. Responses are processed and state is updated
5. UI re-renders with new data

### State Management

- **Local Component State**: useState for component-specific data
- **LocalStorage**: Persistent storage for user reviews
- **Session State**: Chat history maintained during app lifetime

### Type Safety

All components and functions are fully typed with TypeScript:
- Interface definitions in `types.ts`
- Prop types for all components
- Return types for all functions
- Enum types for fixed value sets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Code Quality

- Maintain TypeScript type safety
- Follow existing code style and patterns
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is built using AI Studio and uses Google's Gemini AI. See the [Google AI Terms of Service](https://ai.google.dev/terms) for API usage terms.

## 🙏 Acknowledgments

- **Google Gemini AI**: For powerful AI capabilities
- **Google Maps**: For location data and restaurant information
- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For beautiful icons

## 📞 Support

For issues, questions, or suggestions:
- Open an issue in the GitHub repository
- Visit the AI Studio app page: https://ai.studio/apps/drive/11Z_wWUO1lgjSrrPdG02ljosgk6sOCMhv

---

Built with ❤️ using React, TypeScript, and Gemini AI
