# Contributing to GourmetGuide AI

Thank you for your interest in contributing to GourmetGuide AI! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guide](#code-style-guide)
- [Component Guidelines](#component-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **A code editor** (VS Code recommended)
- **Gemini API Key** (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Gourmet-Hub.git
   cd Gourmet-Hub
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/alvinjchua888/Gourmet-Hub.git
   ```

---

## Development Setup

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

### Project Structure

```
Gourmet-Hub/
├── components/           # React components
│   ├── RestaurantFinder.tsx
│   ├── ChatBot.tsx
│   └── UI.tsx
├── services/            # API integration
│   └── gemini.ts
├── App.tsx              # Root component
├── index.tsx            # Entry point
├── types.ts             # Type definitions
├── vite.config.ts       # Build configuration
└── README.md            # Main documentation
```

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Code Style Guide

### TypeScript

**Type Everything:**
```typescript
// ✅ Good
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  console.log(event.currentTarget);
};

// ❌ Bad
const handleClick = (event: any) => {
  console.log(event.currentTarget);
};
```

**Use Interfaces for Objects:**
```typescript
// ✅ Good
interface UserData {
  name: string;
  email: string;
}

// ❌ Bad
type UserData = {
  name: string;
  email: string;
}; // Use interface for object shapes
```

**Prefer Enums for Fixed Values:**
```typescript
// ✅ Good
enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success'
}

// ❌ Bad
const STATUS_IDLE = 'idle';
const STATUS_LOADING = 'loading';
```

### React Components

**Functional Components:**
```typescript
// ✅ Good - Named export with type annotation
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>...</div>;
};

// ❌ Bad - Avoid default exports for components
export default function MyComponent({ prop1, prop2 }) {
  return <div>...</div>;
}
```

**Hooks Order:**
```typescript
const MyComponent: React.FC = () => {
  // 1. State hooks
  const [state, setState] = useState(initial);
  
  // 2. Effect hooks
  useEffect(() => {}, []);
  
  // 3. Refs
  const ref = useRef(null);
  
  // 4. Event handlers
  const handleClick = () => {};
  
  // 5. Render helpers
  const renderItem = () => {};
  
  // 6. Return JSX
  return <div>...</div>;
};
```

**Props Interface:**
```typescript
// ✅ Good - Explicit interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return <button>...</button>;
};
```

### Naming Conventions

- **Components**: PascalCase (`RestaurantFinder`, `ChatBot`)
- **Functions**: camelCase (`handleClick`, `findRestaurants`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`Coordinates`, `RestaurantResult`)
- **Files**: Match component name (`RestaurantFinder.tsx`)

### Comments

**JSDoc for Functions:**
```typescript
/**
 * Finds restaurants based on user preferences
 * 
 * @param coords - User's geographic coordinates
 * @param cuisine - Selected cuisine type
 * @returns Promise with restaurant results
 * @throws Error if API call fails
 */
export const findRestaurants = async (
  coords: Coordinates,
  cuisine: string
): Promise<RestaurantResult> => {
  // Implementation
};
```

**Inline Comments:**
```typescript
// ✅ Good - Explain why, not what
// Disable button during API call to prevent duplicate requests
setIsLoading(true);

// ❌ Bad - Obvious
// Set loading to true
setIsLoading(true);
```

### Styling with Tailwind

**Use Semantic Class Order:**
```typescript
// Layout -> Sizing -> Spacing -> Colors -> Typography -> Effects
className="flex items-center w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
```

**Extract Repeated Patterns:**
```typescript
// ✅ Good
const buttonClasses = "px-4 py-2 rounded-lg transition-colors";

<button className={`${buttonClasses} bg-indigo-600`} />
<button className={`${buttonClasses} bg-red-600`} />
```

---

## Component Guidelines

### Creating New Components

1. **Start with Types:**
   ```typescript
   // Define props interface first
   interface MyComponentProps {
     data: SomeType;
     onAction: (id: string) => void;
   }
   ```

2. **Component Structure:**
   ```typescript
   export const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
     // State
     const [state, setState] = useState(initial);
     
     // Effects
     useEffect(() => {
       // Side effects
     }, [dependencies]);
     
     // Handlers
     const handleAction = () => {
       onAction(data.id);
     };
     
     // Render
     return (
       <div>
         {/* JSX */}
       </div>
     );
   };
   ```

3. **Add to Appropriate File:**
   - UI components → `components/UI.tsx`
   - Feature components → New file in `components/`
   - Helper functions → `services/` or create `utils/`

### State Management

**Local State:**
```typescript
// Use for component-specific data
const [isOpen, setIsOpen] = useState(false);
```

**Derived State:**
```typescript
// Compute from existing state/props
const filteredItems = items.filter(item => item.active);
```

**Persistent State:**
```typescript
// Use localStorage for user data
const [reviews, setReviews] = useState<Review[]>(() => {
  try {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

// Save on change
useEffect(() => {
  localStorage.setItem('reviews', JSON.stringify(reviews));
}, [reviews]);
```

### Error Handling

**Component Level:**
```typescript
const [error, setError] = useState<string | null>(null);

const handleAction = async () => {
  try {
    setError(null);
    await someAsyncOperation();
  } catch (err) {
    setError("Operation failed. Please try again.");
    console.error(err);
  }
};

// Display error
{error && (
  <div className="text-red-600">
    {error}
  </div>
)}
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(search): add dietary restriction filters

Added new filter options for vegetarian, vegan, gluten-free, and halal.
Users can now select multiple dietary restrictions for restaurant search.

Closes #42
```

```
fix(chat): resolve streaming response delay

Fixed issue where chat responses would not update UI during streaming.
Changed state update logic to trigger re-render on each chunk.
```

```
docs(readme): add API integration section

Added detailed documentation about Gemini API usage and configuration.
```

### Commit Best Practices

- Write in present tense ("add feature" not "added feature")
- Keep subject line under 50 characters
- Capitalize subject line
- No period at end of subject
- Separate subject from body with blank line
- Wrap body at 72 characters
- Reference issues and PRs in footer

---

## Testing

### Current State

The project currently doesn't have automated tests. We welcome contributions to add testing infrastructure!

### Recommended Testing Approach

**Unit Tests:**
```typescript
// Example with Jest + React Testing Library
import { render, screen } from '@testing-library/react';
import { Button } from './UI';

test('renders button with label', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

**Integration Tests:**
```typescript
// Test API service layer
import { findRestaurants } from './services/gemini';

test('findRestaurants returns results', async () => {
  const coords = { latitude: 37.7749, longitude: -122.4194 };
  const result = await findRestaurants(coords, 'Italian', '$$', [], []);
  expect(result.text).toBeDefined();
  expect(result.groundingChunks).toBeInstanceOf(Array);
});
```

### Manual Testing Checklist

Before submitting PR, test:

- [ ] Location permission flow
- [ ] Restaurant search with various filters
- [ ] Chat message send/receive
- [ ] Review submission and display
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Error handling (no location, API error, etc.)
- [ ] Loading states
- [ ] Navigation and links

---

## Pull Request Process

### Before Submitting

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Follow code style guidelines
   - Add comments for complex logic
   - Update documentation if needed

4. **Test thoroughly:**
   - Manual testing of changed features
   - Check console for errors
   - Test edge cases

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting PR

1. Go to GitHub and create Pull Request
2. Fill out PR template:
   - Description of changes
   - Related issues
   - Screenshots (for UI changes)
   - Testing performed

3. **PR Title Format:**
   ```
   [Type] Brief description
   
   Examples:
   [Feature] Add price range filter to search
   [Fix] Resolve chat streaming issue
   [Docs] Update API documentation
   ```

4. **PR Description Template:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Code refactoring
   
   ## Related Issues
   Closes #123
   
   ## Testing
   - Tested feature X with Y scenarios
   - Verified no regressions in Z
   
   ## Screenshots
   (If applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No console warnings/errors
   ```

### Review Process

1. Maintainer reviews code
2. Address feedback if requested
3. Push additional commits to same branch
4. Once approved, PR will be merged

---

## Issue Reporting

### Before Creating Issue

1. Search existing issues
2. Check if it's already fixed in latest version
3. Verify it's reproducible

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
(If applicable)

## Environment
- Browser: Chrome 120
- OS: macOS 14
- Device: Desktop

## Additional Context
Any other relevant information
```

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed

---

## Additional Guidelines

### Performance

- Minimize re-renders with proper dependency arrays
- Use React.memo for expensive components
- Debounce search inputs
- Lazy load images and components

### Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

### Security

- Never commit API keys
- Validate user inputs
- Sanitize data before displaying
- Use HTTPS in production
- Keep dependencies updated

---

## Getting Help

- **Documentation**: Check README.md and ARCHITECTURE.md
- **Issues**: Search or create GitHub issues
- **Discussions**: Use GitHub Discussions for questions

---

## Code of Conduct

Be respectful, inclusive, and collaborative. We're all here to learn and build something great together!

---

Thank you for contributing to GourmetGuide AI! 🍽️✨
