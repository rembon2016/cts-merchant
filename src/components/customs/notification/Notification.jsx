const notifications = [
  {
    id: 1,
    title: "Transaksi Berhasil",
    message: "Pembayaran telah diterima.",
    date: "2025-09-12 10:30",
  },
  {
    id: 2,
    title: "Promo Baru",
    message: "Dapatkan diskon 20% untuk produk tertentu.",
    date: "2025-09-11 09:00",
  },
  // Tambahkan notifikasi lain sesuai kebutuhan
];

const Notification = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Semua Notifikasi</h2>
      <div className="mt-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">Tidak ada notifikasi.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 mb-3 bg-gray-50 dark:bg-slate-700 shadow-sm"
            >
              <div className="font-bold text-lg">{notif.title}</div>
              <div className="my-2 text-gray-700 dark:text-gray-200">
                {notif.message}
              </div>
              <div className="text-xs text-gray-400">{notif.date}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
