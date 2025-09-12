import React, { useState } from "react";
import { useUserStore } from "../store/userStore";

const IncomeCard = () => {
  const { income, updateIncomeAmount } = useUserStore();
  const [activeChip, setActiveChip] = useState("month");
  const [showPopover, setShowPopover] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const chips = [
    { id: "month", label: "Bulan" },
    { id: "year", label: "Tahun" },
    { id: "range", label: "Rentang" },
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const years = ["2023", "2024", "2025", "2026"];

  const handleChipClick = (chipId) => {
    setActiveChip(chipId);
    setShowPopover(showPopover === chipId ? null : chipId);
  };

  const handleOptionClick = (value, type) => {
    // Simulate income update based on selection
    const amounts = {
      month: Math.floor(Math.random() * 50000) + 10000,
      year: Math.floor(Math.random() * 500000) + 100000,
      range: Math.floor(Math.random() * 100000) + 20000,
    };
    updateIncomeAmount(amounts[type] || amounts.month);
    setShowPopover(null);
  };

  const handleRangeApply = () => {
    if (dateRange.from && dateRange.to) {
      handleOptionClick(null, "range");
    }
  };

  const handleRangeClear = () => {
    setDateRange({ from: "", to: "" });
    setShowPopover(null);
  };

  return (
    <section className="px-4 mt-4">
      <div className="income-card bg-[var(--c-primary)] text-white p-5 rounded-3xl shadow-soft">
        <div className="content">
          <div className="flex items-start justify-between">
            <h2 className="text-base font-semibold">Pendapatan Hari Ini</h2>
            <span className="text-xs px-3 py-1 rounded-full accent-bg font-semibold">
              {income.period}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-4xl font-extrabold tracking-tight text-white">
              Rp <span>{income.amount}</span>
            </p>
            <p className="mt-2 text-sm text-slate-200/70">
              {income.lastUpdated}
            </p>
          </div>

          {/* Chips */}
          <div className="mt-6 flex items-center gap-3">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip.id)}
                className={`chip ${
                  activeChip === chip.id ? "active" : "inactive"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Month Popover */}
          {showPopover === "month" && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
              <p className="text-xs text-slate-500 mb-2">Pilih Bulan</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => handleOptionClick(month, "month")}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year Popover */}
          {showPopover === "year" && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
              <p className="text-xs text-slate-500 mb-2">Pilih Tahun</p>
              <div className="grid grid-cols-4 gap-2 text-sm">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleOptionClick(year, "year")}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Range Popover */}
          {showPopover === "range" && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
              <p className="text-xs text-slate-500 mb-2">
                Pilih Rentang Tanggal
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="text-xs text-slate-600">
                  Dari
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/30"
                  />
                </label>
                <label className="text-xs text-slate-600">
                  Sampai
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/30"
                  />
                </label>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={handleRangeClear}
                  className="px-3 py-1.5 rounded-xl text-sm bg-slate-100 text-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={handleRangeApply}
                  className="px-3 py-1.5 rounded-xl text-sm bg-white text-[var(--c-primary)] font-semibold"
                >
                  Terapkan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IncomeCard;
