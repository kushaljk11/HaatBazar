import { useMemo, useState } from "react";

export default function CityAutocomplete({
  value,
  onChange,
  options,
  placeholder = "Type city...",
  disabled = false,
  showAllOption = false,
  allOptionLabel = "All Cities",
  containerClassName = "",
  inputClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const term = String(value || "").trim().toLowerCase();
    const normalized = [...new Set((options || []).filter(Boolean))];

    if (!term) {
      return normalized.slice(0, 12);
    }

    return normalized
      .filter((item) => item.toLowerCase().includes(term))
      .slice(0, 12);
  }, [options, value]);

  return (
    <div className={`relative ${containerClassName}`}>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />

      {isOpen ? (
        <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-emerald-100 bg-white p-1 shadow-lg">
          {showAllOption ? (
            <button
              type="button"
              onMouseDown={() => onChange("")}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              {allOptionLabel}
            </button>
          ) : null}

          {filteredOptions.length > 0 ? (
            filteredOptions.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={() => onChange(item)}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-emerald-50"
              >
                {item}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-slate-500">No matching city found</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
