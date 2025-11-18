import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// ============================================
// KOMPONEN CHART REUSABLE
// ============================================

// 1. Universal Chart Component
function UniversalChart({
  type = "bar",
  data,
  title,
  height = "300px",
  showLegend = true,
  legendPosition = "top",
  customOptions = {},
  isLoading = false,
  emptyText = "Tidak ada data",
}) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        labels: {
          padding: 10,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: "bold" },
      },
    },
    layout: {
      padding: {
        bottom: 16,
      },
    },
    ...customOptions,
  };

  if (isLoading) {
    if (type === "pie" || type === "doughnut") {
      return (
        <div style={{ height }} className="w-full">
          <div className="animate-pulse bg-gray-100 dark:bg-slate-700 rounded-lg h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-slate-600 rounded-full" />
          </div>
        </div>
      );
    }
    if (type === "line") {
      return (
        <div style={{ height }} className="w-full">
          <div className="animate-pulse h-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-3">
            <div className="h-0.5 bg-gray-200 dark:bg-slate-600 w-full" />
            <div className="flex items-end gap-2 h-full mt-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-slate-600 w-2 rounded-full"
                  style={{ height: `${10 + ((i % 7) + 1) * 6}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ height }} className="w-full">
        <div className="animate-pulse h-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-3">
          <div className="flex items-end gap-3 h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-slate-600 w-6 rounded-sm"
                style={{ height: `${20 + ((i % 5) + 1) * 10}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const ChartComponent =
    {
      bar: Bar,
      line: Line,
      pie: Pie,
      doughnut: Doughnut,
    }[type] || Bar;

  const isEmpty = (() => {
    const ds = data?.datasets || [];
    const labels = Array.isArray(data?.labels) ? data.labels : [];
    if (labels.length === 0 || ds.length === 0) return true;
    return !ds.some(
      (d) => Array.isArray(d.data) && d.data.some((v) => Number(v) > 0)
    );
  })();

  if (isEmpty) {
    return (
      <div style={{ height }} className="w-full">
        <div className="h-full border border-dashed border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center">
          <div className="text-xs text-gray-500">{emptyText}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, marginBottom: "12px" }}>
      <ChartComponent data={data} options={defaultOptions} />
    </div>
  );
}

// 2. Quick Bar Chart Component
export function QuickBarChart({
  labels,
  values,
  label = "Data",
  color = "#3b82f6",
  title,
  height,
  isLoading = false,
}) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  return (
    <UniversalChart
      type="bar"
      data={data}
      title={title}
      height={height}
      isLoading={isLoading}
    />
  );
}

// 3. Quick Line Chart Component
export function QuickLineChart({
  labels,
  values,
  label = "Data",
  color = "#8b5cf6",
  fill = false,
  title,
  height,
  isLoading = false,
}) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: color,
        backgroundColor: fill ? `${color}33` : "transparent",
        tension: 0.4,
        fill,
      },
    ],
  };

  return (
    <UniversalChart
      type="line"
      data={data}
      title={title}
      height={height}
      isLoading={isLoading}
    />
  );
}

// 4. Multi-Dataset Chart Component
export function MultiDatasetChart({
  type = "bar",
  labels,
  datasets,
  title,
  height,
  stacked = false,
  isLoading = false,
}) {
  const data = { labels, datasets };

  const customOptions = stacked
    ? {
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      }
    : {};

  return (
    <UniversalChart
      type={type}
      data={data}
      title={title}
      height={height}
      customOptions={customOptions}
      isLoading={isLoading}
    />
  );
}

// 5. Quick Pie/Doughnut Chart Component
export function QuickPieChart({
  labels,
  values,
  colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
  type = "pie",
  title,
  height,
  isLoading = false,
}) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <UniversalChart
      type={type}
      data={data}
      title={title}
      height={height}
      isLoading={isLoading}
    />
  );
}
