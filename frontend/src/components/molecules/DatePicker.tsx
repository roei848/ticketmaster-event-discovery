import React from 'react';
import styled from 'styled-components';
import { Calendar, X } from 'lucide-react';

export interface DatePickerProps {
  startDate: string;
  endDate: string;
  startDateInputRef: React.RefObject<HTMLInputElement | null>;
  endDateInputRef: React.RefObject<HTMLInputElement | null>;
  startDateError: string;
  endDateError: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStartWrapperClick: () => void;
  onEndWrapperClick: () => void;
  onClearStartDate: () => void;
  onClearEndDate: () => void;
}

const Container = styled.div`
  width: 100%;
`;

const FieldGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const DateField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  min-width: 180px;
  flex: 1;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    min-width: unset;
  }
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  transition: color ${props => props.theme.transitions.normal};
  user-select: none;
`;

interface InputWrapperProps {
  $hasError: boolean;
  $disabled: boolean;
}

const InputWrapper = styled.div<InputWrapperProps>`
  position: relative;
  display: flex;
  align-items: center;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  overflow: hidden;
  opacity: ${props => props.$disabled ? 0.6 : 1};

  &:hover:not([data-disabled="true"]) {
    border-color: ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.borderHover};
    box-shadow: ${props => props.theme.shadows.sm};
  }

  &:has(input:focus-visible) {
    border-color: ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => {
      const color = props.$hasError ? props.theme.colors.error : props.theme.colors.primary;
      return `${color}20`;
    }};
  }

  ${props => props.$disabled && `
    background: ${props.theme.colors.surface};
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
  transition: color ${props => props.theme.transitions.normal};

  ${InputWrapper}:hover:not([data-disabled="true"]) & {
    color: ${props => props.theme.colors.primary};
  }

  ${InputWrapper}:has(input:focus-visible) & {
    color: ${props => props.theme.colors.primary};
  }
`;

const StyledDateInput = styled.input`
  width: 100%;
  padding: ${props => `${props.theme.spacing.sm} 40px ${props.theme.spacing.sm} 44px`};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-family: inherit;
  color: ${props => props.theme.colors.text};
  background: transparent;
  border: none;
  outline: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${props => props.theme.transitions.normal};

  /* Hide the native calendar icon */
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
    position: absolute;
    right: ${props => props.theme.spacing.md};
    width: 24px;
    height: 24px;
    z-index: 2;
  }

  &::-webkit-date-and-time-value {
    text-align: left;
  }

  /* Firefox date input styling */
  &::-moz-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.fast};
  z-index: 3;

  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 28px;
  min-width: 24px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const SeparatorLine = styled.div`
  width: 16px;
  height: 2px;
  background: ${props => props.theme.colors.border};
  border-radius: 2px;
`;

const ErrorMessage = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.error};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  padding-left: 4px;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DatePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  startDateInputRef,
  endDateInputRef,
  startDateError,
  endDateError,
  minDate,
  maxDate,
  disabled = false,
  onStartDateChange,
  onEndDateChange,
  onStartWrapperClick,
  onEndWrapperClick,
  onClearStartDate,
  onClearEndDate
}) => {
  return (
    <Container>
      <FieldGroup>
        <DateField>
          <Label htmlFor="start-date">Start Date</Label>
          <InputWrapper
            $hasError={!!startDateError}
            $disabled={disabled}
            data-disabled={disabled}
            onClick={onStartWrapperClick}
          >
            <IconWrapper>
              <Calendar size={20} />
            </IconWrapper>
            <StyledDateInput
              id="start-date"
              ref={startDateInputRef}
              type="date"
              value={startDate}
              min={minDate}
              max={maxDate || endDate || undefined}
              disabled={disabled}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
            {startDate && !disabled && (
              <ClearButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearStartDate();
                }}
                aria-label="Clear start date"
              >
                <X size={16} />
              </ClearButton>
            )}
          </InputWrapper>
          {startDateError && <ErrorMessage>{startDateError}</ErrorMessage>}
        </DateField>

        <Separator>
          <SeparatorLine />
        </Separator>

        <DateField>
          <Label htmlFor="end-date">End Date</Label>
          <InputWrapper
            $hasError={!!endDateError}
            $disabled={disabled}
            data-disabled={disabled}
            onClick={onEndWrapperClick}
          >
            <IconWrapper>
              <Calendar size={20} />
            </IconWrapper>
            <StyledDateInput
              id="end-date"
              ref={endDateInputRef}
              type="date"
              value={endDate}
              min={minDate || startDate || undefined}
              max={maxDate}
              disabled={disabled}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
            {endDate && !disabled && (
              <ClearButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearEndDate();
                }}
                aria-label="Clear end date"
              >
                <X size={16} />
              </ClearButton>
            )}
          </InputWrapper>
          {endDateError && <ErrorMessage>{endDateError}</ErrorMessage>}
        </DateField>
      </FieldGroup>
    </Container>
  );
};
