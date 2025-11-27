/**
 * Main Application Component
 * 
 * This is the root component of the GourmetGuide AI application.
 * It provides the overall layout structure including navigation, main content area,
 * footer, and the floating chatbot interface.
 * 
 * Component Structure:
 * - Navigation bar with branding and attribution
 * - Main content area that renders the RestaurantFinder component
 * - Footer with copyright information
 * - Floating ChatBot component for AI assistance
 * 
 * @module App
 */

import React from 'react';
import { RestaurantFinder } from './components/RestaurantFinder';
import { ChatBot } from './components/ChatBot';
import { MapPin, ChefHat } from 'lucide-react';

/**
 * App Component
 * 
 * The main application component that orchestrates the layout and structure
 * of the entire application. Uses a flex column layout to ensure the footer
 * stays at the bottom of the page.
 * 
 * @returns {React.FC} The rendered application
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* 
        Navigation Bar
        - Sticky positioning keeps it visible while scrolling
        - Semi-transparent background with backdrop blur for modern effect
        - Contains branding logo and Google Maps attribution
      */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* 
              Left side: Brand logo and name
              - Gradient background for logo adds visual appeal
              - ChefHat icon represents culinary focus
            */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-teal-400 p-2 rounded-lg text-white shadow-md">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">GourmetGuide AI</span>
            </div>
            
            {/* 
              Right side: Google Maps attribution
              - Required for using Google Maps data
              - Links to Google Maps developer documentation
            */}
            <div className="flex items-center">
              <a href="https://developers.google.com/maps" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Data provided by Google Maps
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 
        Main Content Area
        - flex-grow ensures it takes remaining vertical space
        - Contains the primary RestaurantFinder feature
      */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RestaurantFinder />
        </div>
      </main>

      {/* 
        Footer
        - mt-auto pushes it to the bottom of the page
        - Shows copyright and technology attribution
      */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} GourmetGuide AI. Built with Gemini 2.5 Flash & 3 Pro.</p>
        </div>
      </footer>

      {/* 
        Floating Chat Bot
        - Rendered at the root level to appear on top of all content
        - Fixed positioning provides persistent access
        - Self-contained component with its own state and UI
      */}
      <ChatBot />
      
    </div>
  );
};

export default App;
