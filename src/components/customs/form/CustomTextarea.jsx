import React, { useState, forwardRef, useImperativeHandle } from "react";

/**
 * CustomTextarea
 * - Floating label
 * - Animated gradient underline on focus
 * - Character counter and error/helper text
 * - Works controlled or uncontrolled
 *
 * Props:
 * - id, name, label, value, defaultValue, onChange, rows, maxLength
 * - disabled, className, helperText, error
 */
const CustomTextarea = forwardRef((props, ref) => {
  const {
    id,
    name,
    label,
    value,
    defaultValue,
    onChange,
    rows = 4,
    maxLength,
    disabled = false,
    className = "",
    helperText = "",
    error = "",
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const currentValue = isControlled ? value : internalValue;

  useImperativeHandle(ref, () => ({
    focus: () => {
      elementRef?.focus?.();
    },
  }));

  let elementRef = null;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  const hasValue = (currentValue && String(currentValue).length > 0) || false;
  const hasError = Boolean(error);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Floating label */}
      {label && (
        <label
          htmlFor={id}
          className={`mb-5 text-sm transition-all duration-150 pointer-events-none peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:text-indigo-600`}
        >
          {label}
        </label>
      )}
      <div
        className={`peer-container relative bg-gradient-to-br from-white/60 to-slate-50/60 dark:from-slate-800/40 dark:to-slate-800/30 rounded-2xl shadow-sm p-0.5 border border-transparent hover:shadow-md transition-all duration-200`}
      >
        <div className="relative px-4 pt-4 pb-1 rounded-2xl  dark:bg-gray-600 bg-white">
          <textarea
            id={id}
            name={name}
            ref={(el) => (elementRef = el)}
            rows={rows}
            value={currentValue}
            defaultValue={defaultValue}
            onChange={handleChange}
            maxLength={maxLength}
            disabled={disabled}
            placeholder=" "
            className={`peer resize-none w-full bg-transparent outline-none text-sm leading-6 p-0 pb-3 text-slate-800 dark:text-slate-100 placeholder-transparent`}
            {...rest}
          />

          {/* Underlines */}
          <div className="absolute left-4 right-4 bottom-2 h-0.5 bg-slate-200 rounded-full"></div>
          <div
            className={`absolute left-4 right-4 bottom-2 h-0.5 rounded-full transform origin-left transition-transform duration-300
              ${
                hasError
                  ? "scale-x-100 bg-red-500"
                  : "peer-focus:scale-x-100 scale-x-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 px-2">
        <p
          className={`text-xs ${
            hasError ? "text-red-500" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {hasError ? error : helperText}
        </p>

        {maxLength !== undefined && (
          <p
            className={`text-xs ${
              currentValue && currentValue.length > maxLength
                ? "text-red-500"
                : "text-slate-400"
            }`}
          >
            {currentValue ? currentValue.length : 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

CustomTextarea.displayName = "CustomTextarea";

export default CustomTextarea;
