import * as React from 'react';
import { SearchableSelect, SelectOption } from '@/components/ui/SearchableSelect';

export interface SelectProps {
  options: Array<{ value: string; label: string; description?: string; icon?: React.ReactNode }>;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | string) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  searchThreshold?: number;
}

export const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  value = '',
  onChange,
  className,
  disabled,
  searchThreshold = 5,
  id,
}) => {
  const formattedOptions: SelectOption[] = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
    description: opt.description,
    icon: opt.icon,
  }));

  const handleChange = (selectedVal: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: selectedVal },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <SearchableSelect
      id={id}
      options={formattedOptions}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      searchThreshold={searchThreshold}
    />
  );
};

export default Select;
