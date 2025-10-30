import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GuideAccordion from '../components/cs/GuideAccordion';

// Guides data
const guidesData = [
  {
    icon: '🛒',
    title: 'Cara Menggunakan POS',
    description: 'Panduan lengkap menggunakan fitur Point of Sale untuk melakukan transaksi',
    steps: [
      'Buka menu POS dari navigasi bawah',
      'Pilih kategori produk yang diinginkan',
      'Klik produk untuk menambahkan ke keranjang',
      'Atur jumlah produk dengan tombol + dan -',
      'Klik "Lihat Keranjang" untuk melanjutkan checkout'
    ]
  },
  {
    icon: '💳',
    title: 'Cara Melakukan Checkout',
    description: 'Langkah-langkah menyelesaikan pembayaran transaksi',
    steps: [
      'Pastikan produk di keranjang sudah sesuai',
      'Klik tombol "Checkout" di halaman keranjang',
      'Pilih metode pembayaran (Cash/QRIS/Transfer)',
      'Masukkan jumlah pembayaran pelanggan',
      'Klik "Proses Pembayaran" untuk menyelesaikan',
      'Invoice akan otomatis ter-generate'
    ]
  },
  {
    icon: '📊',
    title: 'Cara Melihat Transaksi',
    description: 'Melihat riwayat dan detail transaksi yang telah dilakukan',
    steps: [
      'Buka menu Transaksi dari navigasi bawah',
      'Gunakan filter untuk periode tertentu (Hari ini, Minggu ini, Bulan ini)',
      'Gunakan search untuk mencari transaksi spesifik',
      'Klik pada transaksi untuk melihat detail lengkap',
      'Download invoice jika diperlukan'
    ]
  },
  {
    icon: '👤',
    title: 'Cara Mengubah Profil',
    description: 'Mengedit informasi profil dan data merchant',
    steps: [
      'Buka menu Profil dari navigasi bawah',
      'Klik "Edit Profil" untuk mengubah data pribadi',
      'Atau klik "Edit Data Merchant" untuk data toko',
      'Ubah informasi yang diperlukan',
      'Klik "Simpan" untuk menyimpan perubahan'
    ]
  },
  {
    icon: '🌓',
    title: 'Cara Mengubah Tema',
    description: 'Mengaktifkan mode gelap atau terang sesuai preferensi',
    steps: [
      'Buka menu Profil dari navigasi bawah',
      'Scroll ke bawah hingga menemukan toggle tema',
      'Klik toggle untuk beralih antara Light/Dark mode',
      'Tema akan tersimpan otomatis'
    ]
  },
  {
    icon: '🔔',
    title: 'Cara Melihat Notifikasi',
    description: 'Mengakses dan mengelola notifikasi aplikasi',
    steps: [
      'Klik ikon notifikasi (🔔) di pojok kanan atas',
      'Lihat daftar notifikasi terbaru',
      'Klik notifikasi untuk melihat detail',
      'Notifikasi akan otomatis ditandai sudah dibaca'
    ]
  },
  {
    icon: '📦',
    title: 'Cara Mengelola Produk',
    description: 'Menambah, edit, atau hapus produk di katalog POS',
    steps: [
      'Fitur ini akan segera hadir',
      'Sementara produk dikelola oleh admin',
      'Hubungi customer support untuk bantuan'
    ]
  },
  {
    icon: '💰',
    title: 'Cara Melihat Pendapatan',
    description: 'Memantau pendapatan dan statistik penjualan',
    steps: [
      'Buka halaman Beranda',
      'Lihat card "Total Pendapatan" di bagian atas',
      'Gunakan filter untuk melihat periode tertentu',
      'Statistik akan otomatis terupdate'
    ]
  }
];

const GuidePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter guides based on search
  const filteredGuides = guidesData.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Panduan Penggunaan
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari panduan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredGuides.length > 0 ? (
          <GuideAccordion guides={filteredGuides} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Panduan tidak ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidePage;
