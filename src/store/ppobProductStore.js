import { create } from 'zustand';

const usePPOBProductStore = create((set) => ({
  // Categories
  categories: [
    { id: 'pulsa', name: 'Pulsa & Data', icon: 'bx bx-mobile', popular: true },
    { id: 'listrik', name: 'Listrik PLN', icon: 'bx bxs-bolt', popular: true },
    { id: 'ewallet', name: 'E-Wallet', icon: 'bx bx-wallet', popular: true },
    { id: 'game', name: 'Voucher Game', icon: 'bx bx-game', popular: false },
    { id: 'pdam', name: 'PDAM', icon: 'bx bx-water', popular: false },
    { id: 'pascabayar', name: 'Pascabayar', icon: 'bx bx-phone', popular: false },
    { id: 'bpjs', name: 'BPJS', icon: 'bx bx-plus-medical', popular: false },
  ],
  
  // Operators data with prefix
  operators: {
    telkomsel: {
      name: 'Telkomsel',
      prefix: ['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'],
      icon: 'bx bxs-circle text-red-600',
    },
    indosat: {
      name: 'Indosat Ooredoo',
      prefix: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
      icon: 'bx bxs-circle text-yellow-500',
    },
    xl: {
      name: 'XL Axiata',
      prefix: ['0817', '0818', '0819', '0859', '0877', '0878'],
      icon: 'bx bxs-circle text-blue-600',
    },
    tri: {
      name: 'Tri',
      prefix: ['0895', '0896', '0897', '0898', '0899'],
      icon: 'bx bxs-circle text-gray-400',
    },
    smartfren: {
      name: 'Smartfren',
      prefix: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
      icon: 'bx bxs-circle text-purple-600',
    },
    axis: {
      name: 'Axis',
      prefix: ['0831', '0832', '0833', '0838'],
      icon: 'bx bxs-circle text-green-600',
    },
  },
  
  // Products
  products: {
    pulsa: [
      { id: 'p5', name: 'Pulsa 5.000', nominal: 5000, price: 5500, commission: 200 },
      { id: 'p10', name: 'Pulsa 10.000', nominal: 10000, price: 10500, commission: 300 },
      { id: 'p15', name: 'Pulsa 15.000', nominal: 15000, price: 15500, commission: 400 },
      { id: 'p20', name: 'Pulsa 20.000', nominal: 20000, price: 20500, commission: 500 },
      { id: 'p25', name: 'Pulsa 25.000', nominal: 25000, price: 25500, commission: 600 },
      { id: 'p30', name: 'Pulsa 30.000', nominal: 30000, price: 30500, commission: 700 },
      { id: 'p40', name: 'Pulsa 40.000', nominal: 40000, price: 40500, commission: 800 },
      { id: 'p50', name: 'Pulsa 50.000', nominal: 50000, price: 50500, commission: 1000 },
      { id: 'p75', name: 'Pulsa 75.000', nominal: 75000, price: 75500, commission: 1500 },
      { id: 'p100', name: 'Pulsa 100.000', nominal: 100000, price: 100500, commission: 2000 },
    ],
    listrik: [
      { id: 'l20', name: 'Token 20.000', nominal: 20000, price: 20500, commission: 500, estimatedKwh: '12 kWh' },
      { id: 'l50', name: 'Token 50.000', nominal: 50000, price: 50500, commission: 1000, estimatedKwh: '30 kWh' },
      { id: 'l100', name: 'Token 100.000', nominal: 100000, price: 100500, commission: 1500, estimatedKwh: '65 kWh' },
      { id: 'l150', name: 'Token 150.000', nominal: 150000, price: 150500, commission: 2000, estimatedKwh: '100 kWh' },
      { id: 'l200', name: 'Token 200.000', nominal: 200000, price: 200500, commission: 2500, estimatedKwh: '135 kWh' },
      { id: 'l500', name: 'Token 500.000', nominal: 500000, price: 500500, commission: 5000, estimatedKwh: '350 kWh' },
    ],
    ewallet: [
      { 
        id: 'gopay', 
        name: 'GoPay', 
        icon: 'bx bxl-google text-green-500',
        nominals: [
          { id: 'gopay10', nominal: 10000, price: 10500, commission: 300 },
          { id: 'gopay20', nominal: 20000, price: 20500, commission: 500 },
          { id: 'gopay25', nominal: 25000, price: 25500, commission: 600 },
          { id: 'gopay50', nominal: 50000, price: 50500, commission: 1000 },
          { id: 'gopay75', nominal: 75000, price: 75500, commission: 1500 },
          { id: 'gopay100', nominal: 100000, price: 100500, commission: 2000 },
          { id: 'gopay150', nominal: 150000, price: 150500, commission: 2500 },
          { id: 'gopay200', nominal: 200000, price: 200500, commission: 3000 },
          { id: 'gopay250', nominal: 250000, price: 250500, commission: 3500 },
          { id: 'gopay300', nominal: 300000, price: 300500, commission: 4000 },
          { id: 'gopay500', nominal: 500000, price: 500500, commission: 6000 },
          { id: 'gopay750', nominal: 750000, price: 750500, commission: 8000 },
          { id: 'gopay1000', nominal: 1000000, price: 1000500, commission: 10000 },
          { id: 'gopay2000', nominal: 2000000, price: 2000500, commission: 18000 },
          { id: 'gopay5000', nominal: 5000000, price: 5000500, commission: 40000 },
        ]
      },
      { 
        id: 'ovo', 
        name: 'OVO', 
        icon: 'bx bxs-wallet text-purple-600',
        nominals: [
          { id: 'ovo10', nominal: 10000, price: 10500, commission: 300 },
          { id: 'ovo20', nominal: 20000, price: 20500, commission: 500 },
          { id: 'ovo25', nominal: 25000, price: 25500, commission: 600 },
          { id: 'ovo50', nominal: 50000, price: 50500, commission: 1000 },
          { id: 'ovo75', nominal: 75000, price: 75500, commission: 1500 },
          { id: 'ovo100', nominal: 100000, price: 100500, commission: 2000 },
          { id: 'ovo150', nominal: 150000, price: 150500, commission: 2500 },
          { id: 'ovo200', nominal: 200000, price: 200500, commission: 3000 },
          { id: 'ovo250', nominal: 250000, price: 250500, commission: 3500 },
          { id: 'ovo300', nominal: 300000, price: 300500, commission: 4000 },
          { id: 'ovo500', nominal: 500000, price: 500500, commission: 6000 },
          { id: 'ovo750', nominal: 750000, price: 750500, commission: 8000 },
          { id: 'ovo1000', nominal: 1000000, price: 1000500, commission: 10000 },
          { id: 'ovo2000', nominal: 2000000, price: 2000500, commission: 18000 },
          { id: 'ovo5000', nominal: 5000000, price: 5000500, commission: 40000 },
        ]
      },
      { 
        id: 'dana', 
        name: 'DANA', 
        icon: 'bx bx-credit-card text-blue-500',
        nominals: [
          { id: 'dana10', nominal: 10000, price: 10500, commission: 300 },
          { id: 'dana20', nominal: 20000, price: 20500, commission: 500 },
          { id: 'dana25', nominal: 25000, price: 25500, commission: 600 },
          { id: 'dana50', nominal: 50000, price: 50500, commission: 1000 },
          { id: 'dana75', nominal: 75000, price: 75500, commission: 1500 },
          { id: 'dana100', nominal: 100000, price: 100500, commission: 2000 },
          { id: 'dana150', nominal: 150000, price: 150500, commission: 2500 },
          { id: 'dana200', nominal: 200000, price: 200500, commission: 3000 },
          { id: 'dana250', nominal: 250000, price: 250500, commission: 3500 },
          { id: 'dana300', nominal: 300000, price: 300500, commission: 4000 },
          { id: 'dana500', nominal: 500000, price: 500500, commission: 6000 },
          { id: 'dana750', nominal: 750000, price: 750500, commission: 8000 },
          { id: 'dana1000', nominal: 1000000, price: 1000500, commission: 10000 },
          { id: 'dana2000', nominal: 2000000, price: 2000500, commission: 18000 },
          { id: 'dana5000', nominal: 5000000, price: 5000500, commission: 40000 },
        ]
      },
      { 
        id: 'shopeepay', 
        name: 'ShopeePay', 
        icon: 'bx bxs-shopping-bag text-orange-500',
        nominals: [
          { id: 'shopee10', nominal: 10000, price: 10500, commission: 300 },
          { id: 'shopee20', nominal: 20000, price: 20500, commission: 500 },
          { id: 'shopee25', nominal: 25000, price: 25500, commission: 600 },
          { id: 'shopee50', nominal: 50000, price: 50500, commission: 1000 },
          { id: 'shopee75', nominal: 75000, price: 75500, commission: 1500 },
          { id: 'shopee100', nominal: 100000, price: 100500, commission: 2000 },
          { id: 'shopee150', nominal: 150000, price: 150500, commission: 2500 },
          { id: 'shopee200', nominal: 200000, price: 200500, commission: 3000 },
          { id: 'shopee250', nominal: 250000, price: 250500, commission: 3500 },
          { id: 'shopee300', nominal: 300000, price: 300500, commission: 4000 },
          { id: 'shopee500', nominal: 500000, price: 500500, commission: 6000 },
          { id: 'shopee750', nominal: 750000, price: 750500, commission: 8000 },
          { id: 'shopee1000', nominal: 1000000, price: 1000500, commission: 10000 },
          { id: 'shopee2000', nominal: 2000000, price: 2000500, commission: 18000 },
          { id: 'shopee5000', nominal: 5000000, price: 5000500, commission: 40000 },
        ]
      },
      { 
        id: 'linkaja', 
        name: 'LinkAja', 
        icon: 'bx bx-link text-red-500',
        nominals: [
          { id: 'linkaja10', nominal: 10000, price: 10500, commission: 300 },
          { id: 'linkaja20', nominal: 20000, price: 20500, commission: 500 },
          { id: 'linkaja25', nominal: 25000, price: 25500, commission: 600 },
          { id: 'linkaja50', nominal: 50000, price: 50500, commission: 1000 },
          { id: 'linkaja75', nominal: 75000, price: 75500, commission: 1500 },
          { id: 'linkaja100', nominal: 100000, price: 100500, commission: 2000 },
          { id: 'linkaja150', nominal: 150000, price: 150500, commission: 2500 },
          { id: 'linkaja200', nominal: 200000, price: 200500, commission: 3000 },
          { id: 'linkaja250', nominal: 250000, price: 250500, commission: 3500 },
          { id: 'linkaja300', nominal: 300000, price: 300500, commission: 4000 },
          { id: 'linkaja500', nominal: 500000, price: 500500, commission: 6000 },
          { id: 'linkaja750', nominal: 750000, price: 750500, commission: 8000 },
          { id: 'linkaja1000', nominal: 1000000, price: 1000500, commission: 10000 },
          { id: 'linkaja2000', nominal: 2000000, price: 2000500, commission: 18000 },
          { id: 'linkaja5000', nominal: 5000000, price: 5000500, commission: 40000 },
        ]
      },
    ],
    game: [
      { 
        id: 'ml', 
        name: 'Mobile Legends', 
        icon: 'bx bx-sword text-blue-600',
        fields: ['userId', 'zoneId'],
        nominals: [
          { id: 'ml1', item: '5 Diamond', nominal: 5, price: 1500, commission: 100 },
          { id: 'ml2', item: '12 Diamond', nominal: 12, price: 3500, commission: 200 },
          { id: 'ml3', item: '28 Diamond', nominal: 28, price: 8000, commission: 400 },
          { id: 'ml4', item: '50 Diamond', nominal: 50, price: 13500, commission: 600 },
          { id: 'ml5', item: '100 Diamond', nominal: 100, price: 25500, commission: 1000 },
          { id: 'ml6', item: '140 Diamond', nominal: 140, price: 35500, commission: 1400 },
          { id: 'ml7', item: '210 Diamond', nominal: 210, price: 52500, commission: 2000 },
          { id: 'ml8', item: '296 Diamond', nominal: 296, price: 73500, commission: 2800 },
          { id: 'ml9', item: '408 Diamond', nominal: 408, price: 100500, commission: 3800 },
          { id: 'ml10', item: '568 Diamond', nominal: 568, price: 140500, commission: 5200 },
        ]
      },
      { 
        id: 'ff', 
        name: 'Free Fire', 
        icon: 'bx bxs-flame text-orange-500',
        fields: ['userId'],
        nominals: [
          { id: 'ff1', item: '50 Diamond', nominal: 50, price: 7500, commission: 400 },
          { id: 'ff2', item: '70 Diamond', nominal: 70, price: 10500, commission: 500 },
          { id: 'ff3', item: '100 Diamond', nominal: 100, price: 14500, commission: 600 },
          { id: 'ff4', item: '140 Diamond', nominal: 140, price: 20500, commission: 800 },
          { id: 'ff5', item: '210 Diamond', nominal: 210, price: 30500, commission: 1200 },
          { id: 'ff6', item: '355 Diamond', nominal: 355, price: 51500, commission: 2000 },
          { id: 'ff7', item: '425 Diamond', nominal: 425, price: 61500, commission: 2400 },
          { id: 'ff8', item: '720 Diamond', nominal: 720, price: 103500, commission: 4000 },
          { id: 'ff9', item: '1000 Diamond', nominal: 1000, price: 143500, commission: 5500 },
          { id: 'ff10', item: '2000 Diamond', nominal: 2000, price: 287500, commission: 11000 },
        ]
      },
      { 
        id: 'pubg', 
        name: 'PUBG Mobile', 
        icon: 'bx bx-target-lock text-yellow-600',
        fields: ['userId'],
        nominals: [
          { id: 'pubg1', item: '60 UC', nominal: 60, price: 15500, commission: 600 },
          { id: 'pubg2', item: '125 UC', nominal: 125, price: 30500, commission: 1200 },
          { id: 'pubg3', item: '250 UC', nominal: 250, price: 61500, commission: 2400 },
          { id: 'pubg4', item: '500 UC', nominal: 500, price: 122500, commission: 4800 },
          { id: 'pubg5', item: '750 UC', nominal: 750, price: 183500, commission: 7200 },
          { id: 'pubg6', item: '1000 UC', nominal: 1000, price: 245500, commission: 9600 },
          { id: 'pubg7', item: '1500 UC', nominal: 1500, price: 368500, commission: 14400 },
          { id: 'pubg8', item: '2000 UC', nominal: 2000, price: 491500, commission: 19200 },
        ]
      },
      { 
        id: 'genshin', 
        name: 'Genshin Impact', 
        icon: 'bx bxs-star text-yellow-400',
        fields: ['userId', 'serverId'],
        servers: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
        nominals: [
          { id: 'genshin1', item: '60 Genesis Crystal', nominal: 60, price: 16500, commission: 600 },
          { id: 'genshin2', item: '330 Genesis Crystal', nominal: 330, price: 82500, commission: 3200 },
          { id: 'genshin3', item: '1090 Genesis Crystal', nominal: 1090, price: 249500, commission: 9800 },
          { id: 'genshin4', item: '2240 Genesis Crystal', nominal: 2240, price: 499500, commission: 19600 },
          { id: 'genshin5', item: '3880 Genesis Crystal', nominal: 3880, price: 831500, commission: 32600 },
          { id: 'genshin6', item: '6560 Genesis Crystal', nominal: 6560, price: 1499500, commission: 58800 },
        ]
      },
      { 
        id: 'codm', 
        name: 'Call of Duty Mobile', 
        icon: 'bx bx-target-lock text-gray-700',
        fields: ['userId'],
        nominals: [
          { id: 'codm1', item: '35 CP', nominal: 35, price: 10500, commission: 400 },
          { id: 'codm2', item: '70 CP', nominal: 70, price: 20500, commission: 800 },
          { id: 'codm3', item: '210 CP', nominal: 210, price: 51500, commission: 2000 },
          { id: 'codm4', item: '420 CP', nominal: 420, price: 102500, commission: 4000 },
          { id: 'codm5', item: '700 CP', nominal: 700, price: 168500, commission: 6600 },
          { id: 'codm6', item: '1400 CP', nominal: 1400, price: 337500, commission: 13200 },
        ]
      },
      { 
        id: 'valorant', 
        name: 'Valorant', 
        icon: 'bx bx-game text-red-600',
        fields: ['riotId'],
        nominals: [
          { id: 'valorant1', item: '125 VP', nominal: 125, price: 15500, commission: 600 },
          { id: 'valorant2', item: '420 VP', nominal: 420, price: 51500, commission: 2000 },
          { id: 'valorant3', item: '700 VP', nominal: 700, price: 82500, commission: 3200 },
          { id: 'valorant4', item: '1375 VP', nominal: 1375, price: 153500, commission: 6000 },
          { id: 'valorant5', item: '2400 VP', nominal: 2400, price: 255500, commission: 10000 },
          { id: 'valorant6', item: '4000 VP', nominal: 4000, price: 409500, commission: 16000 },
        ]
      },
      { 
        id: 'roblox', 
        name: 'Roblox', 
        icon: 'bx bx-cube text-gray-600',
        fields: ['username'],
        nominals: [
          { id: 'roblox1', item: '80 Robux', nominal: 80, price: 12500, commission: 500 },
          { id: 'roblox2', item: '160 Robux', nominal: 160, price: 20500, commission: 800 },
          { id: 'roblox3', item: '240 Robux', nominal: 240, price: 30500, commission: 1200 },
          { id: 'roblox4', item: '400 Robux', nominal: 400, price: 50500, commission: 2000 },
          { id: 'roblox5', item: '800 Robux', nominal: 800, price: 100500, commission: 4000 },
          { id: 'roblox6', item: '1700 Robux', nominal: 1700, price: 203500, commission: 8000 },
        ]
      },
      { 
        id: 'steam', 
        name: 'Steam Wallet', 
        icon: 'bx bxs-hot text-blue-700',
        fields: ['steamId'],
        nominals: [
          { id: 'steam1', item: 'IDR 12.000', nominal: 12000, price: 13500, commission: 500 },
          { id: 'steam2', item: 'IDR 20.000', nominal: 20000, price: 21500, commission: 800 },
          { id: 'steam3', item: 'IDR 45.000', nominal: 45000, price: 47500, commission: 1800 },
          { id: 'steam4', item: 'IDR 60.000', nominal: 60000, price: 62500, commission: 2400 },
          { id: 'steam5', item: 'IDR 90.000', nominal: 90000, price: 93500, commission: 3600 },
          { id: 'steam6', item: 'IDR 120.000', nominal: 120000, price: 124500, commission: 4800 },
          { id: 'steam7', item: 'IDR 250.000', nominal: 250000, price: 257500, commission: 10000 },
          { id: 'steam8', item: 'IDR 400.000', nominal: 400000, price: 411500, commission: 16000 },
        ]
      },
      { 
        id: 'garena', 
        name: 'Garena', 
        icon: 'bx bxs-circle text-orange-600',
        fields: ['userId'],
        nominals: [
          { id: 'garena1', item: '33 Shell', nominal: 33, price: 10500, commission: 400 },
          { id: 'garena2', item: '66 Shell', nominal: 66, price: 20500, commission: 800 },
          { id: 'garena3', item: '165 Shell', nominal: 165, price: 51500, commission: 2000 },
          { id: 'garena4', item: '330 Shell', nominal: 330, price: 102500, commission: 4000 },
          { id: 'garena5', item: '660 Shell', nominal: 660, price: 204500, commission: 8000 },
        ]
      },
      { 
        id: 'higgs', 
        name: 'Higgs Domino', 
        icon: 'bx bx-diamond text-yellow-600',
        fields: ['userId'],
        nominals: [
          { id: 'higgs1', item: '50M Gold', nominal: 50000000, price: 10500, commission: 400 },
          { id: 'higgs2', item: '100M Gold', nominal: 100000000, price: 20500, commission: 800 },
          { id: 'higgs3', item: '200M Gold', nominal: 200000000, price: 40500, commission: 1600 },
          { id: 'higgs4', item: '400M Gold', nominal: 400000000, price: 81500, commission: 3200 },
          { id: 'higgs5', item: '700M Gold', nominal: 700000000, price: 143500, commission: 5600 },
          { id: 'higgs6', item: '1B Gold', nominal: 1000000000, price: 204500, commission: 8000 },
        ]
      },
      { 
        id: 'aov', 
        name: 'Arena of Valor', 
        icon: 'bx bx-shield text-blue-600',
        fields: ['userId'],
        nominals: [
          { id: 'aov1', item: '60 Voucher', nominal: 60, price: 15500, commission: 600 },
          { id: 'aov2', item: '125 Voucher', nominal: 125, price: 30500, commission: 1200 },
          { id: 'aov3', item: '250 Voucher', nominal: 250, price: 61500, commission: 2400 },
          { id: 'aov4', item: '500 Voucher', nominal: 500, price: 122500, commission: 4800 },
          { id: 'aov5', item: '1000 Voucher', nominal: 1000, price: 245500, commission: 9600 },
        ]
      },
      { 
        id: 'hago', 
        name: 'Hago', 
        icon: 'bx bx-joystick text-purple-600',
        fields: ['userId'],
        nominals: [
          { id: 'hago1', item: '50 Diamond', nominal: 50, price: 10500, commission: 400 },
          { id: 'hago2', item: '100 Diamond', nominal: 100, price: 20500, commission: 800 },
          { id: 'hago3', item: '200 Diamond', nominal: 200, price: 40500, commission: 1600 },
          { id: 'hago4', item: '500 Diamond', nominal: 500, price: 102500, commission: 4000 },
        ]
      },
    ],
  },
  
  // PDAM regions
  pdamRegions: [
    { id: 'pam_jaya', name: 'PAM Jaya - DKI Jakarta' },
    { id: 'pdam_bandung', name: 'PDAM Tirtawening - Kota Bandung' },
    { id: 'pdam_surabaya', name: 'PDAM Surya Sembada - Surabaya' },
    { id: 'pdam_semarang', name: 'PDAM Tirta Moedal - Semarang' },
    { id: 'pdam_medan', name: 'PDAM Tirtanadi - Medan' },
    { id: 'pdam_palembang', name: 'PDAM Tirta Musi - Palembang' },
    { id: 'pdam_makassar', name: 'PDAM Makassar' },
    { id: 'pdam_denpasar', name: 'PDAM Denpasar' },
    { id: 'pdam_yogyakarta', name: 'PDAM Tirta Marta - Yogyakarta' },
    { id: 'pdam_malang', name: 'PDAM Kota Malang' },
  ],

  // Pascabayar providers
  pascabayarProviders: {
    telepon: [
      { id: 'telkom', name: 'Telkom', icon: 'bx bx-phone text-red-600' },
    ],
    internet: [
      { id: 'indihome', name: 'IndiHome', icon: 'bx bx-wifi text-red-600' },
      { id: 'biznet', name: 'Biznet', icon: 'bx bx-wifi text-blue-600' },
      { id: 'myrepublic', name: 'MyRepublic', icon: 'bx bx-wifi text-purple-600' },
      { id: 'firstmedia', name: 'First Media', icon: 'bx bx-wifi text-orange-600' },
    ],
    tv: [
      { id: 'transvision', name: 'TransVision', icon: 'bx bx-tv text-blue-600' },
      { id: 'kvision', name: 'K-Vision', icon: 'bx bx-tv text-green-600' },
      { id: 'nexmedia', name: 'Nexmedia', icon: 'bx bx-tv text-purple-600' },
      { id: 'mnc_vision', name: 'MNC Vision', icon: 'bx bx-tv text-red-600' },
    ],
  },

  // Mock customer data
  mockCustomers: {
    pulsa: [
      { phone: '081234567890', name: 'Budi Santoso', operator: 'telkomsel' },
      { phone: '085612345678', name: 'Siti Aminah', operator: 'indosat' },
      { phone: '087712345678', name: 'Ahmad Yani', operator: 'xl' },
    ],
    listrik: [
      { meterId: '12345678901', name: 'Budi Santoso', address: 'Jl. Sudirman No. 123', tariff: 'R1/900VA' },
      { meterId: '98765432109', name: 'Siti Aminah', address: 'Jl. Thamrin No. 456', tariff: 'R1/1300VA' },
      { meterId: '11122233344', name: 'Ahmad Yani', address: 'Jl. Gatot Subroto No. 789', tariff: 'R1/2200VA' },
    ],
    pdam: [
      { customerId: '123456789', name: 'Budi Santoso', address: 'Jl. Sudirman No. 123, Jakarta', region: 'pam_jaya', period: 'Oktober 2025', usage: '15 m³', bill: 125000, adminFee: 2500 },
      { customerId: '987654321', name: 'Siti Aminah', address: 'Jl. Braga No. 45, Bandung', region: 'pdam_bandung', period: 'Oktober 2025', usage: '20 m³', bill: 180000, adminFee: 2500 },
      { customerId: '555666777', name: 'Ahmad Yani', address: 'Jl. Tunjungan No. 88, Surabaya', region: 'pdam_surabaya', period: 'Oktober 2025', usage: '12 m³', bill: 95000, adminFee: 2500 },
      { customerId: '111222333', name: 'Dewi Lestari', address: 'Jl. Pemuda No. 12, Semarang', region: 'pdam_semarang', period: 'Oktober 2025', usage: '18 m³', bill: 150000, adminFee: 2500 },
      { customerId: '444555666', name: 'Eko Prasetyo', address: 'Jl. Gatot Subroto No. 67, Medan', region: 'pdam_medan', period: 'Oktober 2025', usage: '25 m³', bill: 220000, adminFee: 2500 },
    ],
    pascabayar: [
      { customerId: '021123456', name: 'Budi Santoso', address: 'Jl. Sudirman No. 123, Jakarta', provider: 'telkom', type: 'telepon', period: 'Oktober 2025', bill: 125000, adminFee: 2500 },
      { customerId: '1234567890', name: 'Siti Aminah', address: 'Jl. Thamrin No. 456, Jakarta', provider: 'indihome', type: 'internet', period: 'Oktober 2025', package: 'Paket 30 Mbps', bill: 350000, adminFee: 2500 },
      { customerId: '0987654321', name: 'Ahmad Yani', address: 'Jl. Gatot Subroto No. 789, Jakarta', provider: 'biznet', type: 'internet', period: 'Oktober 2025', package: 'Paket 50 Mbps', bill: 450000, adminFee: 2500 },
      { customerId: '5551234567', name: 'Dewi Lestari', address: 'Jl. Asia Afrika No. 22, Bandung', provider: 'transvision', type: 'tv', period: 'Oktober 2025', package: 'Paket Premium', bill: 250000, adminFee: 2500 },
      { customerId: '7778889990', name: 'Eko Prasetyo', address: 'Jl. Malioboro No. 45, Yogyakarta', provider: 'firstmedia', type: 'internet', period: 'Oktober 2025', package: 'Paket 100 Mbps', bill: 550000, adminFee: 2500 },
    ],
    bpjs: [
      { cardNumber: '0001234567890', name: 'Budi Santoso', familyMembers: 4, class: '1', monthlyFee: 150000, period: 'Oktober 2025', bill: 600000, adminFee: 2500 },
      { cardNumber: '0009876543210', name: 'Siti Aminah', familyMembers: 3, class: '2', monthlyFee: 100000, period: 'Oktober 2025', bill: 300000, adminFee: 2500 },
      { cardNumber: '0005556667777', name: 'Ahmad Yani', familyMembers: 5, class: '3', monthlyFee: 42000, period: 'Oktober 2025', bill: 210000, adminFee: 2500 },
      { cardNumber: '0001112223333', name: 'Dewi Lestari', familyMembers: 2, class: '2', monthlyFee: 100000, period: 'Oktober 2025', bill: 200000, adminFee: 2500 },
      { cardNumber: '0004445556666', name: 'Eko Prasetyo', familyMembers: 1, class: '1', monthlyFee: 150000, period: 'Oktober 2025', bill: 150000, adminFee: 2500 },
    ],
  },
  
  // Actions
  detectOperator: (phoneNumber) => {
    const { operators } = usePPOBProductStore.getState();
    const prefix = phoneNumber.substring(0, 4);
    
    for (const [key, operator] of Object.entries(operators)) {
      if (operator.prefix.includes(prefix)) {
        return { key, ...operator };
      }
    }
    return null;
  },
  
  getProductsByCategory: (category) => {
    const { products } = usePPOBProductStore.getState();
    return products[category] || [];
  },
  
  getMockCustomer: (type, identifier) => {
    const { mockCustomers } = usePPOBProductStore.getState();
    if (type === 'pulsa') {
      return mockCustomers.pulsa.find(c => c.phone === identifier);
    } else if (type === 'listrik') {
      return mockCustomers.listrik.find(c => c.meterId === identifier);
    } else if (type === 'pdam') {
      return mockCustomers.pdam.find(c => c.customerId === identifier);
    } else if (type === 'pascabayar') {
      return mockCustomers.pascabayar.find(c => c.customerId === identifier);
    } else if (type === 'bpjs') {
      return mockCustomers.bpjs.find(c => c.cardNumber === identifier);
    }
    return null;
  },
}));

export { usePPOBProductStore };
