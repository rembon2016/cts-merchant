import { formatCurrency } from "../../../helper/currency";
import { useEffect, useMemo, useState } from "react";
import { useDashboardStore } from "../../../store/dashboardStore";
import {
  QuickBarChart,
  QuickLineChart,
  QuickPieChart,
} from "../../customs/chart/chart";
import SimpleInput from "../../customs/form/SimpleInput";
import PrimaryButton from "../../customs/button/PrimaryButton";

export default function DashboardTransaction() {
  const [formData, setFormData] = useState({
    date: "",
    start_date: "",
    end_date: "",
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

  const { getChartSales, getChartOverView, data, dataOverview, isLoading } =
    useDashboardStore();

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

  const handleChangeTypeChart = (type) => setTypeChart(type);

  const handleFilterChart = () => {
    if (formData?.start_date === "" && formData?.end_date === "") return;

    Promise.all([
      getChartSales("sales-by-date-range", true, formData),
      getChartOverView("custom-date", formData),
    ]);
  };

  const renderClassName = (type) => {
    return `w-8 h-8 ${
      typeChart === type ? "bg-[var(--c-accent)]" : "bg-white"
    } border ${
      typeChart === type ? "border-[var(--c-accent)]" : "border-gray-300"
    } flex justify-center items-center rounded-md`;
  };

  const renderButtonTypeChart = useMemo(() => {
    return (
      <div className="flex gap-1 my-2 w-full justify-end">
        <button
          className={renderClassName("bar")}
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
          className={renderClassName("line")}
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
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.6914 0.737187L11.0157 0L7.15888 3.53525H2.47978L0 6.01503L0.707094 6.72216L2.89356 4.53525H7.54803L11.6914 0.737187ZM11.4633 4.58806L11.9105 5.48247L8.43481 7.22031L4.15688 6.56194L1.32719 8.76328L0.71325 7.97391L3.88331 5.50831L8.27222 6.18325L11.4633 4.58806ZM0.0201563 10.0352H12.0202V11.3686H0.0202187L0.0201563 10.0352Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          className={renderClassName("pie")}
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
    );
  }, [handleChangeTypeChart]);

  const renderTabsChart = useMemo(() => {
    return (
      <div className="inline-flex rounded-md  overflow-hidden  w-full justify-center items-center">
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
                ? "bg-[var(--c-accent)] text-gray-700 rounded-lg font-semibold"
                : "bg-white text-gray-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    );
  }, [activeRange]);

  const renderCardOverview = useMemo(() => {
    return (
      <div className="flex flex-col w-full gap-1 income-card bg-[var(--c-primary)] rounded-xl">
        <div className="w-full p-4 box-border  flex flex-col gap-1  shadow">
          <h3 className="font-normal text-white text-md">Total Amount</h3>
          <h1 className="font-bold text-3xl text-white">
            {isLoading
              ? "..."
              : formatCurrency(dataOverview?.overview?.total_amount)}
          </h1>
        </div>
        <div className="flex w-full gap-2">
          <div className="w-full p-4 box-border  flex flex-col gap-1  shadow">
            <h3 className="font-normal text-white text-md">Total Sales</h3>
            <h1 className="font-bold text-[1.1rem] text-white">
              {isLoading
                ? "..."
                : formatCurrency(dataOverview?.overview?.total_sales)}
            </h1>
          </div>
          <div className="w-full p-4 box-border  flex flex-col gap-1  shadow">
            <h3 className="font-normal text-white text-md">Total Cost</h3>
            <h1 className="font-bold text-[1.1rem] text-white">
              {isLoading
                ? "..."
                : formatCurrency(dataOverview?.overview?.total_cost)}
            </h1>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <div className="w-full p-4 box-border  flex flex-col gap-1  shadow">
            <h3 className="font-normal text-white text-md">Net Sales</h3>
            <h1 className="font-bold text-[1.1rem] text-white">
              {isLoading
                ? "..."
                : formatCurrency(dataOverview?.overview?.net_sales)}
            </h1>
          </div>
          <div className="w-full p-4 box-border  flex flex-col gap-1  shadow">
            <h3 className="font-normal text-white text-md">Net Profit</h3>
            <h1 className="font-bold text-[1.1rem] text-white">
              {isLoading
                ? "..."
                : formatCurrency(dataOverview?.overview?.net_profit)}
            </h1>
          </div>
        </div>
        {/* <div className="flex w-full gap-2">
          <div className="w-full p-4 box-border  flex flex-col gap-1  shadow">
            <h3 className="font-normal text-white text-md">Total Tax</h3>
            <h1 className="font-bold text-[1.1rem] text-white">
              {isLoading
                ? "..."
                : formatCurrency(dataOverview?.overview?.total_tax)}
            </h1>
          </div>
          <div className="w-full p-4 box-border  flex flex-col gap-1  shadow">
            <h3 className="font-normal text-white text-md">Total Refund</h3>
            <h1 className="font-bold text-[1.1rem] text-white">
              {isLoading
                ? "..."
                : formatCurrency(dataOverview?.overview?.total_refund)}
            </h1>
          </div>
        </div> */}
      </div>
    );
  }, [isLoading, dataOverview]);

  const renderFilterInputs = useMemo(() => {
    return (
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-full gap-2">
          <SimpleInput
            name="start_date"
            type="date"
            label="Date Start"
            value={formData?.start_date}
            handleChange={handleChange}
            isDefaultSize={false}
          />
          <SimpleInput
            name="end_date"
            type="date"
            label="Date End"
            value={formData?.end_date}
            handleChange={handleChange}
            isDefaultSize={false}
          />
        </div>
        <div className="flex w-40 ml-auto">
          <PrimaryButton
            title="Filter"
            handleOnClick={handleFilterChart}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }, [formData, isLoading]);

  const chartConfig = useMemo(() => {
    const titles = {
      day: "Total Penjualan Harian",
      week: "Total Penjualan Mingguan",
      month: "Total Penjualan Bulanan",
      year: "Total Penjualan Tahunan",
    };

    return {
      labels: data?.labels ?? [],
      values: data?.amount ?? [],
      title: titles[activeRange] ?? "Total Penjualan",
      height: "300px",
      isLoading,
    };
  }, [data, activeRange, isLoading]);

  const renderChartComponent = useMemo(() => {
    switch (typeChart) {
      case "bar":
        return <QuickBarChart {...chartConfig} />;
      case "line":
        return <QuickLineChart {...chartConfig} />;
      case "pie":
        return <QuickPieChart {...chartConfig} />;
      default:
        return null;
    }
  }, [typeChart, chartConfig]);

  useEffect(() => {
    if (salesKey && overviewKey) {
      Promise.all([getChartSales(salesKey), getChartOverView(overviewKey)]);
    }
  }, [activeRange]);

  return (
    <div className="py-2">
      <div className="w-full my-2 rounded-lg">
        {renderCardOverview}
        <div className="flex flex-col gap-4 flex-wrap bg-white w-full p-4 items-center my-4 rounded-lg">
          {renderTabsChart}
          {/* {renderFilterInputs} */}
          {renderButtonTypeChart}
          {renderChartComponent}
        </div>
      </div>
    </div>
  );
}
