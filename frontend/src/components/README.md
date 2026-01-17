# Styled Components Architecture

This directory contains the refactored frontend components using styled-components and atomic design pattern.

## Structure

```
components/
├── atoms/          # Basic building blocks
├── molecules/      # Combinations of atoms
├── organisms/      # Complex composed components
└── ThemeToggle.tsx # Theme switcher component
```

## Atomic Design Hierarchy

### Atoms (5 components)
- **Button** - Primary/secondary variants, 3 sizes
- **Input** - Text input with error states
- **Label** - Form labels with consistent typography
- **Select** - Dropdown selector
- **Checkbox** - Checkbox with optional label

### Molecules (5 components)
- **RadiusSelector** - Label + Select for radius (5-100 km)
- **DateRangePicker** - Start/end date inputs
- **EventTypeFilter** - Multi-checkbox for event types
- **CityAutocomplete** - Input with dropdown suggestions
- **EventCard** - Event display card with image

### Organisms (3 components)
- **SearchBarStyled** - Complete search interface
- **EventGridStyled** - Responsive event grid layout
- **EventDetailModalStyled** - Event detail modal overlay

## Theme System

Components use the theme system defined in `/theme/`:
- **Colors**: primary, background, surface, text, borders, etc.
- **Spacing**: xs, sm, md, lg, xl
- **Typography**: fontSize, fontWeight, lineHeight
- **Z-index**: base, dropdown, modal, tooltip
- **Shadows & Transitions**: Consistent visual effects

### Light/Dark Mode

Toggle themes using the **ThemeToggle** component in the top-right corner.

## Usage Example

```typescript
import { Button } from './components/atoms/Button';
import { Input } from './components/atoms/Input';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Input
  placeholder="Enter text..."
  hasError={!!error}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## Benefits

- ✅ Co-located styles with components
- ✅ Type-safe props with TypeScript
- ✅ Automatic critical CSS extraction
- ✅ No CSS class name conflicts
- ✅ Theme-aware styling
- ✅ Runtime theme switching
- ✅ Better developer experience
