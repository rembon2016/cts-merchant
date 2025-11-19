import VariantModal from "../customs/modal/VariantModal";
import SearchInput from "../customs/form/SearchInput";
import { formatCurrency } from "../../helper/currency";
import { useTransactionStore } from "../../store/transactionStore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ElementsNoData } from "../customs/element/NoData";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";
import { useDebounce } from "../../hooks/useDebounce";
import { useDashboardStore } from "../../store/dashboardStore";
import {
  QuickBarChart,
  QuickLineChart,
  QuickPieChart,
} from "../customs/chart/chart";
import SimpleInput from "../customs/form/SimpleInput";

export default function POSTransaction() {
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    date: "",
  });
  const [activeRange, setActiveRange] = useState("day");
  const [typeChart, setTypeChart] = useState("bar");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { transactions, isLoading, getListTransactions } =
    useTransactionStore();

  const {
    getChartSales,
    getChartOverView,
    data,
    dataOverview,
    isLoading: loadingChart,
  } = useDashboardStore();

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  const navigate = useNavigate();

  // compute total for "Today" group (summing trx.total values)
  const todayGroup = transactions.find((g) => g.date_group === "Today") || {
    transactions: [],
  };
  const totalToday = todayGroup.transactions.reduce(
    (sum, t) => sum + (Number(t.total) || 0),
    0
  );

  const renderElements = useMemo(() => {
    if (isLoading) {
      return <LoadingSkeletonList items={6} />;
    }

    if (!isLoading && transactions.length === 0) {
      return <ElementsNoData text="Tidak ada transaksi" />;
    }

    return (
      <div className="min-h-[70vh]">
        <div className="w-full">
          {/* Header / Search / Filters */}

          {/* Transactions List */}
          <div className="space-y-6">
            {transactions.map((group) => (
              <section key={group.date_group}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-medium text-gray-700">
                    {group.date_group}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {group.transactions.length} transaksi
                  </span>
                </div>

                <div className="space-y-3">
                  {group.transactions.map((trx) => (
                    <button
                      key={trx.id}
                      onClick={() => navigate(`/pos/transaction/${trx.id}`)}
                      className="w-full"
                    >
                      <div className="bg-white border border-gray-100 rounded-lg p-3 flex flex-col gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center font-semibold flex-shrink-0">
                            {trx.transaction_type === "sale" ? "S" : "T"}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-800 truncate">
                                {trx.code}
                              </div>
                              <div className="text-xs text-[var(--c-primary)] font-semibold">
                                • {trx.time}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-start truncate">
                              oleh: {trx.created_by} • {trx.item_count} item
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-1 border-t pt-2">
                          <div className="text-xs text-gray-500">
                            {trx.payment_method?.name}
                          </div>
                          •
                          <div className="font-semibold text-lg text-[var(--c-primary)]">
                            {formatCurrency(trx.total)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* keep VariantModal import for potential interactions */}
        <VariantModal />
      </div>
    );
  }, [transactions, isLoading]);

  const handleChangeTypeChart = (type) => setTypeChart(type);

  const chartConfig = {
    labels: data?.labels || [],
    values: data?.amount || [],
    title:
      activeRange === "day"
        ? "Total Penjualan Harian"
        : activeRange === "week"
        ? "Total Penjualan Mingguan"
        : activeRange === "month"
        ? "Total Penjualan Bulanan"
        : "Total Penjualan Tahunan",
    height: "300px",
    isLoading: loadingChart,
  };

  useEffect(() => {
    getListTransactions({
      search: debouncedSearch,
    });
  }, [debouncedSearch]);

  useEffect(() => {
    const salesKey = {
      day: "day",
      week: "weekly",
      month: "monthly",
      year: "yearly",
    }[activeRange];
    const overviewKey = {
      day: "today",
      week: "week",
      month: "month",
      year: "year",
    }[activeRange];
    if (salesKey && overviewKey) {
      Promise.all([
        getChartSales(salesKey, formData),
        getChartOverView(overviewKey),
      ]);
    }
  }, [activeRange, formData]);

  return (
    <div className="px-4 py-2">
      <div className="w-full bg-white p-4 my-2 rounded-lg">
        <div className="flex flex-col flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
            {[
              { key: "day", label: "Hari Ini" },
              { key: "week", label: "Minggu" },
              { key: "month", label: "Bulan" },
              { key: "year", label: "Tahun" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setActiveRange(btn.key)}
                className={`px-3 py-1.5 text-sm ${
                  activeRange === btn.key
                    ? "bg-[var(--c-accent)] text-gray-700 rounded-lg"
                    : "bg-white text-gray-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 my-4 w-full">
            <div className="w-full income-card p-4 bg-[var(--c-primary)] flex flex-col gap-1 rounded-xl shadow">
              <h3 className="font-normal text-white text-sm">
                Total Pendapatan
              </h3>
              <h1 className="font-bold text-md text-white">
                {loadingChart
                  ? "..."
                  : formatCurrency(dataOverview?.overview?.total_amount)}
              </h1>
            </div>
            <div className="w-full income-card p-4 bg-[var(--c-primary)] flex flex-col gap-1 rounded-xl shadow">
              <h3 className="font-normal text-white text-sm">Laba</h3>
              <h1 className="font-bold text-md text-white">
                {loadingChart
                  ? "..."
                  : formatCurrency(dataOverview?.overview?.net_profit)}
              </h1>
            </div>
          </div>
          <div className="flex-1 min-w-[160px] w-full">
            {activeRange === "day" && (
              <SimpleInput
                name="date"
                type="date"
                label=""
                value={formData?.date}
                handleChange={handleChange}
              />
            )}
          </div>
        </div>
        <div className="flex gap-1 mb-2 w-full justify-end">
          <button
            className="w-8 h-8 bg-white border border-gray-500 flex justify-center items-center"
            onClick={() => handleChangeTypeChart("bar")}
          >
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 2.125V11.9375H12.25V2.125H9ZM4.5 11.9375H7.75V0H4.5V11.9375ZM0 11.9375H3.25V4.25H0V11.9375Z"
                fill="black"
              />
            </svg>
          </button>
          <button
            className="w-8 h-8 bg-white border border-gray-500 flex justify-center items-center"
            onClick={() => handleChangeTypeChart("line")}
          >
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.6914 0.737187L11.0157 0L7.15888 3.53525H2.47978L0 6.01503L0.707094 6.72216L2.89356 4.53525H7.54803L11.6914 0.737187ZM11.4633 4.58806L11.9105 5.48247L8.43481 7.22031L4.15688 6.56194L1.32719 8.76328L0.71325 7.97391L3.88331 5.50831L8.27222 6.18325L11.4633 4.58806ZM0.0201563 10.0352H12.0202V11.3686H0.0202187L0.0201563 10.0352Z"
                fill="black"
              />
            </svg>
          </button>
          <button
            className="w-8 h-8 bg-white border border-gray-500 flex justify-center items-center"
            onClick={() => handleChangeTypeChart("pie")}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.4585 6.395L6.2825 1.005C6.01011 0.961549 5.73483 0.938651 5.459 0.9365C2.4435 0.9365 0 3.3805 0 6.395C0 9.41 2.444 11.8535 5.4585 11.8535C8.473 11.8535 10.917 9.4095 10.917 6.395C10.917 6.267 10.907 6.1415 10.898 6.015L5.4585 6.395ZM7.3855 0L6.5615 5.39L12.0005 5.01C11.9138 3.7752 11.4097 2.60659 10.5711 1.69615C9.73242 0.785708 8.60905 0.187573 7.3855 0Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
        {typeChart === "bar" && <QuickBarChart {...chartConfig} />}
        {typeChart === "line" && <QuickLineChart {...chartConfig} />}
        {typeChart === "pie" && <QuickPieChart {...chartConfig} />}
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Transaksi POS</h2>
        <p className="text-xs text-gray-500 mt-1">
          Transaksi terbaru berdasarkan tanggal
        </p>

        <div className="mt-4">
          <div className="w-full">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari transaksi..."
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between border-t pt-3">
            <span>Total hari ini</span>
            <span className="font-semibold text-lg text-[var(--c-primary)]">
              {formatCurrency(totalToday)}
            </span>
          </div>
        </div>
      </div>

      {renderElements}
    </div>
  );
}
