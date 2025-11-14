/**
 * CustomCheckbox
 * A toggle-style checkbox (on/off) built with Tailwind CSS.
 * Props:
 *  - checked: boolean (controlled)
 *  - onChange: function(newChecked: boolean)
 *  - disabled: boolean
 *  - id: string
 *  - className: string (extra wrapper classes)
 *  - size: 'sm' | 'md' | 'lg'
 *  - ariaLabel: string
 */
const SIZES = {
  sm: { track: "w-10 h-5", knob: "w-4 h-4", translateX: "translate-x-5" },
  md: { track: "w-14 h-7", knob: "w-6 h-6", translateX: "translate-x-7" },
  lg: { track: "w-20 h-9", knob: "w-8 h-8", translateX: "translate-x-11" },
};

export default function CustomCheckbox({
  checked = false,
  onChange,
  disabled = false,
  id,
  name,
  className = "",
  size = "md",
  ariaLabel,
}) {
  const s = SIZES[size] || SIZES.md;

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {/* Visually hidden native checkbox for accessibility */}
      <input
        id={id}
        name={name}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
      />

      {/* Track */}
      <div
        className={`relative ${
          s.track
        } rounded-full transition-colors duration-200 ${
          checked ? "bg-emerald-500" : "bg-gray-300"
        }`}
        aria-hidden="true"
      >
        {/* Knob */}
        <span
          className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full shadow-md ${
            s.knob
          } transition-transform duration-200 ${
            checked ? s.translateX : "translate-x-1"
          }`}
        />
      </div>
    </label>
  );
}
