# Frontend Refactor: Styled-Components & Atomic Design

**Date:** 2026-01-17
**Goal:** Refactor frontend to use styled-components with atomic design pattern and light/dark theme support
**Migration Strategy:** Incremental (atoms → molecules → organisms)

---

## 1. Architecture & Migration Strategy

### Overall Approach

Refactor the frontend to use styled-components with atomic design, implementing a theme provider for light/dark mode support. The migration will be incremental, building from the bottom up.

### Migration Phases

**Phase 1: Foundation (atoms + theme)**
- Set up styled-components and theme provider
- Create theme configuration (colors, spacing, typography, breakpoints)
- Build atomic components: Button, Input, Label, Select, Checkbox, DateInput
- These atoms will have core styling built-in but accept style override props

**Phase 2: Molecules**
- CityAutocomplete (Input + Suggestions list)
- RadiusSelector (Label + Select)
- DateRangePicker (Label + DateInput × 2)
- EventTypeFilter (Label + Checkboxes)
- EventCard (Image + Text + Button)

**Phase 3: Organisms**
- Refactor SearchBar to use molecules
- Refactor EventGrid to use EventCard molecules
- Refactor EventDetailModal to use atoms/molecules

**Phase 4: Cleanup**
- Remove old CSS files
- Verify all functionality works
- Document component usage

### Directory Structure

```
frontend/src/
├── components/
│   ├── atoms/          # Button, Input, Label, Select, Checkbox, DateInput
│   ├── molecules/      # CityAutocomplete, RadiusSelector, DateRangePicker, EventTypeFilter, EventCard
│   ├── organisms/      # SearchBar, EventGrid, EventDetailModal
│   └── index.ts        # Export barrel file
├── theme/
│   ├── theme.ts        # Theme definitions (light/dark)
│   └── GlobalStyles.ts # Global styled-components
```

---

## 2. Theme System & Dark Mode

### Theme Configuration

Two theme variants (light/dark) that components can access:

```typescript
// theme/theme.ts
export const lightTheme = {
  colors: {
    primary: '#1976d2',
    primaryHover: '#1565c0',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#333333',
    textSecondary: '#555555',
    border: '#e0e0e0',
    error: '#d32f2f',
    success: '#2e7d32',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 8px 24px rgba(0,0,0,0.2)'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px'
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#42a5f5',
    primaryHover: '#1e88e5',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    border: '#333333'
  }
};
```

### Theme Provider Setup

App.tsx wraps everything in ThemeProvider with a toggle:

```typescript
const [isDark, setIsDark] = useState(false);

<ThemeProvider theme={isDark ? darkTheme : lightTheme}>
  <GlobalStyles />
  <ThemeToggle onClick={() => setIsDark(!isDark)} />
  {/* app content */}
</ThemeProvider>
```

### Accessing Theme in Components

Components access theme via props:

```typescript
const StyledButton = styled.button`
  background: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
`;
```

---

## 3. Atomic Components (Atoms)

### Core Atoms

Foundational UI elements that accept theme styles but allow overrides:

```typescript
// components/atoms/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  $customStyles?: string; // $ prefix prevents prop forwarding to DOM
}

const StyledButton = styled.button<ButtonProps>`
  background: ${props => props.variant === 'primary'
    ? props.theme.colors.primary
    : 'transparent'};
  color: ${props => props.variant === 'primary'
    ? '#fff'
    : props.theme.colors.text};
  padding: ${props => {
    const { sm, md, lg } = props.theme.spacing;
    return props.size === 'sm' ? `${sm} ${md}` : props.size === 'lg' ? `${lg} ${xl}` : `${md} ${lg}`;
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.variant === 'primary' ? 'transparent' : props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;

  &:hover {
    background: ${props => props.variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.surface};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.$customStyles}
`;
```

### Additional Atoms

- **Input** - Text inputs with focus states and error styling
- **Label** - Consistent typography for form labels
- **Select** - Dropdown selector with themed styling
- **Checkbox** - Custom checkbox matching theme
- **DateInput** - Date picker with theme integration

### Hybrid Flexibility

Each atom has sensible defaults but accepts:
- `variant` prop for predefined styles
- `size` prop for scale variations
- `$customStyles` prop for one-off customizations
- Direct style props when needed

---

## 4. Molecules - Combining Atoms

### Molecules Overview

Molecules combine atoms with specific logic and styling for reusable patterns.

### CityAutocomplete

```typescript
// components/molecules/CityAutocomplete.tsx
interface CityAutocompleteProps {
  cities: City[];
  value: string;
  selectedCity: City | null;
  onCityChange: (value: string) => void;
  onCitySelect: (city: City) => void;
}

const Container = styled.div`
  position: relative;
  flex: 2;
  min-width: 250px;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.sm};
  max-height: 240px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: ${props => props.theme.shadows.lg};
  list-style: none;
  padding: 0;
`;

const SuggestionItem = styled.li`
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing.lg}`};
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.surface};
  }
`;

const CityAutocomplete = (props) => (
  <Container>
    <Label>City</Label>
    <Input
      value={props.value}
      onChange={e => props.onCityChange(e.target.value)}
      placeholder="Enter city name..."
    />
    {filteredCities.length > 0 && (
      <SuggestionsList>
        {filteredCities.map(city => (
          <SuggestionItem key={city.name} onClick={() => props.onCitySelect(city)}>
            {city.name}, {city.country}
          </SuggestionItem>
        ))}
      </SuggestionsList>
    )}
  </Container>
);
```

### Other Key Molecules

**RadiusSelector**
- Label + Select with km options
- Controlled component pattern

**DateRangePicker**
- Two DateInputs with start/end labels
- Handles date validation

**EventTypeFilter**
- Label + multiple Checkboxes in flex layout
- Manages multi-select state

**EventCard**
- Image + title + venue + date + price
- Clickable card with hover effects
- Responsive layout

### Molecule Benefits

- Encapsulate specific UI patterns
- Handle their own internal styling/layout
- Accept business logic via props
- Reusable across organisms

---

## 5. Organisms - Composing Complex Components

### SearchBar Organism

```typescript
// components/organisms/SearchBar.tsx
const SearchBarContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: flex-end;
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SearchBar = ({ cities, onSearch }) => {
  // State management for all search parameters

  return (
    <SearchBarContainer>
      <SearchRow>
        <CityAutocomplete {...cityProps} />
        <RadiusSelector {...radiusProps} />
        <DateRangePicker {...dateProps} />
        <Button variant="primary" size="lg" onClick={handleSearch}>
          Search
        </Button>
      </SearchRow>
      <FiltersRow>
        <EventTypeFilter {...eventTypeProps} />
      </FiltersRow>
    </SearchBarContainer>
  );
};
```

### EventGrid Organism

- Grid container with styled-components responsive layout
- Maps events to EventCard molecules
- Handles loading/empty states with themed components
- Responsive breakpoints from theme

### EventDetailModal Organism

- Modal overlay and content with theme colors
- Uses atoms (Button, Label) and custom styled sections
- Maintains click-outside-to-close functionality
- Animated entrance/exit transitions

### Migration Strategy for Each Organism

1. Create new organism file with styled-components
2. Import required molecules/atoms
3. Test side-by-side with old version
4. Once verified, remove old .css file and .tsx
5. Update parent imports (App.tsx)

---

## 6. Implementation Benefits

### Advantages of This Refactor

**Component Reusability**
- Atoms can be used anywhere in the app
- Molecules encapsulate common patterns
- Consistent styling across all components

**Theme Flexibility**
- Easy to add new themes beyond light/dark
- Single source of truth for design tokens
- Runtime theme switching

**Developer Experience**
- Co-located styles with components
- TypeScript support for props
- Better IDE autocomplete

**Maintainability**
- Clear component hierarchy
- Easier to test isolated components
- CSS is scoped to components (no leakage)

**Performance**
- Automatic critical CSS extraction
- Dead code elimination
- Smaller bundle size (no unused CSS)

---

## 7. Testing Strategy

### Component Testing

- Unit test each atom in isolation
- Test molecules with mocked atoms
- Integration test organisms
- Visual regression testing for theme switching

### Migration Validation

- Keep old components running until new ones are verified
- Compare screenshots before/after
- Test all user interactions
- Verify responsive behavior at all breakpoints
- Test accessibility (keyboard navigation, screen readers)

---

## Next Steps

1. Set up isolated git worktree for refactor work
2. Create detailed implementation plan with step-by-step tasks
3. Execute incremental migration (Phase 1 → 2 → 3 → 4)
4. Review and merge back to main branch
