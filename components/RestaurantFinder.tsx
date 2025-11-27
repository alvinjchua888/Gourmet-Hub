/**
 * RestaurantFinder Component
 * 
 * The main feature component of GourmetGuide AI. Handles restaurant discovery
 * using AI-powered recommendations with Google Maps grounding.
 * 
 * KEY FEATURES:
 * ============
 * 1. Location Services
 *    - Browser geolocation for user position
 *    - Real-time coordinate tracking
 *    - Permission handling and error states
 * 
 * 2. Smart Search Filters
 *    - Cuisine type selection (Italian, Mexican, etc.)
 *    - Price range filtering ($-$$$$)
 *    - Advanced filters (dietary restrictions, amenities)
 *    - Specific dish search capability
 * 
 * 3. AI-Powered Results
 *    - Natural language recommendations from Gemini 2.5 Flash
 *    - Real restaurant data from Google Maps
 *    - Review snippets and ratings
 *    - Direct links to Google Maps
 * 
 * 4. User Review System
 *    - 5-star rating system
 *    - Written reviews with comments
 *    - LocalStorage persistence
 *    - Aggregate rating display
 * 
 * STATE MANAGEMENT:
 * ================
 * Location State:
 *   - location: User's coordinates
 *   - locationStatus: 'idle' | 'loading' | 'success' | 'error'
 * 
 * Search Filters:
 *   - cuisine: Selected cuisine type
 *   - price: Selected price range
 *   - dietary: Array of dietary restrictions
 *   - amenities: Array of required amenities
 *   - customDish: Specific dish search query
 * 
 * Results:
 *   - isSearching: Loading state during API call
 *   - result: AI summary + grounding chunks from API
 *   - error: Error message to display to user
 * 
 * Reviews:
 *   - reviews: Array of user-submitted reviews (persisted)
 *   - reviewModalOpen: Modal visibility
 *   - selectedRestaurant: Restaurant being reviewed
 *   - newRating: Rating being submitted (1-5)
 *   - newComment: Review comment text
 * 
 * KEY FUNCTIONS:
 * =============
 * - requestLocation(): Get user's current position via Geolocation API
 * - handleSearch(): Perform restaurant search with current filters
 * - toggleFilter(): Toggle selection in multi-select filters
 * - openReviewModal(): Open review submission modal for a restaurant
 * - handleReviewSubmit(): Save user review to localStorage
 * - getRestaurantStats(): Calculate aggregate ratings for a restaurant
 * - renderMarkdown(): Convert markdown text to HTML for display
 * 
 * UI SECTIONS:
 * ===========
 * 1. Header: Title and description
 * 2. Control Panel: Location, filters, and search button
 * 3. Advanced Filters: Expandable dietary and amenity options
 * 4. Results: AI summary and restaurant cards in grid layout
 * 5. Review Modal: Star rating and comment submission
 * 
 * INTEGRATION:
 * ===========
 * - Uses findRestaurants() from services/gemini.ts
 * - Integrates with Google Maps via grounding API
 * - Persists reviews in browser localStorage
 * - Uses marked.js for markdown rendering (loaded from CDN)
 * - Imports UI components: Button, Card, Badge, Modal, StarRating
 * 
 * @module components/RestaurantFinder
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Search, DollarSign, Utensils, ExternalLink, AlertTriangle, Filter, Edit, Star } from 'lucide-react';
import { CuisineType, PriceRange, Coordinates, RestaurantResult, DietaryRestriction, Amenity, Review } from '../types';
import { findRestaurants } from '../services/gemini';
import { Button, Card, Badge, Modal, StarRating } from './UI';

// Declare marked global for markdown rendering (loaded from CDN in index.html)
declare const marked: {
  parse: (text: string) => string;
};

/**
 * RestaurantFinder Component
 * Main feature component for restaurant discovery
 */
export const RestaurantFinder: React.FC = () => {
  // ============================================================================
  // STATE: LOCATION MANAGEMENT
  // ============================================================================
  
  // User's geographic coordinates from browser geolocation
  const [location, setLocation] = useState<Coordinates | null>(null);
  
  // Status of location fetch: idle, loading, success, or error
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // ============================================================================
  // STATE: BASIC SEARCH FILTERS
  // ============================================================================
  
  // Selected cuisine type (e.g., 'Italian', 'Mexican', 'Any Cuisine')
  const [cuisine, setCuisine] = useState<string>(CuisineType.ANY);
  
  // Selected price range (e.g., '$', '$$', 'Any Price')
  const [price, setPrice] = useState<string>(PriceRange.ANY);
  
  // ============================================================================
  // STATE: ADVANCED FILTERS
  // ============================================================================
  
  // Controls visibility of advanced filter section
  const [showFilters, setShowFilters] = useState(false);
  
  // Array of selected dietary restrictions (e.g., ['Vegan', 'Gluten-Free'])
  const [dietary, setDietary] = useState<DietaryRestriction[]>([]);
  
  // Array of selected amenities (e.g., ['Wi-Fi', 'Outdoor Seating'])
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  
  // Optional specific dish search query (e.g., 'Truffle Pizza')
  const [customDish, setCustomDish] = useState('');

  // ============================================================================
  // STATE: SEARCH RESULTS
  // ============================================================================
  
  // Indicates if a search is currently in progress
  const [isSearching, setIsSearching] = useState(false);
  
  // Search results containing AI summary and restaurant data
  const [result, setResult] = useState<RestaurantResult | null>(null);
  
  // Error message to display to user (null if no error)
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // STATE: REVIEW SYSTEM
  // ============================================================================
  
  // User-submitted reviews, persisted in localStorage
  // Initialized from localStorage on component mount
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('restaurant_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // Controls review modal visibility
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
  // Restaurant currently being reviewed
  const [selectedRestaurant, setSelectedRestaurant] = useState<{title: string, uri: string} | null>(null);
  
  // Rating being submitted (1-5 stars, default 5)
  const [newRating, setNewRating] = useState(5);
  
  // Review comment text
  const [newComment, setNewComment] = useState('');

  // ============================================================================
  // CONSTANTS: FILTER OPTIONS
  // ============================================================================
  
  // Available dietary restriction options for filters
  const dietaryOptions: DietaryRestriction[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'];
  
  // Available amenity options for filters
  const amenityOptions: Amenity[] = ['Outdoor Seating', 'Wi-Fi', 'Pet Friendly', 'Parking'];

  // ============================================================================
  // LOCATION SERVICES
  // ============================================================================
  
  /**
   * Requests user's current location using browser Geolocation API
   * 
   * Process:
   * 1. Set loading state
   * 2. Check if geolocation is supported
   * 3. Request current position
   * 4. Update location state on success
   * 5. Show error message on failure
   * 
   * Error cases handled:
   * - Browser doesn't support geolocation
   * - User denies permission
   * - Position unavailable
   * - Request timeout
   */
  const requestLocation = () => {
    setLocationStatus('loading');
    
    // Check browser support
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationStatus('success');
        setError(null);
      },
      (err) => {
        setLocationStatus('error');
        setError("Unable to retrieve your location. Please check permissions.");
        console.error(err);
      }
    );
  };

  const toggleFilter = <T extends string>(item: T, current: T[], setFn: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (current.includes(item)) {
      setFn(current.filter(i => i !== item));
    } else {
      setFn([...current, item]);
    }
  };

  const handleSearch = async () => {
    if (!location) {
      setError("Please enable location services to find restaurants nearby.");
      return;
    }

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const data = await findRestaurants(location, cuisine, price, dietary, amenities, customDish);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch recommendations. Please try again later.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Review Handlers
  const openReviewModal = (title: string, uri: string) => {
    setSelectedRestaurant({ title, uri });
    setNewRating(5);
    setNewComment('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedRestaurant) return;
    
    const review: Review = {
      id: Date.now().toString(),
      restaurantTitle: selectedRestaurant.title,
      rating: newRating,
      comment: newComment,
      timestamp: Date.now()
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem('restaurant_reviews', JSON.stringify(updatedReviews));
    setReviewModalOpen(false);
  };

  const getRestaurantStats = (title: string) => {
    const restaurantReviews = reviews.filter(r => r.restaurantTitle === title);
    if (restaurantReviews.length === 0) return null;
    const sum = restaurantReviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: (sum / restaurantReviews.length).toFixed(1),
      count: restaurantReviews.length
    };
  };

  const renderMarkdown = (text: string) => {
    try {
      return { __html: marked.parse(text) };
    } catch (e) {
      return { __html: text };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Favorite Meal</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          AI-powered restaurant discovery using real-time Google Maps data. 
          Get accurate, top-rated recommendations based on your taste.
        </p>
      </div>

      {/* Control Panel */}
      <Card className="p-6 md:p-8 bg-white shadow-lg border-0 ring-1 ring-slate-100">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Location */}
            <div className="space-y-2 md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700">Location</label>
              <Button 
                variant={locationStatus === 'success' ? 'secondary' : 'outline'}
                className={`w-full justify-between group ${locationStatus === 'success' ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' : ''}`}
                onClick={requestLocation}
                disabled={locationStatus === 'loading'}
              >
                <span className="flex items-center truncate">
                  {locationStatus === 'loading' ? 'Locating...' : 
                   locationStatus === 'success' ? 'Location Set' : 'Use My Location'}
                </span>
                {locationStatus === 'success' ? <MapPin className="w-4 h-4 ml-2" /> : <Navigation className="w-4 h-4 ml-2 group-hover:text-indigo-600" />}
              </Button>
            </div>

            {/* Cuisine Selector */}
            <div className="space-y-2 md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700">Cuisine</label>
              <div className="relative">
                <select 
                  value={cuisine} 
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-8"
                >
                  {Object.values(CuisineType).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Utensils className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Selector */}
            <div className="space-y-2 md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700">Price Range</label>
              <div className="relative">
                <select 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-8"
                >
                  {Object.values(PriceRange).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <DollarSign className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-1">
              <Button 
                variant="primary" 
                className="w-full shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-95"
                onClick={handleSearch}
                isLoading={isSearching}
                disabled={!location}
              >
                <Search className="w-4 h-4 mr-2" />
                Find Restaurants
              </Button>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div>
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
             >
               <Filter className="w-4 h-4 mr-1" />
               {showFilters ? 'Hide Filters' : 'Advanced Filters'}
             </button>
             
             {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
                   <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-700">Dietary Restrictions</h4>
                      <div className="flex flex-wrap gap-2">
                         {dietaryOptions.map(option => (
                           <button
                             key={option}
                             onClick={() => toggleFilter(option, dietary, setDietary)}
                             className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                               dietary.includes(option)
                                 ? 'bg-green-100 text-green-800 border-green-200'
                                 : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                             }`}
                           >
                             {option}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-700">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                         {amenityOptions.map(option => (
                           <button
                             key={option}
                             onClick={() => toggleFilter(option, amenities, setAmenities)}
                             className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                               amenities.includes(option)
                                 ? 'bg-blue-100 text-blue-800 border-blue-200'
                                 : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                             }`}
                           >
                             {option}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="md:col-span-2 space-y-2">
                     <label className="block text-sm font-semibold text-slate-700">Looking for a specific dish?</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Truffle Pizza, Pad Thai"
                       value={customDish}
                       onChange={(e) => setCustomDish(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                     />
                   </div>
                </div>
             )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
            {error}
          </div>
        )}
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-fade-in-up">
          
          {/* AI Summary */}
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <SparklesIcon className="w-24 h-24 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                <SparklesIcon className="w-5 h-5" />
              </span>
              Gemini's Recommendations
            </h2>
            <div 
              className="prose prose-slate max-w-none text-slate-600 [&>p]:leading-relaxed"
              dangerouslySetInnerHTML={renderMarkdown(result.text)}
            />
          </div>

          {/* Map Cards Grid */}
          {result.groundingChunks && result.groundingChunks.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {result.groundingChunks.map((chunk, idx) => {
               if (!chunk.maps) return null;
               const { title, uri } = chunk.maps;
               const snippet = chunk.maps.placeAnswerSources?.reviewSnippets?.[0]?.content;
               const userStats = getRestaurantStats(title);

               return (
                 <div key={idx} className="h-full">
                   <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-indigo-300 relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-slate-800 leading-tight">
                            {title}
                          </h3>
                          <a href={uri} target="_blank" rel="noopener noreferrer">
                             <ExternalLink className="w-4 h-4 text-slate-400 hover:text-indigo-600 transition-colors" />
                          </a>
                        </div>

                        {/* User Rating Badge */}
                        <div className="mb-3 flex items-center gap-2">
                          {userStats ? (
                            <div className="flex items-center text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-md">
                               <Star className="w-3.5 h-3.5 fill-current mr-1" />
                               {userStats.average}
                               <span className="text-slate-400 font-normal ml-1">({userStats.count})</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">No user ratings</span>
                          )}
                        </div>
                        
                        <div className="flex-1 mb-4">
                          {snippet ? (
                             <p className="text-sm text-slate-600 italic line-clamp-3">
                               "{snippet}"
                             </p>
                          ) : (
                            <div className="h-16 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 text-xs italic">
                              Map details available
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                           <a 
                             href={uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded hover:bg-indigo-100 transition-colors"
                           >
                             View Map
                           </a>
                           <button
                             onClick={() => openReviewModal(title, uri)}
                             className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 px-2 py-1"
                           >
                             <Edit className="w-3 h-3" />
                             Rate
                           </button>
                        </div>
                      </div>
                   </Card>
                 </div>
               );
             })}
           </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <Modal 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)}
        title={`Rate ${selectedRestaurant?.title}`}
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-slate-500 font-medium">Tap to rate</span>
            <StarRating 
              rating={newRating} 
              onRatingChange={setNewRating} 
              size="lg"
            />
            <span className="text-2xl font-bold text-slate-800">{newRating}.0</span>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Write a review</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you like? What could be better?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none h-32 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
            <Button onClick={handleReviewSubmit}>Submit Review</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

// Simple Sparkles Icon helper since I used it inside the component
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 11.03a5.25 5.25 0 00-3.47-3.47 5.25 5.25 0 003.47-3.47 5.25 5.25 0 003.47 3.47 5.25 5.25 0 00-3.47 3.47z" clipRule="evenodd" />
  </svg>
);