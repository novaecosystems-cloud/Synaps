"use client"

import * as React from "react"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'checked'> {
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean) => void;
  variant?: 'default' | 'primary' | 'indigo' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, variant = 'default', size = 'md', disabled, ...props }, ref) => {
    const isIndeterminate = checked === 'indeterminate';
    const isChecked = checked === true;

    const sizeClasses = {
      sm: 'h-4 w-4 rounded',
      md: 'h-5 w-5 rounded-md',
      lg: 'h-6 w-6 rounded-lg',
    }[size];

    const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    }[size];

    const variantClasses = {
      default: 'border-zinc-700 bg-zinc-900 data-[state=checked]:bg-white data-[state=checked]:text-black',
      primary: 'border-cyan-500/40 bg-zinc-950 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-black',
      indigo: 'border-indigo-500/40 bg-zinc-950 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white',
      emerald: 'border-emerald-500/40 bg-zinc-950 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-black',
    }[variant];

    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          ref={ref}
          disabled={disabled}
          checked={isChecked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div
          data-state={isIndeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'}
          onClick={() => {
            if (!disabled && onCheckedChange) {
              onCheckedChange(!isChecked);
            }
          }}
          className={cn(
            'peer border transition-all duration-200 cursor-pointer flex items-center justify-center select-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500',
            'disabled:cursor-not-allowed disabled:opacity-50 hover:border-indigo-400',
            sizeClasses,
            variantClasses,
            className
          )}
        >
          {isChecked && <Check className={cn('stroke-[3]', iconSizes)} />}
          {isIndeterminate && <Minus className={cn('stroke-[3]', iconSizes)} />}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
