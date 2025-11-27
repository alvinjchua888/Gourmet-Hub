# Code Comments Guide

This document explains the inline documentation structure and commenting philosophy used throughout the GourmetGuide AI codebase.

## Documentation Philosophy

The codebase follows these principles for code comments:

1. **Self-Documenting Code**: Code should be clear and readable first
2. **Explain Why, Not What**: Comments explain reasoning and context
3. **JSDoc for APIs**: Use JSDoc format for functions and interfaces
4. **Section Headers**: Use clear section dividers for organization
5. **Examples**: Include usage examples where helpful
6. **Keep Updated**: Comments are updated with code changes

## File-by-File Documentation

### types.ts

**Documentation Level**: Comprehensive

**What's Documented**:
- File-level module description
- Each interface with purpose and usage
- All interface properties with descriptions
- Enum values with semantic meaning
- Type aliases with use cases

**Example Structure**:
```typescript
/**
 * Type Definitions for GourmetGuide AI
 * 
 * This file contains all TypeScript interfaces, types, and enums...
 */

/**
 * Geographic coordinates for location-based searches
 * Used with the browser's Geolocation API and Google Maps Grounding
 */
export interface Coordinates {
  /** Latitude in decimal degrees (positive for North...) */
  latitude: number;
  /** Longitude in decimal degrees (positive for East...) */
  longitude: number;
}
```

**Key Features**:
- Every type is documented with its purpose
- Properties include value ranges and units
- Enums explain semantic meaning of each value
- Cross-references to related types

---

### services/gemini.ts

**Documentation Level**: Comprehensive with Examples

**What's Documented**:
- Module-level overview
- API initialization
- Each function with JSDoc
- Parameter descriptions
- Return type explanations
- Error handling approach
- Usage examples

**JSDoc Structure**:
```typescript
/**
 * Finds restaurants using Google Maps Grounding with Gemini AI
 * 
 * This function constructs a natural language query...
 * 
 * How it works:
 * 1. Builds a detailed prompt from user filters
 * 2. Sends the prompt to Gemini with Maps grounding
 * 3. Includes user's coordinates for location-based results
 * 4. Returns both AI-generated summary and structured data
 * 
 * @param coords - User's geographic coordinates
 * @param cuisine - Selected cuisine type
 * @param price - Price range filter
 * @param dietary - Array of dietary restrictions
 * @param amenities - Array of required amenities
 * @param dishes - Optional specific dish search
 * 
 * @returns Promise containing AI text summary and grounding chunks
 * @throws Error if the API call fails or returns invalid data
 * 
 * @example
 * const result = await findRestaurants(...);
 */
```

**Key Features**:
- Process flow explanations
- Parameter value examples
- Return structure documented
- Error scenarios covered
- Real usage examples

---

### App.tsx

**Documentation Level**: Comprehensive

**What's Documented**:
- Module-level purpose
- Component structure overview
- JSX section comments
- Layout rationale
- Component relationships

**Comment Style**:
```typescript
/**
 * Main Application Component
 * 
 * This is the root component...
 */

{/* 
  Navigation Bar
  - Sticky positioning keeps it visible
  - Semi-transparent background with backdrop blur
  - Contains branding logo and attribution
*/}
<nav>...</nav>
```

**Key Features**:
- Explains why certain layouts are used
- Documents accessibility features
- Notes responsive design decisions
- Clarifies component hierarchy

---

### components/UI.tsx

**Documentation Level**: Comprehensive with API Docs

**What's Documented**:
- Module overview
- Each component purpose
- Props interfaces with descriptions
- Variant explanations
- Feature lists
- Usage examples
- Accessibility notes

**Documentation Pattern**:
```typescript
/**
 * Button Component
 * 
 * A flexible button component with multiple visual variants...
 * 
 * Variants:
 * - primary: Indigo background, white text (main actions)
 * - secondary: Teal background, white text (secondary actions)
 * 
 * Features:
 * - Loading state with animated spinner
 * - Disabled state with reduced opacity
 * - Focus ring for accessibility
 * 
 * @param children - Button label or content
 * @param variant - Visual style variant (default: 'primary')
 * @param isLoading - Shows loading spinner and disables button
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 */
```

**Key Features**:
- Complete API documentation
- Visual variant descriptions
- Accessibility features noted
- Clear usage examples

---

### components/ChatBot.tsx

**Documentation Level**: Comprehensive with Flow Explanations

**What's Documented**:
- Module overview
- Component structure
- State management section
- Each function with process steps
- UI section explanations
- Animation details

**Documentation Sections**:
```typescript
// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Controls chat window visibility
 * - true: Chat window is open and visible
 * - false: Chat window is hidden
 */
const [isOpen, setIsOpen] = useState(false);

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

/**
 * Handles sending a user message and receiving AI response
 * 
 * Process:
 * 1. Validate input (non-empty, not loading)
 * 2. Add user message to chat
 * 3. Clear input field
 * ...
 */
```

**Key Features**:
- Clear section dividers
- Process flow documentation
- State purpose explanations
- Streaming logic documented
- UI behavior notes

---

### components/RestaurantFinder.tsx

**Documentation Level**: Extensive (Large Component)

**What's Documented**:
- Module overview
- Component architecture
- State variables (table format)
- Each major function
- UI sections
- Integration points
- Feature descriptions

**Documentation Approach**:
Due to size, this component uses:
- Section comments for major parts
- Inline comments for complex logic
- JSDoc for exported functions
- UI section explanations

**Key Areas Documented**:
1. **State Management**: What each variable controls
2. **Location Services**: Geolocation API usage
3. **Search Logic**: API integration process
4. **Filter Management**: Multi-select toggles
5. **Review System**: LocalStorage persistence
6. **Results Display**: Rendering strategy
7. **Error Handling**: User feedback

---

## Comment Types Used

### 1. JSDoc Comments

**Used For**: Functions, interfaces, exported items

**Format**:
```typescript
/**
 * Brief description
 * 
 * Detailed explanation with multiple paragraphs if needed
 * 
 * @param paramName - Description
 * @returns Description
 * @throws Description
 * @example
 * // Usage example
 */
```

### 2. Block Comments

**Used For**: Section headers, complex logic explanations

**Format**:
```typescript
/**
 * SECTION TITLE
 * 
 * Section description
 */

/* 
 * Multi-line explanation of complex logic
 * that needs context
 */
```

### 3. Inline Comments

**Used For**: Single-line explanations, clarifications

**Format**:
```typescript
// Explanation of why this line exists
const value = computeValue();

setIsLoading(true); // Disable button during API call
```

### 4. JSX Comments

**Used For**: UI structure explanation

**Format**:
```tsx
{/* 
  Component description
  - Feature 1
  - Feature 2
*/}
<Component />
```

---

## Documentation Standards

### When to Add Comments

**DO Comment**:
- ✅ Purpose of modules and components
- ✅ Complex algorithms or logic
- ✅ Non-obvious design decisions
- ✅ Public API functions
- ✅ Workarounds or hacks
- ✅ TODO items with context
- ✅ Security considerations
- ✅ Performance optimizations

**DON'T Comment**:
- ❌ Obvious code (e.g., `// increment i` for `i++`)
- ❌ What the code does (let the code speak)
- ❌ Redundant information
- ❌ Outdated information
- ❌ Commented-out code (remove it)

### Comment Quality Guidelines

1. **Be Concise**: Clear and brief
2. **Be Specific**: Concrete details
3. **Be Current**: Update with code
4. **Be Helpful**: Add value beyond code
5. **Be Professional**: Proper grammar and spelling

### Example: Good vs Bad Comments

**Bad Comments**:
```typescript
// Set loading to true
setIsLoading(true);

// Loop through items
items.forEach(item => {
  // Process item
  processItem(item);
});

// This is the button
<button>Click</button>
```

**Good Comments**:
```typescript
// Disable button during API call to prevent duplicate requests
setIsLoading(true);

// Process items asynchronously to avoid blocking the UI
// Batch size of 10 chosen based on performance testing
items.forEach(item => {
  processItem(item);
});

{/* 
  Primary action button
  - Disabled until location is set
  - Shows loading spinner during search
*/}
<button>Search Restaurants</button>
```

---

## Comment Maintenance

### Keeping Comments Fresh

1. **Review During Code Review**: Check comment accuracy
2. **Update With Refactoring**: Comments change with code
3. **Remove Obsolete Comments**: Delete when no longer relevant
4. **Add Missing Context**: Fill gaps as they're discovered

### Signs of Outdated Comments

- Describes code that no longer exists
- Contradicts current implementation
- References removed features
- Uses outdated terminology
- Includes wrong function names

---

## Special Comment Patterns

### TODO Comments

**Format**:
```typescript
// TODO: Add error retry logic
// TODO(username): Optimize this query for large datasets
// TODO(#123): Implement feature once API is ready
```

**Include**:
- What needs to be done
- Why it matters
- Who should do it (optional)
- Related issue number (optional)

### FIXME Comments

**Format**:
```typescript
// FIXME: Memory leak in this component
// FIXME: This breaks on Safari - needs investigation
```

**Use When**:
- Known bug exists
- Temporary workaround in place
- Issue needs urgent attention

### NOTE/IMPORTANT Comments

**Format**:
```typescript
// NOTE: This component requires marked.js from CDN
// IMPORTANT: Do not modify without updating tests
// WARNING: Changing this value affects API rate limits
```

### Security Comments

**Format**:
```typescript
/**
 * Security Note: API key must be kept secret
 * Never expose in client-side code
 */

// XSS Protection: marked.js sanitizes markdown output
const html = marked.parse(text);
```

---

## Tools and Automation

### Generating Documentation

While we don't currently use automated doc generation, the code is structured to support tools like:

- **TypeDoc**: For TypeScript documentation
- **JSDoc**: For JavaScript documentation
- **Compodoc**: For Angular-like documentation
- **Docusaurus**: For full documentation sites

### Linting Comments

Consider tools like:
- **ESLint**: Check comment style
- **markdownlint**: For markdown in comments
- **prettier**: Format comments consistently

---

## Documentation Resources

### Created Documentation Files

1. **README.md**: Project overview and quick start
2. **ARCHITECTURE.md**: System design and patterns
3. **API_DOCUMENTATION.md**: API integration details
4. **CONTRIBUTING.md**: Development guidelines
5. **COMPONENT_GUIDE.md**: Component API reference
6. **CODE_COMMENTS.md**: This file

### External Resources

- [JSDoc Documentation](https://jsdoc.app/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Google's Code Comment Style](https://google.github.io/styleguide/)

---

## Summary

The GourmetGuide AI codebase uses comprehensive inline documentation to:

1. **Explain Intent**: Why code exists, not just what it does
2. **Provide Context**: Background for design decisions
3. **Aid Onboarding**: Help new developers understand quickly
4. **Support Maintenance**: Make future changes easier
5. **Document APIs**: Clear interfaces for functions and components

The documentation is:
- **Comprehensive**: Covers all major code elements
- **Consistent**: Follows established patterns
- **Current**: Updated with code changes
- **Helpful**: Adds value beyond the code itself

For specific questions about any commented code, refer to the inline documentation in the relevant file.
