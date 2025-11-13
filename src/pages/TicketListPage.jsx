import { ArrowLeft, Ticket, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTicketStore } from "../store/ticketStore";
import { useAuthStore } from "../store/authStore";
import CustomLoading from "../components/customs/loading/CustomLoading";

const TicketListPage = () => {
  const navigate = useNavigate();
  const {
    tickets,
    loading,
    filter,
    setFilter,
    fetchTickets,
    getFilteredTickets,
  } = useTicketStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTickets(user?.id || "user123");
  }, [fetchTickets, user]);

  const filters = [
    { value: "all", label: "Semua", count: tickets.length },
    {
      value: "open",
      label: "Open",
      count: tickets.filter((t) => t.status === "open").length,
    },
    {
      value: "in-progress",
      label: "In Progress",
      count: tickets.filter((t) => t.status === "in-progress").length,
    },
    {
      value: "resolved",
      label: "Resolved",
      count: tickets.filter((t) => t.status === "resolved").length,
    },
    {
      value: "closed",
      label: "Closed",
      count: tickets.filter((t) => t.status === "closed").length,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "in-progress":
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      resolved:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-gray-500",
      medium: "text-blue-500",
      high: "text-orange-500",
      urgent: "text-red-500",
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const filteredTickets = getFilteredTickets().filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Riwayat Laporan
          </h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Laporan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? "bg-[var(--c-primary)] text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
              }`}
            >
              {f.label} {f.count > 0 && `(${f.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="p-4 space-y-3">
        {loading ? (
          <CustomLoading />
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? "Laporan tidak ditemukan" : "Belum ada Laporan"}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => navigate(`/cs/ticket/${ticket.id}`)}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {ticket.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {ticket.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              {ticket.replies.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💬 {ticket.replies.length} balasan
                  </p>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketListPage;
