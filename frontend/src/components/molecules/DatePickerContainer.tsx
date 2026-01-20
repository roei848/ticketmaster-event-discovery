import React, { useRef, useState, useCallback } from 'react';
import { DatePicker } from './DatePicker';

interface DatePickerContainerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
}

export const DatePickerContainer: React.FC<DatePickerContainerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  disabled = false
}) => {
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const [startDateError, setStartDateError] = useState<string>('');
  const [endDateError, setEndDateError] = useState<string>('');

  /**
   * Validates that the start date is not after the end date
   */
  const validateDateRange = useCallback((start: string, end: string): boolean => {
    if (!start || !end) {
      return true; // Allow empty dates
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    if (startDateObj > endDateObj) {
      return false;
    }

    return true;
  }, []);

  /**
   * Validates that a date is within the allowed min/max range
   */
  const validateDateBounds = useCallback((date: string): boolean => {
    if (!date) {
      return true;
    }

    const dateObj = new Date(date);

    if (minDate) {
      const minDateObj = new Date(minDate);
      if (dateObj < minDateObj) {
        return false;
      }
    }

    if (maxDate) {
      const maxDateObj = new Date(maxDate);
      if (dateObj > maxDateObj) {
        return false;
      }
    }

    return true;
  }, [minDate, maxDate]);

  const handleStartDateChange = useCallback((date: string) => {
    setStartDateError('');
    setEndDateError('');

    if (!validateDateBounds(date)) {
      setStartDateError('Date is outside allowed range');
      return;
    }

    if (!validateDateRange(date, endDate)) {
      setStartDateError('Start date cannot be after end date');
      return;
    }

    onStartDateChange(date);
  }, [endDate, onStartDateChange, validateDateBounds, validateDateRange]);

  const handleEndDateChange = useCallback((date: string) => {
    setStartDateError('');
    setEndDateError('');

    if (!validateDateBounds(date)) {
      setEndDateError('Date is outside allowed range');
      return;
    }

    if (!validateDateRange(startDate, date)) {
      setEndDateError('End date cannot be before start date');
      return;
    }

    onEndDateChange(date);
  }, [startDate, onEndDateChange, validateDateBounds, validateDateRange]);

  const handleStartWrapperClick = useCallback(() => {
    if (!disabled) {
      startDateInputRef.current?.showPicker();
    }
  }, [disabled]);

  const handleEndWrapperClick = useCallback(() => {
    if (!disabled) {
      endDateInputRef.current?.showPicker();
    }
  }, [disabled]);

  const handleClearStartDate = useCallback(() => {
    setStartDateError('');
    onStartDateChange('');
  }, [onStartDateChange]);

  const handleClearEndDate = useCallback(() => {
    setEndDateError('');
    onEndDateChange('');
  }, [onEndDateChange]);

  return (
    <DatePicker
      startDate={startDate}
      endDate={endDate}
      startDateInputRef={startDateInputRef}
      endDateInputRef={endDateInputRef}
      startDateError={startDateError}
      endDateError={endDateError}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onStartWrapperClick={handleStartWrapperClick}
      onEndWrapperClick={handleEndWrapperClick}
      onClearStartDate={handleClearStartDate}
      onClearEndDate={handleClearEndDate}
    />
  );
};
