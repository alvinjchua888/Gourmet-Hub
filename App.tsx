import React from 'react';
import { RestaurantFinder } from './components/RestaurantFinder';
import { ChatBot } from './components/ChatBot';
import { MapPin, ChefHat } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-teal-400 p-2 rounded-lg text-white shadow-md">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">GourmetGuide AI</span>
            </div>
            
            <div className="flex items-center">
              <a href="https://developers.google.com/maps" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Data provided by Google Maps
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RestaurantFinder />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} GourmetGuide AI. Built with Gemini 2.5 Flash & 3 Pro.</p>
        </div>
      </footer>

      {/* Floating Chat Bot */}
      <ChatBot />
      
    </div>
  );
};

export default App;
