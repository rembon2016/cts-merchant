import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Syarat & Ketentuan</h1>
        </div>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Terakhir diperbarui: 1 Oktober 2025
              </p>
              <p className="leading-relaxed">
                Selamat datang di platform kami. Dengan mengakses dan menggunakan layanan kami, Anda setuju untuk terikat dengan syarat dan ketentuan berikut.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                1. Penerimaan Ketentuan
              </h2>
              <p className="leading-relaxed">
                Dengan mengakses atau menggunakan platform ini, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak boleh menggunakan layanan kami.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                2. Definisi
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>"Platform" mengacu pada aplikasi merchant dan semua layanan terkait yang kami sediakan</li>
                <li>"Pengguna" atau "Anda" mengacu pada individu atau entitas yang menggunakan layanan kami</li>
                <li>"Merchant" mengacu pada penjual yang terdaftar di platform kami</li>
                <li>"Konten" mengacu pada semua informasi, data, teks, gambar, atau materi lainnya</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                3. Pendaftaran Akun
              </h2>
              <p className="leading-relaxed mb-2">
                Untuk menggunakan layanan kami, Anda harus:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Memberikan informasi yang akurat, lengkap, dan terkini</li>
                <li>Memelihara keamanan kata sandi Anda</li>
                <li>Bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda</li>
                <li>Segera memberi tahu kami tentang penggunaan tidak sah apa pun</li>
                <li>Berusia minimal 18 tahun atau memiliki izin orang tua/wali</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                4. Penggunaan Layanan
              </h2>
              <p className="leading-relaxed mb-2">
                Anda setuju untuk tidak:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Menggunakan layanan untuk tujuan ilegal atau tidak sah</li>
                <li>Melanggar hak kekayaan intelektual pihak lain</li>
                <li>Mengirimkan virus, malware, atau kode berbahaya lainnya</li>
                <li>Mencoba mengakses sistem kami secara tidak sah</li>
                <li>Mengganggu atau merusak integritas atau kinerja layanan</li>
                <li>Mengumpulkan informasi pengguna lain tanpa izin</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                5. Transaksi dan Pembayaran
              </h2>
              <p className="leading-relaxed mb-2">
                Ketentuan transaksi:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Semua harga ditampilkan dalam Rupiah (IDR)</li>
                <li>Kami berhak menolak atau membatalkan pesanan kapan saja</li>
                <li>Pembayaran harus dilakukan melalui metode yang tersedia</li>
                <li>Biaya transaksi dan pajak dapat berlaku</li>
                <li>Pengembalian dana akan diproses sesuai kebijakan kami</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                6. Hak Kekayaan Intelektual
              </h2>
              <p className="leading-relaxed">
                Semua konten di platform ini, termasuk teks, grafik, logo, ikon, gambar, klip audio, unduhan digital, dan kompilasi data, adalah milik kami atau pemberi lisensi kami dan dilindungi oleh hukum hak cipta Indonesia dan internasional.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                7. Privasi dan Keamanan Data
              </h2>
              <p className="leading-relaxed">
                Kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Penggunaan informasi pribadi Anda diatur oleh Kebijakan Privasi kami. Dengan menggunakan layanan kami, Anda setuju dengan pengumpulan dan penggunaan informasi sesuai dengan kebijakan tersebut.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                8. Batasan Tanggung Jawab
              </h2>
              <p className="leading-relaxed">
                Layanan kami disediakan "sebagaimana adanya" tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                9. Penghentian Layanan
              </h2>
              <p className="leading-relaxed">
                Kami berhak untuk menghentikan atau menangguhkan akses Anda ke layanan kami tanpa pemberitahuan sebelumnya, untuk alasan apa pun, termasuk namun tidak terbatas pada pelanggaran Syarat dan Ketentuan ini.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                10. Perubahan Ketentuan
              </h2>
              <p className="leading-relaxed">
                Kami berhak untuk memodifikasi atau mengganti Syarat dan Ketentuan ini kapan saja. Perubahan material akan diberi tahu melalui email atau pemberitahuan di platform. Penggunaan layanan Anda yang berkelanjutan setelah perubahan tersebut merupakan penerimaan Anda terhadap ketentuan baru.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                11. Hukum yang Berlaku
              </h2>
              <p className="leading-relaxed">
                Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul akan diselesaikan di pengadilan yang berwenang di Indonesia.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                12. Kontak
              </h2>
              <p className="leading-relaxed mb-2">
                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui:
              </p>
              <ul className="space-y-2 ml-2">
                <li>Email: support@merchant.com</li>
                <li>Telepon: +62 21 1234 5678</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Dengan menggunakan layanan kami, Anda mengakui bahwa Anda telah membaca dan memahami Syarat dan Ketentuan ini dan setuju untuk terikat olehnya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
