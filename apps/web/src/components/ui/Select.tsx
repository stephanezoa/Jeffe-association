import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FIELD_CLASS } from './FormField';
import { cn } from '../../lib/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ options, placeholder, className, ...rest }) => (
  <div className="relative">
    <select className={cn(FIELD_CLASS, 'appearance-none pr-9', className)} {...rest}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
      aria-hidden="true"
    />
  </div>
);
