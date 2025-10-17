import PropTypes from "prop-types";

SimpleInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  errors: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  isSelectBox: PropTypes.bool,
  selectBoxData: PropTypes.array,
};

export default function SimpleInput({
  label,
  value,
  type,
  name,
  errors,
  handleChange,
  placeholder,
  disabled,
  isSelectBox = false,
  selectBoxData,
  min,
  max,
}) {
  const inputClassName = `w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500  ${
    disabled ? "bg-gray-200 dark:bg-slate-600" : "bg-white dark:bg-slate-600"
  } dark:text-slate-100 font-semibold`;

  return (
    <div className="relative">
      <label
        className="block text-sm font-semibold text-gray-700 mb-2"
        htmlFor="name"
      >
        {label}
      </label>
      {!isSelectBox && (
        <input
          type={type}
          name={name}
          value={type === "file" ? null : value}
          onChange={handleChange}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          {...(type === "file" && { accept: "image/*, .pdf" })}
        />
      )}
      {isSelectBox && (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={inputClassName}
          disabled={disabled}
          placeholder={placeholder || "Pilih..."}
        >
          {selectBoxData?.map((item) => (
            <option key={item?.id} value={item?.id}>
              {item.name}
            </option>
          ))}
        </select>
      )}
      {errors && <p className="mt-1 text-sm text-red-600">{errors}</p>}
    </div>
  );
}
