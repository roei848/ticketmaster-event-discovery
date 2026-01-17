import React from 'react';
import styled from 'styled-components';
import { Calendar } from 'lucide-react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';

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

const DateField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  min-width: 150px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledDateInput = styled(Input)`
  padding-left: calc(${props => props.theme.spacing.md} * 2 + 20px);

  /* Hide native calendar icon */
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
    position: absolute;
    right: ${props => props.theme.spacing.md};
    width: 20px;
    height: 20px;
  }
`;

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <Container>
      <DateField>
        <Label>Start Date</Label>
        <InputWrapper>
          <IconWrapper>
            <Calendar size={20} />
          </IconWrapper>
          <StyledDateInput
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </InputWrapper>
      </DateField>
      <DateField>
        <Label>End Date</Label>
        <InputWrapper>
          <IconWrapper>
            <Calendar size={20} />
          </IconWrapper>
          <StyledDateInput
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </InputWrapper>
      </DateField>
    </Container>
  );
};
