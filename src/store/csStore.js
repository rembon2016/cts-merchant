import { create } from 'zustand';

export const useCSStore = create((set, get) => ({
  csTeams: {
    speakerKasir: {
      key: 'speakerKasir',
      title: 'Customer Service SpeakerKasir',
      issueFocus: 'Kendala soundbox',
      contactInfo: {
        phone: '0800-123-4567',
        whatsapp: '6281262989888',
        email: 'speakerkasir-support@ctsmerchant.com',
      },
      operationalHours: {
        weekdays: '08:00 - 17:00 WIB',
        weekend: 'Tutup',
      },
    },
    astraPay: {
      key: 'astraPay',
      title: 'Customer Service AstraPay',
      issueFocus: 'Kendala transaksi/settlement',
      contactInfo: {
        phone: '0800-987-6543',
        whatsapp: '628123456789',
        email: 'astrapay-support@ctsmerchant.com',
      },
      operationalHours: {
        weekdays: '08:00 - 17:00 WIB',
        weekend: 'Tutup',
      },
    },
  },
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

  getCSTeams: () => {
    return get().csTeams;
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
