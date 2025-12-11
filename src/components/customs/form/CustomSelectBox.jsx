import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

/**
 * CustomSelectBox
 * - Searchable select box
 * - Supports multiple selection
 * - Styling follows SimpleInput component
 *
 * Props:
 * - label, name, placeholder, disabled, errors
 * - selectBoxData: [{ id, name }, ...]
 * - value: array of selected ids (for multiple) or single id
 * - multiple: boolean
 * - onChange: function(newValue)
 */
export default function CustomSelectBox({
  label,
  name,
  value,
  selectBoxData = [],
  onChange,
  placeholder,
  disabled,
  errors,
  multiple = true,
  searchable = true,
  isRequired = false,
  inputName,
  onAddItem,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);

  // Normalize incoming `value` into selected object(s).
  // Accepts these incoming shapes:
  // - multiple: array of objects [{id,...}, ...]
  // - multiple: array of ids [id1, id2]
  // - single: object {id,...}
  // - single: id
  const getSelectedObjects = () => {
    if (multiple) {
      if (!Array.isArray(value)) return [];
      const first = value[0];
      const areObjects = first && typeof first === "object" && "id" in first;
      if (areObjects) return value;
      return value
        .map((id) => selectBoxData?.find((d) => d.id === id))
        .filter(Boolean);
    }
    if (!value) return [];
    if (typeof value === "object" && "id" in value) return [value];
    const found = selectBoxData?.find((d) => d.id === value);
    return found ? [found] : [];
  };
  const selectedObjects = getSelectedObjects();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputClassName = `w-full p-4 ${
    errors ? "border-2 border-red-500" : "border border-slate-300"
  } rounded-xl focus:ring-2 focus:ring-blue-500  ${
    disabled ? "bg-gray-200 dark:bg-slate-600" : "bg-white dark:bg-slate-600"
  } dark:text-slate-100 font-semibold dark:border-none`;

  const filtered =
    Array.isArray(selectBoxData) &&
    selectBoxData?.filter((item) =>
      (item?.name || "").toString().toLowerCase().includes(search.toLowerCase())
    );

  function toggleOption(itemId) {
    if (disabled) return;
    const item = selectBoxData?.find((d) => d.id === itemId);
    if (!item) return;

    if (multiple) {
      const next = [...selectedObjects];
      const idx = next.findIndex((s) => s.id === itemId);
      if (idx >= 0) next.splice(idx, 1);
      else next.push(item);
      // return array of objects
      onChange && onChange(next);
      setSearch("");
    } else {
      const next =
        selectedObjects.length && selectedObjects[0].id === itemId
          ? null
          : item;
      // return object or null
      onChange && onChange(next);
      setIsOpen(false);
    }
  }

  function isSelected(id) {
    return selectedObjects.some((s) => s.id === id);
  }

  function handleKeyDown(e) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && filtered[highlightIndex]) {
        toggleOption(filtered[highlightIndex].id);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
      setHighlightIndex(-1);
    }
  }

  function removeChip(id) {
    if (!multiple) return;
    const next = selectedObjects.filter((v) => v.id !== id);
    onChange && onChange(next);
  }

  const selectedItems = selectedObjects;

  return (
    <div className="relative rounded-xl" ref={containerRef}>
      {label && (
        <label
          className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
            errors ? "text-red-500" : "text-gray-600"
          }`}
          htmlFor={name}
        >
          {isRequired ? `${label} *` : label}
        </label>
      )}

      <div
        className={`${inputClassName} flex items-center gap-2 cursor-text`}
        onClick={() => !disabled && setIsOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        <div className="flex-1 min-h-[38px] rounded-xl">
          {selectedItems && selectedItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded-full text-sm"
                >
                  <span className="truncate max-w-[160px]">{item.name}</span>
                  {multiple && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeChip(item.id);
                      }}
                      className="ml-1 text-slate-500 hover:text-slate-700"
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {(!multiple || selectedItems.length === 0 || multiple) &&
                searchable && (
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={placeholder || "Pilih..."}
                    disabled={disabled}
                    className={`bg-transparent focus:outline-none text-sm w-full ${
                      disabled ? "opacity-60" : ""
                    }`}
                  />
                )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && setIsOpen(true);
                }}
                placeholder={placeholder || "Pilih..."}
                disabled={disabled}
                className={`bg-transparent focus:outline-none text-sm w-full ${
                  disabled ? "opacity-60" : ""
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pl-2">
          <svg
            className={`w-5 h-5 text-slate-500 ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 12a1 1 0 01-.7-.3l-3-3a1 1 0 111.4-1.4L10 9.6l2.3-2.3a1 1 0 111.4 1.4l-3 3A1 1 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-auto">
          <ul role="listbox" className="p-2">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-500">
                {search && onAddItem ? (
                  <button
                    type="button"
                    className="w-full text-left text-[var(--c-primary)] dark:text-blue-200 font-medium hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddItem(search);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    + Tambahkan {inputName} "{search}?"
                  </button>
                ) : (
                  "Tidak ada data"
                )}
              </li>
            )}
            {filtered.map((item, idx) => (
              <li
                key={item.id}
                role="option"
                aria-selected={isSelected(item.id)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleOption(item.id)}
                className={`px-3 py-2 rounded-md cursor-pointer flex items-center justify-between text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  highlightIndex === idx ? "bg-slate-100 dark:bg-slate-700" : ""
                } ${isSelected(item.id) ? "font-semibold" : ""}`}
                onMouseEnter={() => setHighlightIndex(idx)}
              >
                <span className="truncate">{item.name}</span>
                {isSelected(item.id) && (
                  <svg
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M16.7 5.3a1 1 0 00-1.4-1.4L8 11.2 4.7 8a1 1 0 10-1.4 1.4l4 4a1 1 0 001.4 0l8-8z" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {errors && <p className="mt-1 text-sm text-red-600">{errors}</p>}
    </div>
  );
}

CustomSelectBox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  selectBoxData: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.string,
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  onAddItem: PropTypes.func,
  inputName: PropTypes.string,
  isRequired: PropTypes.bool,
};
