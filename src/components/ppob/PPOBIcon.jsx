import React from 'react';

/**
 * Master component untuk PPOB Icons
 * Mengikuti prinsip KISS & DRY untuk memudahkan maintenance
 * Setiap kategori memiliki warna unik untuk identifikasi visual yang lebih baik
 */
const PPOBIcon = ({ type, size = 'md' }) => {
  // Icon mapping dengan warna berbeda untuk setiap kategori
  const iconConfig = {
    pulsa: {
      icon: 'bx bx-mobile',
      color: 'text-blue-500' // Biru untuk pulsa/telekomunikasi
    },
    listrik: {
      icon: 'bx bxs-bolt',
      color: 'text-amber-500' // Kuning/amber untuk listrik
    },
    ewallet: {
      icon: 'bx bx-wallet',
      color: 'text-emerald-500' // Hijau untuk e-wallet (seperti uang)
    },
    game: {
      icon: 'bx bx-game',
      color: 'text-purple-500' // Ungu untuk game/entertainment
    },
    pdam: {
      icon: 'bx bx-water',
      color: 'text-cyan-500' // Cyan untuk air/PDAM
    },
    pascabayar: {
      icon: 'bx bx-phone',
      color: 'text-indigo-500' // Indigo untuk pascabayar
    },
    bpjs: {
      icon: 'bx bx-plus-medical',
      color: 'text-rose-500' // Rose/merah untuk kesehatan
    },
    default: {
      icon: 'bx bx-file',
      color: 'text-gray-500'
    }
  };

  // Size mapping
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const config = iconConfig[type] || iconConfig.default;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <i className={`${config.icon} ${config.color} ${sizeClass}`}></i>
  );
};

export default PPOBIcon;
