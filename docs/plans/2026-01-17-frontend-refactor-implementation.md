# Frontend Refactor: Styled-Components Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Incrementally migrate frontend from CSS files to styled-components with atomic design pattern and light/dark theme support.

**Architecture:** Build from bottom-up: atoms (Button, Input, etc.) → molecules (CityAutocomplete, EventCard, etc.) → organisms (SearchBar, EventGrid, EventDetailModal). Keep old components working until new ones are verified.

**Tech Stack:** styled-components, TypeScript, React 19, atomic design pattern

---

## Task 1: Install Dependencies and Setup Theme Foundation

**Files:**
- Create: `frontend/theme/theme.ts`
- Create: `frontend/theme/GlobalStyles.ts`
- Create: `frontend/theme/styled.d.ts`
- Modify: `frontend/package.json`

**Step 1: Install styled-components**

```bash
cd frontend
npm install styled-components
npm install -D @types/styled-components
```

Expected: Dependencies installed successfully

**Step 2: Create theme configuration**

Create: `frontend/src/theme/theme.ts`

```typescript
export const lightTheme = {
  colors: {
    primary: '#1976d2',
    primaryHover: '#1565c0',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#333333',
    textSecondary: '#555555',
    border: '#e0e0e0',
    borderHover: '#1976d2',
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
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease'
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
    border: '#333333',
    borderHover: '#42a5f5'
  }
};

export type Theme = typeof lightTheme;
```

**Step 3: Create TypeScript theme types**

Create: `frontend/src/theme/styled.d.ts`

```typescript
import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

**Step 4: Create global styles**

Create: `frontend/src/theme/GlobalStyles.ts`

```typescript
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transition: background ${props => props.theme.transitions.normal},
                color ${props => props.theme.transitions.normal};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;
```

**Step 5: Verify build works**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 6: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/theme/
git commit -m "feat: add styled-components and theme foundation"
```

---

## Task 2: Create Button Atom

**Files:**
- Create: `frontend/src/components/atoms/Button.tsx`
- Create: `frontend/src/components/atoms/index.ts`

**Step 1: Create Button component**

Create: `frontend/src/components/atoms/Button.tsx`

```typescript
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  $customStyles?: string;
}

const StyledButton = styled.button<ButtonProps>`
  background: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.primary
      : 'transparent'};
  color: ${props =>
    props.variant === 'primary' ? '#fff' : props.theme.colors.text};
  padding: ${props => {
    const size = props.size || 'md';
    if (size === 'sm') return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
    if (size === 'lg') return `${props.theme.spacing.md} ${props.theme.spacing.xl}`;
    return `${props.theme.spacing.md} ${props.theme.spacing.lg}`;
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props =>
    props.variant === 'primary'
      ? 'transparent'
      : props.theme.colors.border};
  cursor: pointer;
  font-weight: 600;
  font-size: ${props => (props.size === 'lg' ? '16px' : '14px')};
  white-space: nowrap;
  transition: all ${props => props.theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryHover};
    color: #fff;
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.$customStyles}
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
```

**Step 2: Create atoms barrel export**

Create: `frontend/src/components/atoms/index.ts`

```typescript
export { default as Button } from './Button';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/atoms/
git commit -m "feat: add Button atom component"
```

---

## Task 3: Create Input Atom

**Files:**
- Create: `frontend/src/components/atoms/Input.tsx`
- Modify: `frontend/src/components/atoms/index.ts`

**Step 1: Create Input component**

Create: `frontend/src/components/atoms/Input.tsx`

```typescript
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  $customStyles?: string;
}

const StyledInput = styled.input<InputProps>`
  width: 100%;
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing.lg}`};
  font-size: 16px;
  border: 2px solid ${props =>
    props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.borderHover};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}1a;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.theme.colors.surface};
  }

  ${props => props.$customStyles}
`;

const Input: React.FC<InputProps> = (props) => {
  return <StyledInput {...props} />;
};

export default Input;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/atoms/index.ts`

```typescript
export { default as Button } from './Button';
export { default as Input } from './Input';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/atoms/
git commit -m "feat: add Input atom component"
```

---

## Task 4: Create Label Atom

**Files:**
- Create: `frontend/src/components/atoms/Label.tsx`
- Modify: `frontend/src/components/atoms/index.ts`

**Step 1: Create Label component**

Create: `frontend/src/components/atoms/Label.tsx`

```typescript
import styled from 'styled-components';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  $customStyles?: string;
}

const StyledLabel = styled.label<LabelProps>`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};

  ${props => props.$customStyles}
`;

const Label: React.FC<LabelProps> = ({ children, ...props }) => {
  return <StyledLabel {...props}>{children}</StyledLabel>;
};

export default Label;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/atoms/index.ts`

```typescript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Label } from './Label';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/atoms/
git commit -m "feat: add Label atom component"
```

---

## Task 5: Create Select Atom

**Files:**
- Create: `frontend/src/components/atoms/Select.tsx`
- Modify: `frontend/src/components/atoms/index.ts`

**Step 1: Create Select component**

Create: `frontend/src/components/atoms/Select.tsx`

```typescript
import styled from 'styled-components';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  $customStyles?: string;
}

const StyledSelect = styled.select<SelectProps>`
  width: 100%;
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing.lg}`};
  font-size: 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.borderHover};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.theme.colors.surface};
  }

  ${props => props.$customStyles}
`;

const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return <StyledSelect {...props}>{children}</StyledSelect>;
};

export default Select;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/atoms/index.ts`

```typescript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Label } from './Label';
export { default as Select } from './Select';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/atoms/
git commit -m "feat: add Select atom component"
```

---

## Task 6: Create Checkbox Atom

**Files:**
- Create: `frontend/src/components/atoms/Checkbox.tsx`
- Modify: `frontend/src/components/atoms/index.ts`

**Step 1: Create Checkbox component**

Create: `frontend/src/components/atoms/Checkbox.tsx`

```typescript
import styled from 'styled-components';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  $customStyles?: string;
}

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  user-select: none;
`;

const StyledCheckbox = styled.input<{ $customStyles?: string }>`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};

  ${props => props.$customStyles}
`;

const CheckboxLabel = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Checkbox: React.FC<CheckboxProps> = ({ label, $customStyles, ...props }) => {
  return (
    <CheckboxWrapper>
      <StyledCheckbox type="checkbox" $customStyles={$customStyles} {...props} />
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </CheckboxWrapper>
  );
};

export default Checkbox;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/atoms/index.ts`

```typescript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Label } from './Label';
export { default as Select } from './Select';
export { default as Checkbox } from './Checkbox';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/atoms/
git commit -m "feat: add Checkbox atom component"
```

---

## Task 7: Create RadiusSelector Molecule

**Files:**
- Create: `frontend/src/components/molecules/RadiusSelector.tsx`
- Create: `frontend/src/components/molecules/index.ts`

**Step 1: Create RadiusSelector molecule**

Create: `frontend/src/components/molecules/RadiusSelector.tsx`

```typescript
import styled from 'styled-components';
import { Label, Select } from '../atoms';

interface RadiusSelectorProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
  min-width: 150px;
`;

const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  value,
  onChange,
  options = [10, 25, 50, 100, 200]
}) => {
  return (
    <Container>
      <Label>Radius:</Label>
      <Select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map(option => (
          <option key={option} value={option}>
            {option} km
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default RadiusSelector;
```

**Step 2: Create molecules barrel export**

Create: `frontend/src/components/molecules/index.ts`

```typescript
export { default as RadiusSelector } from './RadiusSelector';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/molecules/
git commit -m "feat: add RadiusSelector molecule"
```

---

## Task 8: Create DateRangePicker Molecule

**Files:**
- Create: `frontend/src/components/molecules/DateRangePicker.tsx`
- Modify: `frontend/src/components/molecules/index.ts`

**Step 1: Create DateRangePicker molecule**

Create: `frontend/src/components/molecules/DateRangePicker.tsx`

```typescript
import styled from 'styled-components';
import { Label, Input } from '../atoms';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const Container = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
  min-width: 160px;
`;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <Container>
      <DateContainer>
        <Label>Start Date:</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </DateContainer>
      <DateContainer>
        <Label>End Date:</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </DateContainer>
    </Container>
  );
};

export default DateRangePicker;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/molecules/index.ts`

```typescript
export { default as RadiusSelector } from './RadiusSelector';
export { default as DateRangePicker } from './DateRangePicker';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/molecules/
git commit -m "feat: add DateRangePicker molecule"
```

---

## Task 9: Create EventTypeFilter Molecule

**Files:**
- Create: `frontend/src/components/molecules/EventTypeFilter.tsx`
- Modify: `frontend/src/components/molecules/index.ts`

**Step 1: Create EventTypeFilter molecule**

Create: `frontend/src/components/molecules/EventTypeFilter.tsx`

```typescript
import styled from 'styled-components';
import { Label, Checkbox } from '../atoms';

interface EventTypeFilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  availableTypes?: string[];
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterLabel = styled(Label)`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  margin-bottom: 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const EventTypeFilter: React.FC<EventTypeFilterProps> = ({
  selectedTypes,
  onTypeToggle,
  availableTypes = ['Music', 'Sports', 'Arts & Theatre', 'Family']
}) => {
  return (
    <Container>
      <FilterLabel>Event Types:</FilterLabel>
      <CheckboxGroup>
        {availableTypes.map(type => (
          <Checkbox
            key={type}
            label={type}
            checked={selectedTypes.includes(type)}
            onChange={() => onTypeToggle(type)}
          />
        ))}
      </CheckboxGroup>
    </Container>
  );
};

export default EventTypeFilter;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/molecules/index.ts`

```typescript
export { default as RadiusSelector } from './RadiusSelector';
export { default as DateRangePicker } from './DateRangePicker';
export { default as EventTypeFilter } from './EventTypeFilter';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/molecules/
git commit -m "feat: add EventTypeFilter molecule"
```

---

## Task 10: Create CityAutocomplete Molecule

**Files:**
- Create: `frontend/src/components/molecules/CityAutocomplete.tsx`
- Modify: `frontend/src/components/molecules/index.ts`

**Step 1: Create CityAutocomplete molecule**

Create: `frontend/src/components/molecules/CityAutocomplete.tsx`

```typescript
import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Label, Input } from '../atoms';
import type { City } from '../../types';

interface CityAutocompleteProps {
  cities: City[];
  value: string;
  selectedCity: City | null;
  onValueChange: (value: string) => void;
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
  transition: background ${props => props.theme.transitions.fast};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  cities,
  value,
  selectedCity,
  onValueChange,
  onCitySelect
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = useMemo(() => {
    if (!value) return [];

    return cities
      .filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5);
  }, [value, cities]);

  const handleInputChange = (newValue: string) => {
    onValueChange(newValue);
    setShowSuggestions(true);
  };

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setShowSuggestions(false);
  };

  return (
    <Container>
      <Label>City</Label>
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter city name..."
      />
      {showSuggestions && filteredCities.length > 0 && (
        <SuggestionsList>
          {filteredCities.map((city, index) => (
            <SuggestionItem
              key={index}
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.country}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </Container>
  );
};

export default CityAutocomplete;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/molecules/index.ts`

```typescript
export { default as RadiusSelector } from './RadiusSelector';
export { default as DateRangePicker } from './DateRangePicker';
export { default as EventTypeFilter } from './EventTypeFilter';
export { default as CityAutocomplete } from './CityAutocomplete';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/molecules/
git commit -m "feat: add CityAutocomplete molecule"
```

---

## Task 11: Create EventCard Molecule

**Files:**
- Create: `frontend/src/components/molecules/EventCard.tsx`
- Modify: `frontend/src/components/molecules/index.ts`

**Step 1: Create EventCard molecule**

Create: `frontend/src/components/molecules/EventCard.tsx`

```typescript
import styled from 'styled-components';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: ${props => props.theme.colors.border};
`;

const CardContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const EventName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EventInfo = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EventDate = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-top: ${props => props.theme.spacing.sm};
`;

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card onClick={() => onClick(event)}>
      <EventImage src={event.imageUrl} alt={event.name} />
      <CardContent>
        <EventName>{event.name}</EventName>
        <EventInfo>{event.venueName}</EventInfo>
        <EventInfo>
          {event.city}, {event.country}
        </EventInfo>
        <EventDate>{formatDate(event.date)}</EventDate>
      </CardContent>
    </Card>
  );
};

export default EventCard;
```

**Step 2: Update barrel export**

Modify: `frontend/src/components/molecules/index.ts`

```typescript
export { default as RadiusSelector } from './RadiusSelector';
export { default as DateRangePicker } from './DateRangePicker';
export { default as EventTypeFilter } from './EventTypeFilter';
export { default as CityAutocomplete } from './CityAutocomplete';
export { default as EventCard } from './EventCard';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/components/molecules/
git commit -m "feat: add EventCard molecule"
```

---

## Task 12: Create New SearchBar Organism with Styled-Components

**Files:**
- Create: `frontend/src/components/organisms/SearchBarStyled.tsx`

**Step 1: Create SearchBarStyled organism**

Create: `frontend/src/components/organisms/SearchBarStyled.tsx`

```typescript
import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../atoms';
import {
  CityAutocomplete,
  RadiusSelector,
  DateRangePicker,
  EventTypeFilter
} from '../molecules';
import type { City } from '../../types';

interface SearchBarStyledProps {
  cities: City[];
  onSearch: (
    city: City,
    radius: number,
    eventTypes: string[],
    startDate?: string,
    endDate?: string
  ) => void;
}

const Container = styled.div`
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

const SearchBarStyled: React.FC<SearchBarStyledProps> = ({ cities, onSearch }) => {
  const [cityInput, setCityInput] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [radius, setRadius] = useState(25);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityInput(`${city.name}, ${city.country}`);
  };

  const handleEventTypeToggle = (eventType: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(eventType)
        ? prev.filter(t => t !== eventType)
        : [...prev, eventType]
    );
  };

  const handleSearch = () => {
    if (!selectedCity) {
      alert('Please select a city');
      return;
    }

    onSearch(selectedCity, radius, selectedEventTypes, startDate, endDate);
  };

  return (
    <Container>
      <SearchRow>
        <CityAutocomplete
          cities={cities}
          value={cityInput}
          selectedCity={selectedCity}
          onValueChange={setCityInput}
          onCitySelect={handleCitySelect}
        />
        <RadiusSelector value={radius} onChange={setRadius} />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <Button variant="primary" size="lg" onClick={handleSearch}>
          Search
        </Button>
      </SearchRow>
      <FiltersRow>
        <EventTypeFilter
          selectedTypes={selectedEventTypes}
          onTypeToggle={handleEventTypeToggle}
        />
      </FiltersRow>
    </Container>
  );
};

export default SearchBarStyled;
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/components/organisms/
git commit -m "feat: add SearchBarStyled organism"
```

---

## Task 13: Create New EventGrid Organism with Styled-Components

**Files:**
- Create: `frontend/src/components/organisms/EventGridStyled.tsx`

**Step 1: Create EventGridStyled organism**

Create: `frontend/src/components/organisms/EventGridStyled.tsx`

```typescript
import styled from 'styled-components';
import { EventCard } from '../molecules';
import type { Event } from '../../types';

interface EventGridStyledProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const NoEvents = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
`;

const EventGridStyled: React.FC<EventGridStyledProps> = ({ events, onEventClick }) => {
  if (events.length === 0) {
    return (
      <Container>
        <NoEvents>No events found. Try adjusting your search criteria.</NoEvents>
      </Container>
    );
  }

  return (
    <Container>
      <Grid>
        {events.map(event => (
          <EventCard key={event.id} event={event} onClick={onEventClick} />
        ))}
      </Grid>
    </Container>
  );
};

export default EventGridStyled;
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/components/organisms/
git commit -m "feat: add EventGridStyled organism"
```

---

## Task 14: Create New EventDetailModal Organism with Styled-Components

**Files:**
- Create: `frontend/src/components/organisms/EventDetailModalStyled.tsx`

**Step 1: Create EventDetailModalStyled organism**

Create: `frontend/src/components/organisms/EventDetailModalStyled.tsx`

```typescript
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Label } from '../atoms';
import { getEventDetail } from '../../services/api';
import type { Event, EventDetail } from '../../types';

interface EventDetailModalStyledProps {
  event: Event;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const ModalHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled(Button)`
  min-width: auto;
`;

const ModalContent = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const EventImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const InfoSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const InfoLabel = styled(Label)`
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const InfoValue = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.sm};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.error};
`;

const ButtonContainer = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const EventDetailModalStyled: React.FC<EventDetailModalStyledProps> = ({ event, onClose }) => {
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const detail = await getEventDetail(event.id);
        setEventDetail(detail);
      } catch (err) {
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [event.id]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>{event.name}</Title>
          <CloseButton variant="secondary" onClick={onClose}>
            Close
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {loading && <LoadingMessage>Loading event details...</LoadingMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {eventDetail && (
            <>
              {eventDetail.imageUrl && (
                <EventImage src={eventDetail.imageUrl} alt={eventDetail.name} />
              )}

              <InfoSection>
                <InfoLabel>Venue</InfoLabel>
                <InfoValue>{eventDetail.venueName}</InfoValue>
                {eventDetail.venueAddress && (
                  <InfoValue>{eventDetail.venueAddress}</InfoValue>
                )}
              </InfoSection>

              <InfoSection>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>
                  {eventDetail.city}, {eventDetail.country}
                </InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>Date & Time</InfoLabel>
                <InfoValue>
                  {new Date(eventDetail.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </InfoValue>
              </InfoSection>

              {eventDetail.category && (
                <InfoSection>
                  <InfoLabel>Category</InfoLabel>
                  <InfoValue>{eventDetail.category}</InfoValue>
                </InfoSection>
              )}

              {eventDetail.priceRange && (
                <InfoSection>
                  <InfoLabel>Price Range</InfoLabel>
                  <InfoValue>
                    {eventDetail.priceRange.currency} ${eventDetail.priceRange.min} - $
                    {eventDetail.priceRange.max}
                  </InfoValue>
                </InfoSection>
              )}

              {eventDetail.description && (
                <InfoSection>
                  <InfoLabel>Description</InfoLabel>
                  <Description>{eventDetail.description}</Description>
                </InfoSection>
              )}

              <ButtonContainer>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => window.open(eventDetail.ticketmasterUrl, '_blank')}
                >
                  Buy Tickets
                </Button>
              </ButtonContainer>
            </>
          )}
        </ModalContent>
      </Modal>
    </Overlay>
  );
};

export default EventDetailModalStyled;
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/components/organisms/
git commit -m "feat: add EventDetailModalStyled organism"
```

---

## Task 15: Create ThemeToggle Component

**Files:**
- Create: `frontend/src/components/ThemeToggle.tsx`

**Step 1: Create ThemeToggle component**

Create: `frontend/src/components/ThemeToggle.tsx`

```typescript
import styled from 'styled-components';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ToggleButton = styled.button`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all ${props => props.theme.transitions.normal};
  z-index: 100;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <ToggleButton onClick={onToggle}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </ToggleButton>
  );
};

export default ThemeToggle;
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/components/ThemeToggle.tsx
git commit -m "feat: add ThemeToggle component"
```

---

## Task 16: Integrate Styled Components into App.tsx

**Files:**
- Modify: `frontend/src/App.tsx`

**Step 1: Update App.tsx with ThemeProvider and new components**

Modify: `frontend/src/App.tsx`

```typescript
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { lightTheme, darkTheme } from './theme/theme';
import { GlobalStyles } from './theme/GlobalStyles';
import ThemeToggle from './components/ThemeToggle';
import SearchBarStyled from './components/organisms/SearchBarStyled';
import EventGridStyled from './components/organisms/EventGridStyled';
import EventDetailModalStyled from './components/organisms/EventDetailModalStyled';
import { cities } from './data/cities';
import { searchEvents } from './services/api';
import type { Event, City } from './types';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  background: ${props => props.theme.colors.primary};
  color: #fff;
  padding: ${props => `${props.theme.spacing.xl} ${props.theme.spacing.lg}`};
  text-align: center;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
`;

const Subtitle = styled.p`
  margin: ${props => `${props.theme.spacing.sm} 0 0 0`};
  font-size: 16px;
  opacity: 0.9;
`;

const Main = styled.main`
  padding: ${props => props.theme.spacing.xl};
`;

const StatusMessage = styled.div<{ $isError?: boolean }>`
  max-width: 1200px;
  margin: 0 auto ${props => props.theme.spacing.lg} auto;
  padding: ${props => props.theme.spacing.lg};
  background: ${props =>
    props.$isError ? props.theme.colors.error : props.theme.colors.surface};
  color: ${props => (props.$isError ? '#fff' : props.theme.colors.text)};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  box-shadow: ${props => props.theme.shadows.sm};
`;

function App() {
  const [isDark, setIsDark] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (
    city: City,
    radius: number,
    eventTypes: string[],
    startDate?: string,
    endDate?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const results = await searchEvents({
        city: city.name,
        radius,
        latitude: city.lat,
        longitude: city.lon,
        eventTypes,
        startDate,
        endDate
      });

      setEvents(results);
    } catch (err) {
      setError('Failed to search events. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyles />
      <AppContainer>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

        <Header>
          <Title>Ticketmaster Event Discovery</Title>
          <Subtitle>Find events near you worldwide</Subtitle>
        </Header>

        <Main>
          <SearchBarStyled cities={cities} onSearch={handleSearch} />

          {loading && <StatusMessage>Searching for events...</StatusMessage>}

          {error && <StatusMessage $isError>{error}</StatusMessage>}

          {!loading && hasSearched && (
            <EventGridStyled events={events} onEventClick={setSelectedEvent} />
          )}
        </Main>

        {selectedEvent && (
          <EventDetailModalStyled
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Test in browser**

Run: `npm run dev`
Open: http://localhost:5173
Expected: App loads, theme toggle works, search functionality works

**Step 4: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: integrate styled-components into App with theme provider"
```

---

## Task 17: Remove Old CSS Files

**Files:**
- Delete: `frontend/src/App.css`
- Delete: `frontend/src/index.css`
- Delete: `frontend/src/components/SearchBar.css`
- Delete: `frontend/src/components/EventGrid.css`
- Delete: `frontend/src/components/EventDetailModal.css`
- Delete: `frontend/src/components/SearchBar.tsx` (old version)
- Delete: `frontend/src/components/EventGrid.tsx` (old version)
- Delete: `frontend/src/components/EventDetailModal.tsx` (old version)

**Step 1: Remove old CSS files**

```bash
rm frontend/src/App.css
rm frontend/src/index.css
rm frontend/src/components/SearchBar.css
rm frontend/src/components/EventGrid.css
rm frontend/src/components/EventDetailModal.css
```

**Step 2: Remove old component files**

```bash
rm frontend/src/components/SearchBar.tsx
rm frontend/src/components/EventGrid.tsx
rm frontend/src/components/EventDetailModal.tsx
```

**Step 3: Update main.tsx to remove index.css import**

Modify: `frontend/src/main.tsx`

Remove the line: `import './index.css'`

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Test app thoroughly**

Run: `npm run dev`
Test:
- Search functionality
- Theme toggle
- Event cards
- Event detail modal
- Responsive design

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove old CSS files and components, complete migration to styled-components"
```

---

## Task 18: Create Component Documentation

**Files:**
- Create: `frontend/src/components/README.md`

**Step 1: Document component structure**

Create: `frontend/src/components/README.md`

```markdown
# Component Architecture

This project uses **Atomic Design** pattern with styled-components.

## Structure

### Atoms (Basic Building Blocks)
- `Button` - Reusable button with variants (primary/secondary) and sizes
- `Input` - Text input with focus states and error handling
- `Label` - Consistent form labels
- `Select` - Dropdown selector
- `Checkbox` - Custom checkbox with optional label

### Molecules (Simple Combinations)
- `CityAutocomplete` - City search with dropdown suggestions
- `RadiusSelector` - Radius selection dropdown
- `DateRangePicker` - Start/end date inputs
- `EventTypeFilter` - Multiple event type checkboxes
- `EventCard` - Event display card with image and info

### Organisms (Complex Components)
- `SearchBarStyled` - Complete search interface
- `EventGridStyled` - Grid of event cards
- `EventDetailModalStyled` - Modal with full event details

## Theme

All components use the theme from `src/theme/theme.ts`:
- Light and dark mode support
- Consistent colors, spacing, shadows
- Responsive breakpoints

## Usage Example

```typescript
import { Button } from './components/atoms';
import { EventCard } from './components/molecules';

<Button variant="primary" size="lg" onClick={handleClick}>
  Search
</Button>

<EventCard event={eventData} onClick={handleEventClick} />
```

## Customization

Components accept `$customStyles` prop for one-off styling:

```typescript
<Button $customStyles="width: 100%; margin-top: 20px;">
  Full Width Button
</Button>
```
```

**Step 2: Commit**

```bash
git add frontend/src/components/README.md
git commit -m "docs: add component architecture documentation"
```

---

## Execution Complete

All tasks finished! The frontend has been successfully refactored to:
- ✅ Use styled-components instead of CSS files
- ✅ Implement atomic design pattern (atoms → molecules → organisms)
- ✅ Support light/dark theme with ThemeProvider
- ✅ Maintain all existing functionality
- ✅ Improve component reusability and maintainability
