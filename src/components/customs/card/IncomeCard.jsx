import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useUserStore } from "../../../store/userStore";
import { useTransactionStore } from "../../../store/transactionStore";
import { formatCurrency } from "../../../helper/currency";
import { formatDate } from "../../../helper/format-date";
import SimpleInput from "../form/SimpleInput";
import { useCustomToast } from "../../../hooks/useCustomToast";
import CustomToast from "../toast/CustomToast";
import { IoIosArrowDown } from "react-icons/io";

const CHIPS = [
  { id: "month", label: "Bulan" },
  { id: "year", label: "Tahun" },
  { id: "range", label: "Rentang Waktu" },
];

const MONTHS = [
  { key: "01", value: "Januari" },
  { key: "02", value: "Februari" },
  { key: "03", value: "Maret" },
  { key: "04", value: "April" },
  { key: "05", value: "Mei" },
  { key: "06", value: "Juni" },
  { key: "07", value: "Juli" },
  { key: "08", value: "Agustus" },
  { key: "09", value: "September" },
  { key: "10", value: "Oktober" },
  { key: "11", value: "November" },
  { key: "12", value: "Desember" },
];

const IncomeCard = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [activeItem, setActiveItem] = useState("");
  const [activeChip, setActiveChip] = useState("");
  const [showPopover, setShowPopover] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { updateIncomeAmount } = useUserStore();
  const { getStatisticTransaction, statistic, isLoading } =
    useTransactionStore();
  const { toast, error: showError, hideToast } = useCustomToast();

  // Memoize years array to prevent recreation on every render
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, i) =>
      (currentYear - 3 + i).toString(),
    );
  }, []);

  const AMOUNT = useMemo(
    () => formatCurrency(Number.parseFloat(statistic.amount || 0)),
    [statistic.amount],
  );

  const TOTAL_AMOUNT = useMemo(
    () => formatCurrency(Number.parseFloat(statistic.total_amount || 0)),
    [statistic.total_amount],
  );

  const SUBSCRIPTION_FEE = useMemo(
    () => formatCurrency(Number.parseFloat(statistic.subscription_fee || 0)),
    [statistic.subscription_fee],
  );

  const SUBSCRIPTION_DAYS = useMemo(
    () => statistic.subscription_days || 0,
    [statistic.subscription_days],
  );

  const validateForm = useCallback(() => {
    const errors = {};

    if (!dateRange.from) {
      errors.from = "Wajib di isi";
    }

    if (!dateRange.to) {
      errors.to = "Wajib di isi";
    }

    if (dateRange.from && dateRange.to) {
      if (dateRange?.from > dateRange?.to) {
        showError("Tanggal awal harus lebih kecil dari tanggal akhir");
      }
    }

    return errors;
  }, [dateRange, showError]);

  const handleChipClick = useCallback((chipId) => {
    setActiveChip(chipId);
    setShowPopover((prev) => (prev === chipId ? null : chipId));
  }, []);

  const handleOptionClick = useCallback(
    (value, type) => {
      const valueMonth = MONTHS.find((m) => m.key === value);
      const valueRange = `${formatDate(value?.from)} - ${formatDate(value?.to)}`;

      const currentYear = new Date().getFullYear();

      setActiveItem(
        activeChip === "month"
          ? `${valueMonth?.value || ""} ${currentYear}`.trim()
          : activeChip === "range"
            ? valueRange
            : value,
      );

      const amounts = {
        [type]: getStatisticTransaction(value, type),
      };
      updateIncomeAmount(amounts || amounts?.range);
      setShowPopover(null);
    },
    [activeChip, getStatisticTransaction, updateIncomeAmount],
  );

  const handleRangeApply = useCallback(() => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    if (dateRange.from && dateRange.to) {
      if (dateRange.from > dateRange.to) return;
      handleOptionClick(dateRange, "range");
    }
  }, [dateRange, validateForm, handleOptionClick]);

  const handleRangeClear = useCallback(() => {
    setDateRange({ from: "", to: "" });
    setShowPopover(null);
    setValidationErrors({});
  }, []);

  const deleteButton = useMemo(() => {
    return (
      <button
        className="bg-slate-200 text-black shadow-lg w-6 h-6 flex justify-center items-center rounded-full text-xs"
        onClick={() => {
          setActiveItem("");
          setActiveChip("");
          setShowPopover(null);
          setFilterOpen(false);
        }}
      >
        X
      </button>
    );
  }, []);

  const getResultText = useMemo(() => {
    return activeItem || "Hari ini";
  }, [activeItem]);

  const resetLockRef = useRef(false);
  const resetTimeoutRef = useRef(null);

  const resetData = useCallback(() => {
    if (resetLockRef.current) return;
    resetLockRef.current = true;

    setActiveChip("");
    setActiveItem("");
    setShowPopover(null);
    setDateRange({ from: "", to: "" });
    getStatisticTransaction();

    resetTimeoutRef.current = setTimeout(() => {
      resetLockRef.current = false;
      resetTimeoutRef.current = null;
    }, 3000);
  }, [getStatisticTransaction]);

  useEffect(() => {
    getStatisticTransaction();
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="px-4 mt-4">
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      <div className="income-card  bg-[var(--c-primary)] text-white p-5 rounded-3xl shadow-soft min-h-[168px]">
        <div className="content">
          <div className="flex justify-end gap-1 items-center mb-3">
            <div className="relative">
              <button
                onClick={() => setFilterOpen((p) => !p)}
                className="flex gap-2 justify-center items-center py-0.5 px-1.5 bg-[--c-accent] text-black rounded-lg font-semibold"
              >
                Filter Waktu
                {filterOpen ? (
                  <IoIosArrowDown className="w-3 h-3" />
                ) : (
                  <IoIosArrowDown className="w-3 h-3 -rotate-90 transition-all ease-in 500" />
                )}
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700 z-50">
                  <div className="flex flex-col gap-2">
                    {CHIPS.map((chip) => (
                      <button
                        key={chip.id}
                        onClick={() => {
                          handleChipClick(chip.id);
                          setFilterOpen(false);
                        }}
                        className={`text-sm p-2 rounded-lg text-left transition-colors ${{
                          true: "",
                        }} ${
                          activeChip === chip.id
                            ? "bg-amber-400 text-black font-semibold"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                resetData();
                setFilterOpen(false);
              }}
              className="py-1 px-3 bg-red-500 text-white rounded-xl items-end w-fit"
            >
              Reset
            </button>
          </div>
          <div className="flex justify-between w-full mb-3">
            <p className="flex items-center justify-between font-semibold text-sm gap-1">
              Durasi Langganan:{" "}
              <span className="font-semibold">{SUBSCRIPTION_DAYS} Hari</span>
            </p>
          </div>
          <h2 className="flex items-start justify-between flex-col gap-2 text-base">
            <p className="flex gap-1">
              Pendapatan: <span className="font-semibold">{getResultText}</span>
            </p>
            <span className="text-[1.5rem] font-extrabold tracking-tight text-white">
              {isLoading ? "..." : AMOUNT}
            </span>
          </h2>

          <p className="flex gap-1 items-center mt-1">
            Biaya Berlangganan:{" "}
            <span className="font-semibold">
              {isLoading ? "..." : SUBSCRIPTION_FEE}
            </span>
          </p>

          <div className="flex flex-col mt-3">
            <h2 className="flex items-start justify-between flex-col gap-2 text-base">
              <p className="flex gap-1">Dana Yang Bisa Dicairkan</p>
              <span className="text-[1.5rem] font-extrabold tracking-tight text-white">
                {isLoading ? "..." : TOTAL_AMOUNT}
              </span>
            </h2>
          </div>

          <div className="mt-6" />

          {/* Month Popover */}
          {showPopover === "month" && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-slate-500 dark:text-slate-200 mb-2">
                  Pilih Bulan
                </p>
                {deleteButton}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {MONTHS.map((month) => {
                  return (
                    <button
                      key={month.key}
                      onClick={() => handleOptionClick(month?.key, "month")}
                      className={`p-2 rounded-lg hover:bg-[var(--c-accent)] hover:font-semibold dark:hover:text-gray-600 transition-colors ${
                        activeChip === "month" && month.value === activeItem
                          ? "bg-[var(--c-accent)] text-gray-600 font-semibold"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      {month?.value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Year Popover */}
          {showPopover === "year" && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-slate-500 dark:text-slate-200 mb-2">
                  Pilih Tahun
                </p>
                {deleteButton}
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleOptionClick(year, "year")}
                    className={`p-2 rounded-lg hover:bg-[var(--c-accent)] hover:font-semibold dark:hover:text-gray-600 transition-colors ${
                      activeChip === "year" && year === activeItem
                        ? "bg-[var(--c-accent)] text-gray-600 font-semibold"
                        : "hover:bg-slate-100"
                    }`}
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
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-slate-500 dark:text-slate-200 mb-2">
                  Pilih Tanggal
                </p>
                {deleteButton}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <SimpleInput
                  name="from"
                  type="date"
                  label="Dari"
                  value={dateRange.from}
                  handleChange={(e) => {
                    setDateRange((prev) => ({ ...prev, from: e.target.value }));
                    setValidationErrors({
                      ...validationErrors,
                      from: "",
                    });
                  }}
                  isDefaultSize={false}
                  errors={validationErrors.from}
                />
                <SimpleInput
                  name="to"
                  type="date"
                  label="Sampai"
                  value={dateRange.to}
                  handleChange={(e) => {
                    setDateRange((prev) => ({ ...prev, to: e.target.value }));
                    setValidationErrors({
                      ...validationErrors,
                      to: "",
                    });
                  }}
                  isDefaultSize={false}
                  errors={validationErrors.to}
                />
              </div>
              <p className="text-xs text-red-500 mt-2">
                {validationErrors.ranges}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={handleRangeClear}
                  className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200"
                >
                  Reset
                </button>
                <button
                  onClick={handleRangeApply}
                  className="px-3 py-1.5 rounded-lg text-sm bg-[var(--c-primary)] text-white font-semibold"
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
