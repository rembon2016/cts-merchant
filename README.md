# CTS Merchant - React Dashboard

Aplikasi dashboard merchant modern yang dibangun dengan React, Vite, dan Tailwind CSS. Aplikasi ini menyediakan interface yang intuitif untuk mengelola transaksi, melihat pendapatan, dan mengatur profil merchant.

## 🚀 Fitur Utama

- **Dashboard Interaktif**: Kartu pendapatan dengan filter periode waktu
- **Manajemen Transaksi**: Riwayat transaksi dengan filter dan pencarian
- **Quick Menu**: Akses cepat ke fitur Soundbox, Uang Saku, dan POS
- **Dark/Light Mode**: Toggle tema yang persisten
- **Responsive Design**: Optimized untuk mobile dan desktop
- **Bottom Navigation**: Navigasi mudah antar halaman
- **Modal & Bottom Sheet**: UI components yang modern

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Heroicons (SVG)
- **Build Tool**: Vite

## 📦 Instalasi

1. Clone atau download proyek ini
2. Install dependencies:

   ```bash
   npm install
   ```

3. Jalankan development server:

   ```bash
   npm run dev
   ```

4. Buka browser di `http://localhost:3000`

````

## 🎨 Kustomisasi Tema

Aplikasi menggunakan CSS custom properties untuk tema:

```css
:root {
  --c-primary: #3b82f6; /* Warna utama */
  --c-accent: #10b981; /* Warna aksen */
}
````

Untuk mengubah warna tema, edit file `src/index.css`.

## 🔧 Konfigurasi

### Vite Config

Konfigurasi Vite tersedia di `vite.config.js` dengan:

- Plugin React
- Server port 3000
- Auto-open browser

### Tailwind Config

Kustomisasi Tailwind di `tailwind.config.js`:

- Custom colors
- Extended shadows
- Custom border radius
- Font family Inter

## 🚀 Build & Deploy

1. Build untuk production:

   ```bash
   npm run build
   ```

2. Preview build:

   ```bash
   npm run preview
   ```

3. Deploy folder `dist/` ke hosting pilihan Anda

## 📄 Scripts

```bash
npm run dev      # Development server
npm run build    # Build untuk production
npm run preview  # Preview build
npm run lint     # ESLint check
```

## 🤝 Kontribusi

1. Fork proyek ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail.

---

**Dibuat dengan ❤️ menggunakan React + Vite + Tailwind CSS**
