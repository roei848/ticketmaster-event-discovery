# UI Improvements Design Document

**Date:** 2026-01-17

## Overview

Enhance the Ticketmaster Event Discovery app UI with improved theme toggle, better dark mode support for date pickers, and overall visual polish.

## Design Goals

1. Make dark mode toggle more integrated (not fixed/sticky)
2. Improve date picker icons for dark mode compatibility
3. Enhance overall UI polish and user experience

## Component Changes

### 1. Header & Theme Toggle

**Header Layout:**
- Flexbox layout with space-between alignment
- Title and subtitle on the left
- Theme toggle in top-right corner (integrated, not fixed)

**iOS-Style Theme Toggle:**
- Pill-shaped switch: ~60-70px width, ~32px height
- Border-radius: 16px for pill shape
- Sun icon (left) and Moon icon (right) - 16px size
- Sliding circular indicator that moves between icons
- Smooth transition animation (0.3s)
- Theme-aware colors:
  - Dark mode: blue/purple background, indicator on right
  - Light mode: gray background, indicator on left
- Icons change color based on active theme

### 2. Date Picker Enhancements

**Custom Icon Integration:**
- Add Calendar icon from lucide-react (left-aligned, 20px)
- Icon color uses `theme.colors.textSecondary` (adapts to theme)
- Hide native browser calendar icon via CSS
- Custom focus states with theme-aware border colors
- Consistent padding to accommodate icon (matching city input)

**Visual Consistency:**
- All inputs now have left-aligned icons:
  - City: MapPin icon
  - Dates: Calendar icon

### 3. Additional UI Improvements

**Event Cards:**
- Hover effect: translateY(-4px) with increased shadow
- Smooth transition (0.2s)

**Loading State:**
- Animated spinner component (replacing text)
- Theme-colored spinner
- Fade-in animation for results

**Search Button:**
- Add Search icon from lucide-react
- Slightly larger size for better clickability
- Enhanced hover state with color intensity change

**Typography & Spacing:**
- Increased header padding
- Refined search form spacing
- Consistent use of theme typography scale

**Error Messages:**
- Theme-aware error box with icon
- Soft red background (adapts to light/dark)
- Non-jarring visibility

## Implementation Files

### New Components
- `components/molecules/ThemeToggleSwitch.tsx` - iOS-style toggle

### Modified Components
- `components/ThemeToggle.tsx` - Remove fixed positioning
- `components/molecules/DateRangePicker.tsx` - Add calendar icons
- `components/organisms/EventGridStyled.tsx` - Enhanced hover effects
- `components/molecules/EventCard.tsx` - Card hover animations
- `components/organisms/SearchBarStyled.tsx` - Search button icon
- `App.tsx` - Header layout restructure

### New Atoms/Components
- `components/atoms/Spinner.tsx` - Loading spinner
- `components/atoms/ErrorBox.tsx` - Styled error display

## Technical Details

**Theme Toggle Switch Structure:**
```tsx
<ToggleContainer>
  <ToggleTrack onClick={onToggle} $isDark={isDark}>
    <Sun size={16} />
    <Moon size={16} />
    <ToggleIndicator $isDark={isDark} />
  </ToggleTrack>
</ToggleContainer>
```

**Date Picker Icon Pattern:**
```tsx
<InputWrapper>
  <IconWrapper>
    <Calendar size={20} />
  </IconWrapper>
  <StyledInput type="date" ... />
</InputWrapper>
```

## Visual Hierarchy

1. Header with integrated controls (top)
2. Search form with consistent icon patterns
3. Results grid with enhanced interactivity
4. Smooth state transitions throughout

## Success Criteria

- Theme toggle feels natural in header layout
- Date picker icons adapt properly to dark mode
- All interactive elements have clear hover states
- Loading and error states are polished
- Consistent icon usage across form inputs
