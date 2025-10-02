import PropTypes from "prop-types";

SimpleInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  errors: PropTypes.string,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

const inputClassName =
  "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-600 dark:text-slate-100 dark:border-none";

export default function SimpleInput({
  label,
  value,
  type,
  name,
  errors,
  handleChange,
  placeholder,
  disabled,
}) {
  return (
    <div className="relative">
      <label
        className="block text-sm font-medium text-slate-700 mb-1"
        htmlFor="name"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={type === "file" ? null : value}
        onChange={handleChange}
        className={inputClassName}
        placeholder={placeholder}
        disabled={disabled}
        {...(type === "file" && { accept: "image/*, .pdf" })}
      />
      {errors && <p className="mt-1 text-sm text-red-600">{errors}</p>}
    </div>
  );
}
