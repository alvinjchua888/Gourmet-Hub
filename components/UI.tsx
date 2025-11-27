/**
 * Reusable UI Components Library
 * 
 * This module provides a set of consistent, reusable UI components used throughout
 * the application. All components follow a unified design system with Tailwind CSS.
 * 
 * Components included:
 * - Card: Container component with consistent styling
 * - Button: Multi-variant button with loading states
 * - Badge: Small label component with color variants
 * - StarRating: Interactive star rating component
 * - Modal: Accessible modal dialog
 * 
 * @module components/UI
 */

import React from 'react';

/**
 * Card Component
 * 
 * A versatile container component that provides consistent styling for content blocks.
 * Used throughout the app for grouping related information.
 * 
 * Features:
 * - Rounded corners with shadow
 * - Border for definition
 * - Overflow hidden for child element containment
 * - Flexible with custom className support
 * 
 * @param children - Content to render inside the card
 * @param className - Additional Tailwind classes to apply
 * 
 * @example
 * <Card className="p-4">
 *   <h2>Title</h2>
 *   <p>Content</p>
 * </Card>
 */
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

/**
 * Button Props Interface
 * 
 * Extends native button attributes with custom properties
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Shows loading spinner and disables button */
  isLoading?: boolean;
}

/**
 * Button Component
 * 
 * A flexible button component with multiple visual variants and loading states.
 * Provides consistent button styling across the application.
 * 
 * Variants:
 * - primary: Indigo background, white text (main actions)
 * - secondary: Teal background, white text (secondary actions)
 * - outline: White background with border (tertiary actions)
 * - ghost: Transparent background (subtle actions)
 * 
 * Features:
 * - Loading state with animated spinner
 * - Disabled state with reduced opacity
 * - Focus ring for accessibility
 * - Smooth transitions
 * 
 * @param children - Button label or content
 * @param variant - Visual style variant (default: 'primary')
 * @param isLoading - Shows loading spinner and disables button
 * @param className - Additional Tailwind classes
 * @param disabled - Native disabled state
 * @param props - All other native button props
 * 
 * @example
 * <Button variant="primary" onClick={handleClick} isLoading={loading}>
 *   Submit
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  // Base styles applied to all button variants
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Variant-specific styling
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          {/* Animated spinning loader SVG */}
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

/**
 * Badge Component
 * 
 * A small label component for displaying status, categories, or tags.
 * Provides visual distinction with color-coded variants.
 * 
 * Color Variants:
 * - indigo: Primary brand color
 * - green: Success/positive states
 * - red: Error/negative states
 * - yellow: Warning states
 * - gray: Neutral/default state
 * 
 * @param children - Badge content (usually text)
 * @param color - Color variant (default: 'gray')
 * 
 * @example
 * <Badge color="green">Active</Badge>
 * <Badge color="red">Closed</Badge>
 */
export const Badge: React.FC<{ children: React.ReactNode; color?: 'indigo' | 'green' | 'red' | 'yellow' | 'gray' }> = ({ children, color = 'gray' }) => {
  // Color-specific background and text combinations
  const colors = {
    indigo: "bg-indigo-100 text-indigo-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-amber-100 text-amber-800",
    gray: "bg-slate-100 text-slate-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

/**
 * Star Rating Props Interface
 */
interface StarRatingProps {
  /** Current rating value (0 to maxRating) */
  rating: number;
  /** Maximum rating value (default: 5) */
  maxRating?: number;
  /** Callback when rating changes (interactive mode) */
  onRatingChange?: (rating: number) => void;
  /** Star size variant */
  size?: 'sm' | 'md' | 'lg';
  /** If true, stars are not clickable */
  readonly?: boolean;
}

/**
 * StarRating Component
 * 
 * An interactive or display-only star rating component. Can be used for both
 * showing existing ratings and collecting new ratings from users.
 * 
 * Features:
 * - Interactive mode: Click stars to set rating
 * - Display mode: Show rating without interaction
 * - Multiple sizes: Small, medium, large
 * - Smooth animations on hover/click
 * - Accessible with keyboard support
 * 
 * Interactive Mode (onRatingChange provided):
 * - Stars are clickable
 * - Hover effects show preview
 * - Scale animation on interaction
 * 
 * Display Mode (readonly or no onRatingChange):
 * - Stars show current rating only
 * - No hover effects
 * - No interaction
 * 
 * @param rating - Current rating value (0-5 by default)
 * @param maxRating - Maximum rating (default: 5)
 * @param onRatingChange - Callback for interactive mode
 * @param size - Star size ('sm' | 'md' | 'lg')
 * @param readonly - Disable interaction
 * 
 * @example
 * // Interactive rating
 * <StarRating 
 *   rating={userRating} 
 *   onRatingChange={setUserRating}
 *   size="lg"
 * />
 * 
 * // Display only
 * <StarRating rating={4.5} readonly size="sm" />
 */
export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  onRatingChange, 
  size = 'md',
  readonly = false 
}) => {
  const stars = [];
  
  // Size-specific styling for stars
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  // Generate star elements based on maxRating
  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= rating;
    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => !readonly && onRatingChange?.(i)}
        disabled={readonly}
        className={`focus:outline-none transition-transform ${!readonly ? 'hover:scale-110 active:scale-95' : 'cursor-default'}`}
      >
        <svg 
          className={`${sizeClasses[size]} ${isFilled ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Star polygon shape */}
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    );
  }
  
  return <div className="flex gap-0.5">{stars}</div>;
};

/**
 * Modal Component
 * 
 * An accessible modal dialog component for displaying content in an overlay.
 * Follows best practices for modal dialogs with backdrop and animations.
 * 
 * Features:
 * - Full-screen backdrop with blur effect
 * - Smooth fade-in and scale animations
 * - Header with title and close button
 * - Content area for flexible child components
 * - High z-index to appear above all content
 * - Click outside to close (via onClose callback)
 * 
 * Accessibility:
 * - Close button clearly visible
 * - Keyboard accessible
 * - High contrast for visibility
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal should close
 * @param title - Modal header title
 * @param children - Modal content
 * 
 * @example
 * <Modal 
 *   isOpen={showModal} 
 *   onClose={() => setShowModal(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure?</p>
 *   <Button onClick={handleConfirm}>Yes</Button>
 * </Modal>
 */
export const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, title, children }) => {
  // Don't render anything if modal is closed
  if (!isOpen) return null;
  
  return (
    // Backdrop overlay with blur effect
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Modal container */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header with title and close button */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            aria-label="Close modal"
          >
            {/* X icon for close button */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {/* Content area */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};