import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { useTransactionStore } from "../store/transactionStore";
import { formatCurrency } from "../helper/currency";

const IncomeCard = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [activeChip, setActiveChip] = useState("");
  const [showPopover, setShowPopover] = useState(null);
  const { income, updateIncomeAmount } = useUserStore();
  const { getStatisticTransaction, statistic, isLoading } =
    useTransactionStore();

  const chips = [
    { id: "month", label: "Bulan" },
    { id: "year", label: "Tahun" },
    { id: "range", label: "Rentang" },
  ];

  const AMOUNT = formatCurrency(Number.parseFloat(statistic.amount || 0));

  const months = [
    {
      key: "01",
      value: "Jan",
    },
    {
      key: "02",
      value: "Feb",
    },
    {
      key: "03",
      value: "Mar",
    },
    {
      key: "04",
      value: "Apr",
    },
    {
      key: "05",
      value: "Mei",
    },
    {
      key: "06",
      value: "Jun",
    },
    {
      key: "07",
      value: "Jul",
    },
    {
      key: "08",
      value: "Agu",
    },
    {
      key: "09",
      value: "Sep",
    },
    {
      key: "10",
      value: "Okt",
    },
    {
      key: "11",
      value: "Nov",
    },
    {
      key: "12",
      value: "Des",
    },
  ];

  // build an array of 4 years as strings: [currentYear-3, currentYear-2, currentYear-1, currentYear]
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) =>
    (currentYear - 3 + i).toString()
  );

  const handleChipClick = (chipId) => {
    setActiveChip(chipId);
    setShowPopover(showPopover === chipId ? null : chipId);
  };

  const handleOptionClick = (value, type) => {
    // Simulate income update based on selection
    const amounts = {
      [type]: getStatisticTransaction(value, type),
    };
    updateIncomeAmount(amounts || amounts?.range);
    setShowPopover(null);
  };

  const handleRangeApply = () => {
    if (dateRange.from && dateRange.to) {
      handleOptionClick(dateRange, "range");
    }
  };

  const handleRangeClear = () => {
    setDateRange({ from: "", to: "" });
    setShowPopover(null);
  };

  useEffect(() => {
    getStatisticTransaction();
  }, []);

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
              <span>{isLoading ? "..." : AMOUNT}</span>
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
                    onClick={() => handleOptionClick(month?.key, "month")}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {month?.value}
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
