const COMPONENTS = {
  case: [
    {
      id: 'case-1', brand: 'Corsair', name: '4000D Airflow ATX', price: 104.99,
      specs: ['ATX Mid Tower', 'Mesh Front Panel', '3x 120mm Fans', 'USB 3.1 Type-C'],
      supportedFormFactors: ['ATX', 'mATX', 'ITX'],
    },
    {
      id: 'case-2', brand: 'Corsair', name: '5000X RGB ATX', price: 189.99,
      specs: ['ATX Full Tower', '4x 120mm ARGB Fans', 'Tempered Glass', 'USB 3.1 Type-C'],
      supportedFormFactors: ['ATX', 'mATX', 'ITX'],
    },
    {
      id: 'case-3', brand: 'NZXT', name: 'H5 Flow', price: 94.99,
      specs: ['ATX Mid Tower', 'Dual Mesh Panels', '2x 120mm Fans', 'USB 3.2 Type-C'],
      supportedFormFactors: ['ATX', 'mATX'],
    },
    {
      id: 'case-4', brand: 'Fractal Design', name: 'North ATX', price: 109.99,
      specs: ['ATX Mid Tower', 'Mesh + Wood Front', '2x 140mm Fans', 'USB-C 3.2'],
      supportedFormFactors: ['ATX', 'mATX'],
    },
    {
      id: 'case-5', brand: 'Lian Li', name: 'Lancool 216 ATX', price: 94.99,
      specs: ['ATX Mid Tower', 'Full Mesh Panels', '2x 160mm Fans', 'USB 3.1 Type-C'],
      supportedFormFactors: ['ATX', 'mATX', 'ITX'],
    },
    {
      id: 'case-6', brand: 'be quiet!', name: 'Pure Base 500DX', price: 99.99,
      specs: ['ATX Mid Tower', 'ARGB Top Strip', '3x 140mm Fans', 'USB 3.0 Type-C'],
      supportedFormFactors: ['ATX', 'mATX'],
    },
  ],

  cpu: [
    {
      id: 'cpu-1', brand: 'AMD', name: 'Ryzen 5 7600X', price: 229.99,
      specs: ['6 Cores / 12 Threads', 'AM5 Socket', '5.3 GHz Boost', '105W TDP'],
      socket: 'AM5', tdp: 105,
    },
    {
      id: 'cpu-2', brand: 'AMD', name: 'Ryzen 7 7700X', price: 299.99,
      specs: ['8 Cores / 16 Threads', 'AM5 Socket', '5.4 GHz Boost', '105W TDP'],
      socket: 'AM5', tdp: 105,
    },
    {
      id: 'cpu-3', brand: 'AMD', name: 'Ryzen 9 7900X', price: 449.99,
      specs: ['12 Cores / 24 Threads', 'AM5 Socket', '5.6 GHz Boost', '170W TDP'],
      socket: 'AM5', tdp: 170,
    },
    {
      id: 'cpu-4', brand: 'Intel', name: 'Core i5-14600K', price: 289.99,
      specs: ['14 Cores / 20 Threads', 'LGA1700 Socket', '5.3 GHz Boost', '125W TDP'],
      socket: 'LGA1700', tdp: 125,
    },
    {
      id: 'cpu-5', brand: 'Intel', name: 'Core i7-14700K', price: 409.99,
      specs: ['20 Cores / 28 Threads', 'LGA1700 Socket', '5.6 GHz Boost', '125W TDP'],
      socket: 'LGA1700', tdp: 125,
    },
    {
      id: 'cpu-6', brand: 'Intel', name: 'Core i9-14900K', price: 549.99,
      specs: ['24 Cores / 32 Threads', 'LGA1700 Socket', '6.0 GHz Boost', '125W TDP'],
      socket: 'LGA1700', tdp: 125,
    },
  ],

  cooler: [
    {
      id: 'cooler-1', brand: 'Noctua', name: 'NH-D15', price: 99.99,
      specs: ['Dual Tower Air', '2x 140mm Fans', 'Up to 250W TDP', 'Ultra Quiet'],
      type: 'air', maxTdp: 250,
    },
    {
      id: 'cooler-2', brand: 'be quiet!', name: 'Dark Rock Pro 4', price: 89.99,
      specs: ['Dual Tower Air', '3x 120mm Silent Wings', 'Up to 250W TDP'],
      type: 'air', maxTdp: 250,
    },
    {
      id: 'cooler-3', brand: 'Corsair', name: 'H100i Elite Capellix', price: 149.99,
      specs: ['240mm AIO', '2x 120mm ARGB', 'Up to 300W TDP', 'LCD Pump Head'],
      type: 'aio', maxTdp: 300,
    },
    {
      id: 'cooler-4', brand: 'Corsair', name: 'H150i Elite Capellix', price: 179.99,
      specs: ['360mm AIO', '3x 120mm ARGB', 'Up to 350W TDP', 'LCD Pump Head'],
      type: 'aio', maxTdp: 350,
    },
    {
      id: 'cooler-5', brand: 'DeepCool', name: 'AK620', price: 54.99,
      specs: ['Dual Tower Air', '2x 120mm Fans', 'Up to 260W TDP', 'Budget Pick'],
      type: 'air', maxTdp: 260,
    },
  ],

  motherboard: [
    {
      id: 'mb-1', brand: 'ASUS', name: 'ROG Strix B650-A Gaming', price: 279.99,
      specs: ['AM5 Socket', 'ATX', 'DDR5', 'PCIe 5.0', '2.5G LAN'],
      socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5',
    },
    {
      id: 'mb-2', brand: 'MSI', name: 'MAG B650 TOMAHAWK WIFI', price: 219.99,
      specs: ['AM5 Socket', 'ATX', 'DDR5', 'PCIe 5.0', 'WiFi 6E'],
      socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5',
    },
    {
      id: 'mb-3', brand: 'Gigabyte', name: 'B650 AORUS Elite AX', price: 239.99,
      specs: ['AM5 Socket', 'ATX', 'DDR5', 'PCIe 5.0', 'WiFi 6E'],
      socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5',
    },
    {
      id: 'mb-4', brand: 'ASUS', name: 'ROG Strix Z790-E Gaming', price: 349.99,
      specs: ['LGA1700 Socket', 'ATX', 'DDR5', 'PCIe 5.0', 'Thunderbolt 4'],
      socket: 'LGA1700', formFactor: 'ATX', ramType: 'DDR5',
    },
    {
      id: 'mb-5', brand: 'MSI', name: 'MAG Z790 TOMAHAWK WIFI', price: 299.99,
      specs: ['LGA1700 Socket', 'ATX', 'DDR5', 'PCIe 5.0', 'WiFi 6E'],
      socket: 'LGA1700', formFactor: 'ATX', ramType: 'DDR5',
    },
    {
      id: 'mb-6', brand: 'Gigabyte', name: 'Z790 AORUS Master', price: 419.99,
      specs: ['LGA1700 Socket', 'ATX', 'DDR5', 'PCIe 5.0', 'USB4 40Gbps'],
      socket: 'LGA1700', formFactor: 'ATX', ramType: 'DDR5',
    },
  ],

  ram: [
    {
      id: 'ram-1', brand: 'Corsair', name: 'Vengeance 32GB DDR5-6000', price: 119.99,
      specs: ['32GB (2×16GB)', 'DDR5-6000', 'CL30', 'EXPO / XMP 3.0'],
      ramType: 'DDR5',
    },
    {
      id: 'ram-2', brand: 'G.Skill', name: 'Trident Z5 RGB 32GB DDR5-6400', price: 139.99,
      specs: ['32GB (2×16GB)', 'DDR5-6400', 'CL32', 'XMP 3.0', 'ARGB'],
      ramType: 'DDR5',
    },
    {
      id: 'ram-3', brand: 'Kingston', name: 'Fury Beast 32GB DDR5-5200', price: 109.99,
      specs: ['32GB (2×16GB)', 'DDR5-5200', 'CL40', 'EXPO / XMP 3.0'],
      ramType: 'DDR5',
    },
    {
      id: 'ram-4', brand: 'Corsair', name: 'Dominator Platinum 64GB DDR5-6000', price: 219.99,
      specs: ['64GB (2×32GB)', 'DDR5-6000', 'CL30', 'XMP 3.0', 'ARGB'],
      ramType: 'DDR5',
    },
    {
      id: 'ram-5', brand: 'G.Skill', name: 'Ripjaws S5 32GB DDR5-6000', price: 114.99,
      specs: ['32GB (2×16GB)', 'DDR5-6000', 'CL32', 'XMP 3.0'],
      ramType: 'DDR5',
    },
  ],

  gpu: [
    {
      id: 'gpu-1', brand: 'NVIDIA', name: 'GeForce RTX 4060 Ti 8GB', price: 399.99,
      specs: ['8GB GDDR6', '165W TDP', 'PCIe 4.0 ×16', 'DLSS 3', '1080p / 1440p'],
      tdp: 165,
    },
    {
      id: 'gpu-2', brand: 'NVIDIA', name: 'GeForce RTX 4070 12GB', price: 599.99,
      specs: ['12GB GDDR6X', '200W TDP', 'PCIe 4.0 ×16', 'DLSS 3', '1440p'],
      tdp: 200,
    },
    {
      id: 'gpu-3', brand: 'NVIDIA', name: 'GeForce RTX 4070 Super 12GB', price: 599.99,
      specs: ['12GB GDDR6X', '220W TDP', 'PCIe 4.0 ×16', 'DLSS 3', '1440p / 4K'],
      tdp: 220,
    },
    {
      id: 'gpu-4', brand: 'NVIDIA', name: 'GeForce RTX 4080 Super 16GB', price: 999.99,
      specs: ['16GB GDDR6X', '320W TDP', 'PCIe 4.0 ×16', 'DLSS 3', '4K'],
      tdp: 320,
    },
    {
      id: 'gpu-5', brand: 'NVIDIA', name: 'GeForce RTX 4090 24GB', price: 1799.99,
      specs: ['24GB GDDR6X', '450W TDP', 'PCIe 4.0 ×16', 'DLSS 3', '4K Ultra'],
      tdp: 450,
    },
    {
      id: 'gpu-6', brand: 'AMD', name: 'Radeon RX 7800 XT 16GB', price: 499.99,
      specs: ['16GB GDDR6', '263W TDP', 'PCIe 4.0 ×16', 'FSR 3', '1440p'],
      tdp: 263,
    },
    {
      id: 'gpu-7', brand: 'AMD', name: 'Radeon RX 7900 GRE 16GB', price: 549.99,
      specs: ['16GB GDDR6', '260W TDP', 'PCIe 4.0 ×16', 'FSR 3', '1440p / 4K'],
      tdp: 260,
    },
  ],

  storage: [
    {
      id: 'storage-1', brand: 'Samsung', name: '990 Pro 1TB NVMe M.2', price: 109.99,
      specs: ['1TB', 'PCIe 4.0 NVMe', '7 450 MB/s Read', '6 900 MB/s Write'],
    },
    {
      id: 'storage-2', brand: 'Samsung', name: '990 Pro 2TB NVMe M.2', price: 199.99,
      specs: ['2TB', 'PCIe 4.0 NVMe', '7 450 MB/s Read', '6 900 MB/s Write'],
    },
    {
      id: 'storage-3', brand: 'WD', name: 'Black SN850X 1TB NVMe M.2', price: 99.99,
      specs: ['1TB', 'PCIe 4.0 NVMe', '7 300 MB/s Read', '6 600 MB/s Write'],
    },
    {
      id: 'storage-4', brand: 'Seagate', name: 'FireCuda 530 2TB NVMe M.2', price: 149.99,
      specs: ['2TB', 'PCIe 4.0 NVMe', '7 300 MB/s Read', '6 900 MB/s Write'],
    },
    {
      id: 'storage-5', brand: 'Crucial', name: 'P3 Plus 2TB NVMe M.2', price: 89.99,
      specs: ['2TB', 'PCIe 4.0 NVMe', '5 000 MB/s Read', '4 200 MB/s Write', 'Budget'],
    },
  ],

  psu: [
    {
      id: 'psu-1', brand: 'Corsair', name: 'RM750e 750W 80+ Gold', price: 99.99,
      specs: ['750W', '80+ Gold', 'Fully Modular', 'ATX 3.0', 'Zero RPM Mode'],
      wattage: 750,
    },
    {
      id: 'psu-2', brand: 'Corsair', name: 'RM850e 850W 80+ Gold', price: 119.99,
      specs: ['850W', '80+ Gold', 'Fully Modular', 'ATX 3.0', 'Zero RPM Mode'],
      wattage: 850,
    },
    {
      id: 'psu-3', brand: 'EVGA', name: 'SuperNOVA 850 G6 80+ Gold', price: 129.99,
      specs: ['850W', '80+ Gold', 'Fully Modular', '10 Year Warranty'],
      wattage: 850,
    },
    {
      id: 'psu-4', brand: 'be quiet!', name: 'Straight Power 11 1000W Platinum', price: 179.99,
      specs: ['1000W', '80+ Platinum', 'Fully Modular', 'Silent Wings Fan'],
      wattage: 1000,
    },
    {
      id: 'psu-5', brand: 'Seasonic', name: 'Focus GX-750 750W 80+ Gold', price: 109.99,
      specs: ['750W', '80+ Gold', 'Fully Modular', '10 Year Warranty', 'Hybrid Fan'],
      wattage: 750,
    },
  ],
};
