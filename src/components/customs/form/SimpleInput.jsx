import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

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
  changeInputType: PropTypes.bool,
  isRequired: PropTypes.bool,
  isDefaultSize: PropTypes.bool,
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
  isRequired = false,
  changeInputType = false,
  selectBoxData,
  min,
  max,
  isDefaultSize = true,
}) {
  const canToggleType =
    changeInputType && (type === "password" || type === "text");
  const [dynamicType, setDynamicType] = useState(type);
  useEffect(() => {
    if (canToggleType) {
      setDynamicType(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  const inputClassName = `w-full ${isDefaultSize ? "p-4" : "p-1"} border ${
    errors ? "border-2 border-red-600" : "border-slate-300"
  } rounded-xl focus:ring-2 focus:ring-blue-500  ${
    disabled ? "bg-gray-200 dark:bg-slate-600" : "bg-white dark:bg-slate-600"
  } dark:text-slate-100 font-semibold ${errors ? "text-red-500" : ""}`;

  return (
    <div className="relative w-full">
      <label
        className={`${
          label !== ""
            ? `block text-sm font-semibold ${
                errors ? "text-red-500" : "text-gray-700"
              } mb-2`
            : "hidden"
        }`}
        htmlFor="name"
      >
        {isRequired ? `${label} *` : label}
      </label>
      {!isSelectBox && (
        <input
          type={canToggleType ? dynamicType : type}
          name={name}
          value={(canToggleType ? dynamicType : type) === "file" ? null : value}
          onChange={handleChange}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          {...((canToggleType ? dynamicType : type) === "file" && {
            accept: "image/*, .pdf",
          })}
        />
      )}
      {!isSelectBox && canToggleType && (
        <button
          type="button"
          className={`absolute right-3 top-12 ${
            errors ? "text-red-500" : "text-gray-500"
          } dark:text-blue-300`}
          onClick={() => {
            if (disabled) return;
            setDynamicType((prev) =>
              prev === "password" ? "text" : "password"
            );
          }}
          aria-label={
            dynamicType === "password"
              ? "Tampilkan password"
              : "Sembunyikan password"
          }
        >
          {dynamicType === "password" ? (
            <Eye className="w-6 h-6" />
          ) : (
            <EyeOff className="w-6 h-6" />
          )}
        </button>
      )}
      {isSelectBox && (
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className={`${inputClassName} appearance-none`}
            disabled={disabled}
            placeholder={placeholder || "Pilih..."}
          >
            <option defaultValue selected>
              Pilih
            </option>
            {Array?.isArray(selectBoxData) &&
              selectBoxData?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
          </select>
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              errors ? "text-red-500" : "text-gray-500"
            } dark:text-blue-300 pointer-events-none`}
          />
        </div>
      )}
      {errors && <p className="mt-2 text-sm text-red-600">{errors}</p>}
    </div>
  );
}
