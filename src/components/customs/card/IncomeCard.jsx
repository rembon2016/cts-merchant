import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useUserStore } from "../../../store/userStore";
import { useTransactionStore } from "../../../store/transactionStore";
import { formatCurrency } from "../../../helper/currency";
import { formatDate } from "../../../helper/format-date";
import SimpleInput from "../form/SimpleInput";
import { useCustomToast } from "../../../hooks/useCustomToast";
import CustomToast from "../toast/CustomToast";

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

const TOTAL_INSTALLMENT_DAYS = 547;
const TOTAL_INSTALLMENT_MONTHS = 18;
const INSTALLMENT_FEE = 2000;
const INTERBANK_FEE = 2000;

const FilterAdjustIcon = ({ className = "h-[20px] w-[20px]" }) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6.37498 3.54169C6.18712 3.54169 6.00695 3.61632 5.87411 3.74916C5.74127 3.882 5.66665 4.06217 5.66665 4.25003C5.66665 4.43789 5.74127 4.61806 5.87411 4.75089C6.00695 4.88373 6.18712 4.95836 6.37498 4.95836C6.56284 4.95836 6.74301 4.88373 6.87585 4.75089C7.00869 4.61806 7.08331 4.43789 7.08331 4.25003C7.08331 4.06217 7.00869 3.882 6.87585 3.74916C6.74301 3.61632 6.56284 3.54169 6.37498 3.54169ZM4.3704 3.54169C4.51674 3.12694 4.78813 2.76779 5.14715 2.51375C5.50618 2.25971 5.93517 2.12329 6.37498 2.12329C6.81479 2.12329 7.24378 2.25971 7.6028 2.51375C7.96183 2.76779 8.23322 3.12694 8.37956 3.54169H13.4583C13.6462 3.54169 13.8263 3.61632 13.9592 3.74916C14.092 3.882 14.1666 4.06217 14.1666 4.25003C14.1666 4.43789 14.092 4.61806 13.9592 4.75089C13.8263 4.88373 13.6462 4.95836 13.4583 4.95836H8.37956C8.23322 5.37311 7.96183 5.73226 7.6028 5.9863C7.24378 6.24034 6.81479 6.37676 6.37498 6.37676C5.93517 6.37676 5.50618 6.24034 5.14715 5.9863C4.78813 5.73226 4.51674 5.37311 4.3704 4.95836H3.54165C3.35378 4.95836 3.17362 4.88373 3.04078 4.75089C2.90794 4.61806 2.83331 4.43789 2.83331 4.25003C2.83331 4.06217 2.90794 3.882 3.04078 3.74916C3.17362 3.61632 3.35378 3.54169 3.54165 3.54169H4.3704ZM10.625 7.79169C10.4371 7.79169 10.257 7.86632 10.1241 7.99916C9.99127 8.132 9.91665 8.31217 9.91665 8.50003C9.91665 8.68789 9.99127 8.86806 10.1241 9.00089C10.257 9.13373 10.4371 9.20836 10.625 9.20836C10.8128 9.20836 10.993 9.13373 11.1258 9.00089C11.2587 8.86806 11.3333 8.68789 11.3333 8.50003C11.3333 8.31217 11.2587 8.132 11.1258 7.99916C10.993 7.86632 10.8128 7.79169 10.625 7.79169ZM8.6204 7.79169C8.76674 7.37694 9.03813 7.01779 9.39715 6.76375C9.75618 6.50971 10.1852 6.37329 10.625 6.37329C11.0648 6.37329 11.4938 6.50971 11.8528 6.76375C12.2118 7.01779 12.4832 7.37694 12.6296 7.79169H13.4583C13.6462 7.79169 13.8263 7.86632 13.9592 7.99916C14.092 8.132 14.1666 8.31217 14.1666 8.50003C14.1666 8.68789 14.092 8.86806 13.9592 9.00089C13.8263 9.13373 13.6462 9.20836 13.4583 9.20836H12.6296C12.4832 9.62311 12.2118 9.98226 11.8528 10.2363C11.4938 10.4903 11.0648 10.6268 10.625 10.6268C10.1852 10.6268 9.75618 10.4903 9.39715 10.2363C9.03813 9.98226 8.76674 9.62311 8.6204 9.20836H3.54165C3.35378 9.20836 3.17362 9.13373 3.04078 9.00089C2.90794 8.86806 2.83331 8.68789 2.83331 8.50003C2.83331 8.31217 2.90794 8.132 3.04078 7.99916C3.17362 7.86632 3.35378 7.79169 3.54165 7.79169H8.6204ZM6.37498 12.0417C6.18712 12.0417 6.00695 12.1163 5.87411 12.2492C5.74127 12.382 5.66665 12.5622 5.66665 12.75C5.66665 12.9379 5.74127 13.1181 5.87411 13.2509C6.00695 13.3837 6.18712 13.4584 6.37498 13.4584C6.56284 13.4584 6.74301 13.3837 6.87585 13.2509C7.00869 13.1181 7.08331 12.9379 7.08331 12.75C7.08331 12.5622 7.00869 12.382 6.87585 12.2492C6.74301 12.1163 6.56284 12.0417 6.37498 12.0417ZM4.3704 12.0417C4.51674 11.6269 4.78813 11.2678 5.14715 11.0138C5.50618 10.7597 5.93517 10.6233 6.37498 10.6233C6.81479 10.6233 7.24378 10.7597 7.6028 11.0138C7.96183 11.2678 8.23322 11.6269 8.37956 12.0417H13.4583C13.6462 12.0417 13.8263 12.1163 13.9592 12.2492C14.092 12.382 14.1666 12.5622 14.1666 12.75C14.1666 12.9379 14.092 13.1181 13.9592 13.2509C13.8263 13.3837 13.6462 13.4584 13.4583 13.4584H8.37956C8.23322 13.8731 7.96183 14.2323 7.6028 14.4863C7.24378 14.7403 6.81479 14.8768 6.37498 14.8768C5.93517 14.8768 5.50618 14.7403 5.14715 14.4863C4.78813 14.2323 4.51674 13.8731 4.3704 13.4584H3.54165C3.35378 13.4584 3.17362 13.3837 3.04078 13.2509C2.90794 13.1181 2.83331 12.9379 2.83331 12.75C2.83331 12.5622 2.90794 12.382 3.04078 12.2492C3.17362 12.1163 3.35378 12.0417 3.54165 12.0417H4.3704Z"
        fill="black"
      />
    </svg>
  );
};

const WalletMiniIcon = () => {
  return (
    <svg
      width="11"
      height="8"
      viewBox="0 0 11 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5.3125 0C2.67272 0 0 0.821313 0 2.39063C0 3.95994 2.67272 4.78125 5.3125 4.78125C7.95228 4.78125 10.625 3.95994 10.625 2.39063C10.625 0.821313 7.95281 0 5.3125 0ZM2.65625 5.27956V6.87331C3.31341 7.03216 4.04016 7.12938 4.78125 7.16072V5.56697C4.06533 5.53962 3.35371 5.44338 2.65625 5.27956ZM5.84375 5.56644V7.16019C6.55967 7.13284 7.27129 7.03659 7.96875 6.87278V5.27903C7.27129 5.44284 6.55967 5.53909 5.84375 5.56644ZM9.03125 4.93903V6.53278C9.98803 6.13169 10.625 5.54625 10.625 4.78125V3.1875C10.625 3.9525 9.98803 4.53794 9.03125 4.93903ZM1.59375 6.53278V4.93903C0.6375 4.53794 0 3.95197 0 3.1875V4.78125C0 5.54572 0.6375 6.13169 1.59375 6.53278Z"
        fill="#0F244E"
      />
    </svg>
  );
};

const MetricCard = ({ title, amount, isLoading }) => {
  const [currencySymbol = "Rp", ...amountParts] = String(amount || "Rp 0").split(" ");
  const amountValue = amountParts.join(" ") || "0";

  return (
    <article className="rounded-3xl bg-[#0F244E] px-5 py-4 shadow-[0_10px_20px_rgba(4,13,40,0.36)]">
      <div className="flex items-center gap-3">
        <span className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] bg-white shadow-md">
          <WalletMiniIcon />
        </span>
        <p className="text-[15px] font-normal leading-tight text-white">{title}</p>
      </div>
      {isLoading ? (
        <p className="mt-4 text-[31px] font-extrabold leading-none tracking-tight text-white">...</p>
      ) : (
        <div className="mt-4 flex items-end gap-1 text-white">
          <span className="text-[19px] font-bold leading-none tracking-tight">{currencySymbol}</span>
          <span className="text-[31px] font-extrabold leading-none tracking-tight">{amountValue}</span>
        </div>
      )}
    </article>
  );
};

const IncomeCard = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [activeItem, setActiveItem] = useState("");
  const [activeChip, setActiveChip] = useState("");
  const [showPopover, setShowPopover] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { updateIncomeAmount } = useUserStore();
  const { getStatisticTransaction, statistic, isLoading, getReferralBonus, referralBonus, hasPendingWithdrawal, isLoadingReferral, claimReferralBonus } =
    useTransactionStore();
  const { toast, success: showSuccess, error: showError, hideToast } = useCustomToast();

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

  const INSTALLMENT_FEE_DISPLAY = useMemo(
    () => formatCurrency(INSTALLMENT_FEE),
    [],
  );

  const INTERBANK_FEE_DISPLAY = useMemo(() => formatCurrency(INTERBANK_FEE), []);

  const REFERRAL_BONUS_DISPLAY = useMemo(
    () => formatCurrency(Number.parseFloat(referralBonus || 0)),
    [referralBonus],
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
    return activeItem || "Hari Ini";
  }, [activeItem]);

  const handleClaimReferral = useCallback(async () => {
    if (!referralBonus || referralBonus <= 0) return;
    const result = await claimReferralBonus(referralBonus);
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  }, [referralBonus, claimReferralBonus, showSuccess, showError]);

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
    getReferralBonus();
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
      <div className="income-card income-card--plain rounded-[2.1rem] bg-[#14316A] px-4 py-5 text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:px-6 sm:py-6">
        <div className="content">
          <div className="mb-5 flex items-center gap-3">
            <div className="relative flex-1">
              <button
                onClick={() => setFilterOpen((p) => !p)}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#F2C94C] px-4 py-1.5 text-[15px] font-semibold text-black"
              >
                <FilterAdjustIcon className="h-[20px] w-[20px]" />
                Filter Waktu
              </button>
              {filterOpen && (
                <div className="absolute left-0 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700 z-50">
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
                className="w-fit rounded-[8px] bg-[#EB5757] px-5 py-1.5 text-[15px] font-normal text-white"
            >
              Reset
            </button>
          </div>

          {/* Month Popover */}
          {showPopover === "month" && (
            <div className="mt-3 mb-4 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
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
                      className={`p-2 rounded-lg border border-[#42506E] hover:bg-[var(--c-accent)] hover:font-semibold dark:hover:text-gray-600 transition-colors ${
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
            <div className="mt-3 mb-4 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
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
                    className={`p-2 rounded-lg border border-[#42506E] hover:bg-[var(--c-accent)] hover:font-semibold dark:hover:text-gray-600 transition-colors ${
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
            <div className="mt-3 mb-4 rounded-2xl border border-slate-200 bg-white shadow-soft p-3 text-slate-700">
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
                  onClick={handleRangeApply}
                  className="px-3 py-1.5 rounded-lg text-sm bg-[var(--c-primary)] text-white font-semibold"
                >
                  Terapkan
                </button>
                <button
                  onClick={handleRangeClear}
                  className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          <div className="mb-5 w-full">
            <p className="text-[15px] leading-tight text-white text-center">
              <span className="font-normal">Durasi Cicilan: </span>
                <span className="font-bold">{SUBSCRIPTION_DAYS} Hari / {TOTAL_INSTALLMENT_DAYS} Hari</span>
                <span className="font-normal"> ({TOTAL_INSTALLMENT_MONTHS} bulan)</span>
            </p>
          </div>
          <div className="space-y-4">
            <MetricCard title={`Pendapatan ${getResultText}`} amount={AMOUNT} isLoading={isLoading} />
            <MetricCard title="Dana Yang Dicairkan" amount={TOTAL_AMOUNT} isLoading={isLoading} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-[13px]">
            <p className="flex items-center gap-1">
              <span className="font-normal">Biaya Cicil :</span>
              <span className="font-bold">{INSTALLMENT_FEE_DISPLAY}</span>
            </p>
            <span className="text-white/80">|</span>
            <p className="flex items-center gap-1">
              <span className="font-normal">Biaya Antar Bank :</span>
              <span className="font-bold">{INTERBANK_FEE_DISPLAY}</span>
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="text-white/70"></span>
              <span className="font-normal text-white/80">Bonus Kode Referal</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-white">
                {isLoadingReferral ? (
                  <span className="animate-pulse text-white/60">Memuat...</span>
                ) : (
                  REFERRAL_BONUS_DISPLAY
                )}
              </span>
              {!isLoadingReferral && referralBonus > 0 && (
                <button
                  onClick={handleClaimReferral}
                  className="rounded-full bg-[#F2C94C] px-3 py-1 text-[11px] font-bold text-black shadow-sm transition-all hover:bg-yellow-300 active:scale-95"
                >
                  Klaim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncomeCard;
