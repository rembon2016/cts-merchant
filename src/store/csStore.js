import { create } from 'zustand';

export const useCSStore = create((set, get) => ({
  // State
  contactInfo: {
    phone: '0800-123-4567',
    whatsapp: '628123456789',
    email: 'support@ctsmerchant.com',
  },
  operationalHours: {
    weekdays: '08:00 - 17:00 WIB',
    weekend: 'Tutup'
  },
  isOperational: false,

  // Actions
  getContactInfo: () => {
    return get().contactInfo;
  },

  checkOperationalStatus: () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // 0 = Sunday, 6 = Saturday
    const isWeekend = day === 0 || day === 6;
    const isOperatingHours = hour >= 8 && hour < 17;
    
    const isOperational = !isWeekend && isOperatingHours;
    set({ isOperational });
    return isOperational;
  }
}));
