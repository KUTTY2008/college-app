import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-300 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400 ml-1 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
