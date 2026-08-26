'use client';

import { useState, useId } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

interface PasswordStrengthInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  onStrengthChange?: (isStrong: boolean) => void;
}

export default function PasswordStrengthInput({
  value = '',
  onChange,
  placeholder = 'Type a password',
  label = 'New password',
  className = '',
}: PasswordStrengthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();

  // Evaluate real-time criteria
  const hasMinLength = value.length >= 12;
  const hasUpperLower = /[a-z]/.test(value) && /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^a-zA-Z0-9]/.test(value);

  // Calculate score (0 to 4)
  const score = [hasMinLength, hasUpperLower, hasNumber, hasSymbol].filter(Boolean).length;

  // Derive strength level text & bar colors
  let strengthLabel = 'Empty';
  let barColor = 'bg-slate-700/60';
  let textColor = 'text-slate-400';

  if (value.length > 0) {
    if (score <= 1) {
      strengthLabel = 'Weak';
      barColor = 'bg-red-500';
      textColor = 'text-red-400';
    } else if (score === 2) {
      strengthLabel = 'Medium';
      barColor = 'bg-amber-500';
      textColor = 'text-amber-400';
    } else if (score === 3) {
      strengthLabel = 'Strong';
      barColor = 'bg-cyan-500';
      textColor = 'text-cyan-400';
    } else if (score === 4) {
      strengthLabel = 'Very Strong';
      barColor = 'bg-emerald-500';
      textColor = 'text-emerald-400';
    }
  }

  const checklistItems = [
    { label: '12 characters or more', met: hasMinLength },
    { label: 'Upper and lower case', met: hasUpperLower },
    { label: 'A number', met: hasNumber },
    { label: 'A symbol', met: hasSymbol },
  ];

  return (
    <div className={`w-full max-w-sm font-sans ${className}`}>
      {/* Label */}
      <label htmlFor={inputId} className="block text-xs font-semibold text-slate-200 mb-1.5">
        {label}
      </label>

      {/* Input Box */}
      <div className="relative w-full">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#1b1c20] text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all pr-10"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* 4 Segment Strength Meter Bars */}
      <div className="grid grid-cols-4 gap-1.5 mt-2.5">
        {[0, 1, 2, 3].map((index) => {
          const isFilled = value.length > 0 && index < score;
          return (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isFilled ? barColor : 'bg-slate-800'
              }`}
            />
          );
        })}
      </div>

      {/* Strength Status Label */}
      <div className={`text-xs font-medium mt-3 ${textColor}`}>
        {strengthLabel}
      </div>

      {/* Interactive Requirement Checklist */}
      <div className="mt-2.5 space-y-2">
        {checklistItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs">
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                item.met
                  ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-400'
                  : 'border-slate-700 bg-slate-900/60 text-transparent'
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span
              className={`transition-colors ${
                item.met ? 'text-slate-200 font-medium' : 'text-slate-400'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
