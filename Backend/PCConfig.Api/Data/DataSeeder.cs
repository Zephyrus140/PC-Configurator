using System.Text.Json;
using PCConfig.Api.Models;

namespace PCConfig.Api.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Categories.Any()) return;

        var categories = new[]
        {
            new Category { Slug = "cpu",         Name = "Процессор",           Icon = "bi-cpu",              SortOrder = 1 },
            new Category { Slug = "motherboard", Name = "Материнская плата",   Icon = "bi-motherboard",      SortOrder = 2 },
            new Category { Slug = "ram",         Name = "Оперативная память",  Icon = "bi-memory",           SortOrder = 3 },
            new Category { Slug = "gpu",         Name = "Видеокарта",          Icon = "bi-gpu-card",         SortOrder = 4 },
            new Category { Slug = "storage",     Name = "Накопитель",          Icon = "bi-device-ssd",       SortOrder = 5 },
            new Category { Slug = "psu",         Name = "Блок питания",        Icon = "bi-lightning-charge", SortOrder = 6 },
            new Category { Slug = "cooler",      Name = "Охлаждение CPU",      Icon = "bi-wind",             SortOrder = 7 },
            new Category { Slug = "case",        Name = "Корпус",              Icon = "bi-pc-display",       SortOrder = 8 },
        };

        db.Categories.AddRange(categories);
        await db.SaveChangesAsync();

        var cat = categories.ToDictionary(c => c.Slug, c => c.Id);

        var components = new List<Component>
        {
            // ── CPUs ───────────────────────────────────────────────────────────────

            // Budget AM4
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 5600",    Price = 109.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM4 Socket","3.5 / 4.4 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM4",     Tdp = 65,  Image = "img/cpu/cpu-1.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 5600X",   Price = 129.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM4 Socket","3.7 / 4.6 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM4",     Tdp = 65,  Image = "img/cpu/cpu-2.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 5700X",   Price = 149.99m,
                SpecsJson = S("8 ядер / 16 потоков","AM4 Socket","3.4 / 4.6 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM4",     Tdp = 65,  Image = "img/cpu/cpu-3.png" },

            // Budget Intel LGA1700
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i3-14100F",  Price = 109.99m,
                SpecsJson = S("4 ядра / 8 потоков","LGA1700 Socket","3.5 / 4.7 GHz","58W TDP","No iGPU"),
                Socket = "LGA1700", Tdp = 58,  Image = "img/cpu/cpu-4.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-13400F",  Price = 159.99m,
                SpecsJson = S("10 ядер / 16 потоков","LGA1700 Socket","2.5 / 4.6 GHz","65W TDP","No iGPU"),
                Socket = "LGA1700", Tdp = 65,  Image = "img/cpu/cpu-5.png" },

            // Budget AM5
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 7500F",   Price = 149.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM5 Socket","3.7 / 5.0 GHz","65W TDP","No iGPU"),
                Socket = "AM5",     Tdp = 65,  Image = "img/cpu/cpu-6.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 7600",    Price = 179.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM5 Socket","3.8 / 5.1 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM5",     Tdp = 65,  Image = "img/cpu/cpu-7.png" },

            // Mid-range
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 7600X",   Price = 229.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM5 Socket","4.7 / 5.3 GHz","105W TDP","32MB L3 Cache"),
                Socket = "AM5",     Tdp = 105, Image = "img/cpu/cpu-8.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-14600K",  Price = 289.99m,
                SpecsJson = S("14 ядер / 20 потоков","LGA1700 Socket","3.5 / 5.3 GHz","125W TDP","24MB L3 Cache"),
                Socket = "LGA1700", Tdp = 125, Image = "img/cpu/cpu-9.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 7700X",   Price = 299.99m,
                SpecsJson = S("8 ядер / 16 потоков","AM5 Socket","4.5 / 5.4 GHz","105W TDP","32MB L3 Cache"),
                Socket = "AM5",     Tdp = 105, Image = "img/cpu/cpu-10.png" },

            // High-end gaming
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 7800X3D", Price = 389.99m,
                SpecsJson = S("8 ядер / 16 потоков","AM5 Socket","4.5 / 5.0 GHz","120W TDP","96MB 3D V-Cache"),
                Socket = "AM5",     Tdp = 120, Image = "img/cpu/cpu-11.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i7-14700K",  Price = 409.99m,
                SpecsJson = S("20 ядер / 28 потоков","LGA1700 Socket","3.4 / 5.6 GHz","125W TDP","33MB L3 Cache"),
                Socket = "LGA1700", Tdp = 125, Image = "img/cpu/cpu-12.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 7900X",   Price = 449.99m,
                SpecsJson = S("12 ядер / 24 потока","AM5 Socket","4.7 / 5.6 GHz","170W TDP","64MB L3 Cache"),
                Socket = "AM5",     Tdp = 170, Image = "img/cpu/cpu-13.png" },

            // Extreme
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i9-14900K",  Price = 549.99m,
                SpecsJson = S("24 ядра / 32 потока","LGA1700 Socket","3.2 / 6.0 GHz","125W TDP","36MB L3 Cache"),
                Socket = "LGA1700", Tdp = 125, Image = "img/cpu/cpu-14.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 7950X",   Price = 549.99m,
                SpecsJson = S("16 ядер / 32 потока","AM5 Socket","4.5 / 5.7 GHz","170W TDP","64MB L3 Cache"),
                Socket = "AM5",     Tdp = 170, Image = "img/cpu/cpu-15.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 7950X3D", Price = 699.99m,
                SpecsJson = S("16 ядер / 32 потока","AM5 Socket","4.2 / 5.7 GHz","120W TDP","128MB 3D V-Cache"),
                Socket = "AM5",     Tdp = 120, Image = "img/cpu/cpu-16.png" },

            // Additional AM4
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 5500",       Price = 79.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM4 Socket","3.6 / 4.2 GHz","65W TDP","16MB L3 Cache"),
                Socket = "AM4",     Tdp = 65,  Image = "img/cpu/cpu-17.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 5800X3D",    Price = 249.99m,
                SpecsJson = S("8 ядер / 16 потоков","AM4 Socket","3.4 / 4.5 GHz","105W TDP","96MB 3D V-Cache"),
                Socket = "AM4",     Tdp = 105, Image = "img/cpu/cpu-18.png" },

            // Additional Intel LGA1700
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i3-12100F",     Price = 79.99m,
                SpecsJson = S("4 ядра / 8 потоков","LGA1700 Socket","3.3 / 4.3 GHz","58W TDP","12MB L3 Cache"),
                Socket = "LGA1700", Tdp = 58,  Image = "img/cpu/cpu-19.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-12400F",     Price = 129.99m,
                SpecsJson = S("6 ядер / 12 потоков","LGA1700 Socket","2.5 / 4.4 GHz","65W TDP","18MB L3 Cache"),
                Socket = "LGA1700", Tdp = 65,  Image = "img/cpu/cpu-20.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-14400F",     Price = 169.99m,
                SpecsJson = S("10 ядер / 16 потоков","LGA1700 Socket","2.5 / 4.7 GHz","65W TDP","20MB L3 Cache"),
                Socket = "LGA1700", Tdp = 65,  Image = "img/cpu/cpu-21.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i7-13700KF",    Price = 339.99m,
                SpecsJson = S("16 ядер / 24 потока","LGA1700 Socket","3.4 / 5.4 GHz","125W TDP","30MB L3 Cache"),
                Socket = "LGA1700", Tdp = 125, Image = "img/cpu/cpu-22.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i9-13900K",     Price = 449.99m,
                SpecsJson = S("24 ядра / 32 потока","LGA1700 Socket","3.0 / 5.8 GHz","125W TDP","36MB L3 Cache"),
                Socket = "LGA1700", Tdp = 125, Image = "img/cpu/cpu-23.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i9-14900KS",    Price = 589.99m,
                SpecsJson = S("24 ядра / 32 потока","LGA1700 Socket","3.2 / 6.2 GHz","150W TDP","36MB L3 Cache"),
                Socket = "LGA1700", Tdp = 150, Image = "img/cpu/cpu-24.png" },

            // Additional AM5 Ryzen 7000
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 7700",       Price = 269.99m,
                SpecsJson = S("8 ядер / 16 потоков","AM5 Socket","3.8 / 5.3 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM5",     Tdp = 65,  Image = "img/cpu/cpu-25.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 7900",       Price = 349.99m,
                SpecsJson = S("12 ядер / 24 потока","AM5 Socket","3.7 / 5.4 GHz","65W TDP","64MB L3 Cache"),
                Socket = "AM5",     Tdp = 65,  Image = "img/cpu/cpu-26.png" },

            // Ryzen 9000 (Zen 5, AM5)
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 9600X",      Price = 249.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM5 Socket","3.9 / 5.4 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM5",     Tdp = 65,  Image = "img/cpu/cpu-27.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 9700X",      Price = 319.99m,
                SpecsJson = S("8 ядер / 16 потоков","AM5 Socket","3.8 / 5.5 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM5",     Tdp = 65,  Image = "img/cpu/cpu-28.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 9800X3D",    Price = 449.99m,
                SpecsJson = S("8 ядер / 16 потоков","AM5 Socket","4.7 / 5.2 GHz","120W TDP","96MB 3D V-Cache"),
                Socket = "AM5",     Tdp = 120, Image = "img/cpu/cpu-29.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 9900X",      Price = 399.99m,
                SpecsJson = S("12 ядер / 24 потока","AM5 Socket","4.4 / 5.6 GHz","120W TDP","64MB L3 Cache"),
                Socket = "AM5",     Tdp = 120, Image = "img/cpu/cpu-30.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 9950X",      Price = 549.99m,
                SpecsJson = S("16 ядер / 32 потока","AM5 Socket","4.3 / 5.7 GHz","170W TDP","64MB L3 Cache"),
                Socket = "AM5",     Tdp = 170, Image = "img/cpu/cpu-31.png" },

            // LGA1151 (Coffee Lake Refresh)
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i3-9100F",      Price = 69.99m,
                SpecsJson = S("4 ядра / 4 потока","LGA1151 Socket","3.6 / 4.2 GHz","65W TDP","6MB L3 Cache"),
                Socket = "LGA1151", Tdp = 65,  Image = "img/cpu/cpu-32.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-9400F",      Price = 99.99m,
                SpecsJson = S("6 ядер / 6 потоков","LGA1151 Socket","2.9 / 4.1 GHz","65W TDP","9MB L3 Cache"),
                Socket = "LGA1151", Tdp = 65,  Image = "img/cpu/cpu-33.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-9600K",      Price = 139.99m,
                SpecsJson = S("6 ядер / 6 потоков","LGA1151 Socket","3.7 / 4.6 GHz","95W TDP","9MB L3 Cache"),
                Socket = "LGA1151", Tdp = 95,  Image = "img/cpu/cpu-34.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i7-9700K",      Price = 219.99m,
                SpecsJson = S("8 ядер / 8 потоков","LGA1151 Socket","3.6 / 4.9 GHz","95W TDP","12MB L3 Cache"),
                Socket = "LGA1151", Tdp = 95,  Image = "img/cpu/cpu-35.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i9-9900K",      Price = 289.99m,
                SpecsJson = S("8 ядер / 16 потоков","LGA1151 Socket","3.6 / 5.0 GHz","95W TDP","16MB L3 Cache"),
                Socket = "LGA1151", Tdp = 95,  Image = "img/cpu/cpu-36.png" },

            // LGA1851 (Arrow Lake, Core Ultra 200)
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core Ultra 5 245K",  Price = 309.99m,
                SpecsJson = S("14 ядер / 14 потоков","LGA1851 Socket","3.6 / 5.2 GHz","125W TDP","24MB L3 Cache"),
                Socket = "LGA1851", Tdp = 125, Image = "img/cpu/cpu-37.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core Ultra 7 265K",  Price = 394.99m,
                SpecsJson = S("20 ядер / 20 потоков","LGA1851 Socket","3.9 / 5.5 GHz","125W TDP","30MB L3 Cache"),
                Socket = "LGA1851", Tdp = 125, Image = "img/cpu/cpu-38.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core Ultra 9 285K",  Price = 589.99m,
                SpecsJson = S("24 ядра / 24 потока","LGA1851 Socket","3.7 / 5.7 GHz","125W TDP","36MB L3 Cache"),
                Socket = "LGA1851", Tdp = 125, Image = "img/cpu/cpu-39.png" },

            // Additional AM4
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 3 3300X",      Price = 74.99m,
                SpecsJson = S("4 ядра / 8 потоков","AM4 Socket","3.8 / 4.3 GHz","65W TDP","16MB L3 Cache"),
                Socket = "AM4",     Tdp = 65,  Image = "img/cpu/cpu-40.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 3600",       Price = 94.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM4 Socket","3.6 / 4.2 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM4",     Tdp = 65,  Image = "img/cpu/cpu-41.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 5900X",      Price = 264.99m,
                SpecsJson = S("12 ядер / 24 потока","AM4 Socket","3.7 / 4.8 GHz","105W TDP","64MB L3 Cache"),
                Socket = "AM4",     Tdp = 105, Image = "img/cpu/cpu-42.png" },

            // Additional LGA1700
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-13600K",     Price = 259.99m,
                SpecsJson = S("14 ядер / 20 потоков","LGA1700 Socket","3.5 / 5.1 GHz","125W TDP","24MB L3 Cache"),
                Socket = "LGA1700", Tdp = 125, Image = "img/cpu/cpu-43.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i7-12700K",     Price = 299.99m,
                SpecsJson = S("12 ядер / 20 потоков","LGA1700 Socket","3.6 / 5.0 GHz","125W TDP","25MB L3 Cache"),
                Socket = "LGA1700", Tdp = 125, Image = "img/cpu/cpu-44.png" },

            // Additional AM5
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 9600",       Price = 219.99m,
                SpecsJson = S("6 ядер / 12 потоков","AM5 Socket","3.9 / 5.3 GHz","65W TDP","32MB L3 Cache"),
                Socket = "AM5",     Tdp = 65,  Image = "img/cpu/cpu-45.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 9950X3D",    Price = 699.99m,
                SpecsJson = S("16 ядер / 32 потока","AM5 Socket","4.3 / 5.7 GHz","170W TDP","128MB 3D V-Cache"),
                Socket = "AM5",     Tdp = 170, Image = "img/cpu/cpu-46.png" },

            // Intel LGA2066 (HEDT)
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i9-9900X",      Price = 499.99m,
                SpecsJson = S("10 ядер / 20 потоков","LGA2066 Socket","3.5 / 4.4 GHz","165W TDP","19.25MB L3 Cache"),
                Socket = "LGA2066", Tdp = 165, Image = "img/cpu/cpu-47.png" },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i9-10980XE",    Price = 849.99m,
                SpecsJson = S("18 ядер / 36 потоков","LGA2066 Socket","3.0 / 4.6 GHz","165W TDP","24.75MB L3 Cache"),
                Socket = "LGA2066", Tdp = 165, Image = "img/cpu/cpu-48.png" },

            // AMD TRX40 (Threadripper, HEDT)
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Threadripper 3960X", Price = 1149.99m,
                SpecsJson = S("24 ядра / 48 потоков","TRX40 Socket","3.8 / 4.5 GHz","280W TDP","128MB L3 Cache"),
                Socket = "TRX40",   Tdp = 280, Image = "img/cpu/cpu-49.png" },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Threadripper 3970X", Price = 1549.99m,
                SpecsJson = S("32 ядра / 64 потока","TRX40 Socket","3.7 / 4.5 GHz","280W TDP","128MB L3 Cache"),
                Socket = "TRX40",   Tdp = 280, Image = "img/cpu/cpu-50.png" },

            // ── Motherboards ───────────────────────────────────────────────────

            // AM4 / DDR4
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "PRIME B550-PLUS",           Price = 109.99m,
                SpecsJson = S("AM4 Socket","ATX","DDR4 до 4400MHz","PCIe 4.0","2x M.2","USB 3.2"),
                Socket = "AM4",     FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-1.png" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MAG B550 TOMAHAWK",         Price = 129.99m,
                SpecsJson = S("AM4 Socket","ATX","DDR4 до 4866MHz","PCIe 4.0","2x M.2","2.5G LAN"),
                Socket = "AM4",     FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-2.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "B550 AORUS Elite V2",       Price = 149.99m,
                SpecsJson = S("AM4 Socket","ATX","DDR4 до 5100MHz","PCIe 4.0","2x M.2","WiFi 6"),
                Socket = "AM4",     FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-3.png" },

            // AM5 / DDR5 — Budget
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "PRO B650-S WiFi",           Price = 149.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 6400MHz","PCIe 5.0","2x M.2","WiFi 6E"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-4.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "PRIME B650-PLUS",           Price = 159.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 6400MHz","PCIe 5.0","2x M.2","USB 3.2"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-5.png" },

            // AM5 / DDR5 — Mid
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MAG B650 TOMAHAWK WIFI",    Price = 219.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 7200MHz","PCIe 5.0","3x M.2","WiFi 6E"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-6.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "B650 AORUS Elite AX",       Price = 239.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 7600MHz","PCIe 5.0","3x M.2","WiFi 6E"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-7.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Strix B650-A Gaming",   Price = 279.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 7800MHz","PCIe 5.0","4x M.2","2.5G LAN"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-8.png" },

            // AM5 / DDR5 — High-end
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "X670E AORUS Master",        Price = 449.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 8000MHz","PCIe 5.0 x2","5x M.2","WiFi 6E","Thunderbolt 4"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-9.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Crosshair X670E Hero",  Price = 499.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 8000MHz","PCIe 5.0 x2","5x M.2","WiFi 6E","USB4"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-10.png" },

            // LGA1700 / DDR5 — Budget
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "PRO B760M-E DDR5",          Price = 109.99m,
                SpecsJson = S("LGA1700 Socket","mATX","DDR5 до 7200MHz","PCIe 4.0","2x M.2","USB 3.2"),
                Socket = "LGA1700", FormFactor = "mATX", RamType = "DDR5", Image = "img/motherboard/mb-11.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "PRIME B760-PLUS DDR5",      Price = 149.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5 до 7200MHz","PCIe 4.0","3x M.2","2.5G LAN"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-12.png" },

            // LGA1700 / DDR5 — Mid/High
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MAG Z790 TOMAHAWK WIFI",    Price = 299.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5 до 7600MHz","PCIe 5.0","4x M.2","WiFi 6E"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-13.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Strix Z790-E Gaming",   Price = 349.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5 до 8000MHz","PCIe 5.0","5x M.2","Thunderbolt 4"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-14.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "Z790 AORUS Master",         Price = 419.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5 до 8000MHz","PCIe 5.0","5x M.2","USB4 40Gbps"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-15.png" },

            // ── ASRock
            new() { CategoryId = cat["motherboard"], Brand = "ASRock",  Name = "B550 Phantom Gaming 4",    Price = 99.99m,
                SpecsJson = S("AM4 Socket","ATX","DDR4 до 4733MHz","PCIe 4.0","2x M.2","USB 3.2"),
                Socket = "AM4",     FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-16.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASRock",  Name = "B650E PG Riptide WiFi",    Price = 199.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 6400MHz","PCIe 5.0 x2","3x M.2","WiFi 6E"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-17.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASRock",  Name = "Z790 Pro RS DDR5",         Price = 199.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5 до 7200MHz","PCIe 5.0","4x M.2","2.5G LAN"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-18.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASRock",  Name = "X670E Taichi",             Price = 399.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 8000MHz","PCIe 5.0 x2","5x M.2","WiFi 6E","Thunderbolt 4"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-19.png" },

            // ── Biostar
            new() { CategoryId = cat["motherboard"], Brand = "Biostar", Name = "B550MX/E Pro",             Price = 79.99m,
                SpecsJson = S("AM4 Socket","mATX","DDR4 до 4400MHz","PCIe 4.0","1x M.2","USB 3.2","Бюджет"),
                Socket = "AM4",     FormFactor = "mATX", RamType = "DDR4", Image = "img/motherboard/mb-20.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Biostar", Name = "B760MX-E Pro DDR5",        Price = 89.99m,
                SpecsJson = S("LGA1700 Socket","mATX","DDR5 до 5600MHz","PCIe 4.0","2x M.2","USB 3.2","Бюджет"),
                Socket = "LGA1700", FormFactor = "mATX", RamType = "DDR5", Image = "img/motherboard/mb-21.png" },

            // ── NZXT
            new() { CategoryId = cat["motherboard"], Brand = "NZXT",    Name = "N7 B550",                  Price = 179.99m,
                SpecsJson = S("AM4 Socket","ATX","DDR4 до 4400MHz","PCIe 4.0","2x M.2","WiFi 6","Стальная крышка"),
                Socket = "AM4",     FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-22.png" },
            new() { CategoryId = cat["motherboard"], Brand = "NZXT",    Name = "N7 Z790",                  Price = 279.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5 до 6400MHz","PCIe 5.0","4x M.2","WiFi 6E","Стальная крышка"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-23.png" },

            // ── LGA1700 / DDR4
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "PRO B660M-A DDR4",          Price = 129.99m,
                SpecsJson = S("LGA1700 Socket","mATX","DDR4 до 5200MHz","B660","PCIe 4.0","2x M.2","USB 3.2"),
                Socket = "LGA1700", FormFactor = "mATX", RamType = "DDR4", Image = "img/motherboard/mb-24.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "PRIME Z690-P DDR4",         Price = 169.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR4 до 5333MHz","Z690","PCIe 5.0","3x M.2","USB 3.2"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-25.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "Z790 UD AX DDR4",           Price = 199.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR4 до 5600MHz","Z790","PCIe 5.0","4x M.2","WiFi 6E"),
                Socket = "LGA1700", FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-26.png" },

            // ── AM4 / DDR4 — mATX
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "B550M MORTAR WiFi",         Price = 149.99m,
                SpecsJson = S("AM4 Socket","mATX","DDR4 до 5100MHz","B550","PCIe 4.0","2x M.2","WiFi 6"),
                Socket = "AM4",     FormFactor = "mATX", RamType = "DDR4", Image = "img/motherboard/mb-27.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASRock",   Name = "B550M Pro4",                Price = 109.99m,
                SpecsJson = S("AM4 Socket","mATX","DDR4 до 4733MHz","B550","PCIe 4.0","2x M.2","USB 3.2"),
                Socket = "AM4",     FormFactor = "mATX", RamType = "DDR4", Image = "img/motherboard/mb-28.png" },

            // ── AM5 / DDR5 — mATX + High-end
            new() { CategoryId = cat["motherboard"], Brand = "ASRock",   Name = "B650M Pro RS WiFi",         Price = 159.99m,
                SpecsJson = S("AM5 Socket","mATX","DDR5 до 6400MHz","B650","PCIe 5.0","2x M.2","WiFi 6E"),
                Socket = "AM5",     FormFactor = "mATX", RamType = "DDR5", Image = "img/motherboard/mb-29.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "TUF Gaming X670E-Plus WiFi", Price = 299.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5 до 7200MHz","X670E","PCIe 5.0","4x M.2","WiFi 6E"),
                Socket = "AM5",     FormFactor = "ATX",  RamType = "DDR5", Image = "img/motherboard/mb-30.png" },

            // ── LGA1700 / DDR5 — mATX
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "B760M AORUS Elite DDR5",    Price = 169.99m,
                SpecsJson = S("LGA1700 Socket","mATX","DDR5 до 7600MHz","B760","PCIe 4.0","3x M.2","2.5G LAN"),
                Socket = "LGA1700", FormFactor = "mATX", RamType = "DDR5", Image = "img/motherboard/mb-31.png" },

            // ── Mini-ITX
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Strix B550-I Gaming",   Price = 199.99m,
                SpecsJson = S("AM4 Socket","ITX","DDR4 до 5100MHz","B550","PCIe 4.0","2x M.2","WiFi 6"),
                Socket = "AM4",     FormFactor = "ITX",  RamType = "DDR4", Image = "img/motherboard/mb-32.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Strix B660-I Gaming WiFi", Price = 229.99m,
                SpecsJson = S("LGA1700 Socket","ITX","DDR5 до 6000MHz","B660","PCIe 5.0","2x M.2","WiFi 6E"),
                Socket = "LGA1700", FormFactor = "ITX",  RamType = "DDR5", Image = "img/motherboard/mb-33.png" },

            // ── LGA1151 / EATX
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Maximus XI Extreme",    Price = 549.99m,
                SpecsJson = S("LGA1151 Socket","EATX","DDR4 до 4266MHz","Z390","PCIe 3.0","3x M.2","WiFi 5"),
                Socket = "LGA1151", FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-34.png" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MEG Z390 GODLIKE",          Price = 499.99m,
                SpecsJson = S("LGA1151 Socket","EATX","DDR4 до 4400MHz","Z390","PCIe 3.0","3x M.2","WiFi 5","Thunderbolt 3"),
                Socket = "LGA1151", FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-35.png" },

            // ── AM4 / EATX
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Crosshair VIII Extreme", Price = 629.99m,
                SpecsJson = S("AM4 Socket","EATX","DDR4 до 5100MHz","X570","PCIe 4.0","4x M.2","WiFi 6E","Thunderbolt 4"),
                Socket = "AM4",     FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-36.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "X570 AORUS Xtreme",         Price = 499.99m,
                SpecsJson = S("AM4 Socket","EATX","DDR4 до 5400MHz","X570","PCIe 4.0","3x M.2","WiFi 6","10G LAN"),
                Socket = "AM4",     FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-37.png" },

            // ── AM5 / EATX
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Crosshair X670E Extreme", Price = 749.99m,
                SpecsJson = S("AM5 Socket","EATX","DDR5 до 8000MHz","X670E","PCIe 5.0 x2","5x M.2","WiFi 6E","Thunderbolt 4"),
                Socket = "AM5",     FormFactor = "EATX", RamType = "DDR5", Image = "img/motherboard/mb-38.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "X670E AORUS Xtreme",        Price = 849.99m,
                SpecsJson = S("AM5 Socket","EATX","DDR5 до 8400MHz","X670E","PCIe 5.0 x2","5x M.2","WiFi 6E","10G LAN"),
                Socket = "AM5",     FormFactor = "EATX", RamType = "DDR5", Image = "img/motherboard/mb-39.png" },

            // ── LGA1700 / EATX
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Maximus Z790 Extreme",  Price = 799.99m,
                SpecsJson = S("LGA1700 Socket","EATX","DDR5 до 8000MHz","Z790","PCIe 5.0","5x M.2","WiFi 6E","Thunderbolt 4"),
                Socket = "LGA1700", FormFactor = "EATX", RamType = "DDR5", Image = "img/motherboard/mb-40.png" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MEG Z790 GODLIKE",          Price = 999.99m,
                SpecsJson = S("LGA1700 Socket","EATX","DDR5 до 8400MHz","Z790","PCIe 5.0","6x M.2","WiFi 6E","10G LAN"),
                Socket = "LGA1700", FormFactor = "EATX", RamType = "DDR5", Image = "img/motherboard/mb-41.png" },

            // ── LGA1851 / EATX
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Maximus Z890 Extreme",  Price = 849.99m,
                SpecsJson = S("LGA1851 Socket","EATX","DDR5 до 9000MHz","Z890","PCIe 5.0","5x M.2","WiFi 7","Thunderbolt 5"),
                Socket = "LGA1851", FormFactor = "EATX", RamType = "DDR5", Image = "img/motherboard/mb-42.png" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MEG Z890 GODLIKE",          Price = 1099.99m,
                SpecsJson = S("LGA1851 Socket","EATX","DDR5 до 9200MHz","Z890","PCIe 5.0","6x M.2","WiFi 7","10G LAN"),
                Socket = "LGA1851", FormFactor = "EATX", RamType = "DDR5", Image = "img/motherboard/mb-43.png" },

            // ── LGA2066 / X299 — HEDT
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Rampage VI Extreme Encore", Price = 749.99m,
                SpecsJson = S("LGA2066 Socket","EATX","DDR4 до 4266MHz","X299","PCIe 3.0","3x M.2","WiFi 6","Thunderbolt 3","10G LAN"),
                Socket = "LGA2066", FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-44.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Strix X299-E Gaming II", Price = 399.99m,
                SpecsJson = S("LGA2066 Socket","ATX","DDR4 до 4266MHz","X299","PCIe 3.0","3x M.2","WiFi 5","2.5G LAN"),
                Socket = "LGA2066", FormFactor = "ATX",  RamType = "DDR4", Image = "img/motherboard/mb-45.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "X299X AORUS Master",        Price = 599.99m,
                SpecsJson = S("LGA2066 Socket","EATX","DDR4 до 4400MHz","X299","PCIe 3.0","3x M.2","WiFi 6","Thunderbolt 3","10G LAN"),
                Socket = "LGA2066", FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-46.png" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MEG X299 CREATION",         Price = 549.99m,
                SpecsJson = S("LGA2066 Socket","EATX","DDR4 до 4500MHz","X299","PCIe 3.0","3x M.2","WiFi 5","Thunderbolt 3","10G LAN"),
                Socket = "LGA2066", FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-47.png" },
            new() { CategoryId = cat["motherboard"], Brand = "ASRock",   Name = "X299 XE Gaming",            Price = 379.99m,
                SpecsJson = S("LGA2066 Socket","EATX","DDR4 до 4266MHz","X299","PCIe 3.0","3x M.2","10G LAN"),
                Socket = "LGA2066", FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-48.png" },

            // ── TRX40 (Threadripper 3000) — HEDT
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Zenith II Extreme Alpha", Price = 949.99m,
                SpecsJson = S("TRX40 Socket","EATX","DDR4 до 4666MHz","TRX40","PCIe 4.0","4x M.2","WiFi 6","Thunderbolt 3","10G LAN"),
                Socket = "TRX40",   FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-49.png" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "TRX40 AORUS Xtreme",        Price = 799.99m,
                SpecsJson = S("TRX40 Socket","EATX","DDR4 до 4400MHz","TRX40","PCIe 4.0","3x M.2","WiFi 6","Thunderbolt 3","10G LAN"),
                Socket = "TRX40",   FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-50.png" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "TRX40 PRO WIFI",            Price = 399.99m,
                SpecsJson = S("TRX40 Socket","EATX","DDR4 до 4400MHz","TRX40","PCIe 4.0","3x M.2","WiFi 6","2.5G LAN"),
                Socket = "TRX40",   FormFactor = "EATX", RamType = "DDR4", Image = "img/motherboard/mb-51.png" },

            // ── RAM ────────────────────────────────────────────────────────────

            // DDR4
            new() { CategoryId = cat["ram"], Brand = "Kingston", Name = "Fury Beast 16GB DDR4-3200",        Price = 39.99m,
                SpecsJson = S("16GB (2×8GB)","DDR4-3200","CL16","XMP 2.0","Plug & Play"), RamType = "DDR4" },
            new() { CategoryId = cat["ram"], Brand = "Corsair",  Name = "Vengeance LPX 32GB DDR4-3200",    Price = 69.99m,
                SpecsJson = S("32GB (2×16GB)","DDR4-3200","CL16","XMP 2.0","Low Profile"), RamType = "DDR4" },
            new() { CategoryId = cat["ram"], Brand = "G.Skill",  Name = "Ripjaws V 32GB DDR4-3600",        Price = 79.99m,
                SpecsJson = S("32GB (2×16GB)","DDR4-3600","CL16","XMP 2.0"), RamType = "DDR4" },
            new() { CategoryId = cat["ram"], Brand = "G.Skill",  Name = "Trident Z RGB 32GB DDR4-3600",    Price = 89.99m,
                SpecsJson = S("32GB (2×16GB)","DDR4-3600","CL16","XMP 2.0","ARGB"), RamType = "DDR4" },

            // DDR5 — Budget
            new() { CategoryId = cat["ram"], Brand = "Corsair",  Name = "Vengeance 16GB DDR5-4800",        Price = 59.99m,
                SpecsJson = S("16GB (2×8GB)","DDR5-4800","CL40","XMP 3.0","Entry DDR5"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "Kingston", Name = "Fury Beast 32GB DDR5-5200",       Price = 109.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-5200","CL40","EXPO / XMP 3.0"), RamType = "DDR5" },

            // DDR5 — Mid
            new() { CategoryId = cat["ram"], Brand = "G.Skill",  Name = "Ripjaws S5 32GB DDR5-6000",       Price = 114.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-6000","CL32","XMP 3.0"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "Corsair",  Name = "Vengeance 32GB DDR5-6000",        Price = 119.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-6000","CL30","EXPO / XMP 3.0"), RamType = "DDR5" },

            // DDR5 — High-end
            new() { CategoryId = cat["ram"], Brand = "G.Skill",  Name = "Trident Z5 RGB 32GB DDR5-6400",   Price = 139.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-6400","CL32","XMP 3.0","ARGB"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "Corsair",  Name = "Dominator Platinum 64GB DDR5-6000", Price = 219.99m,
                SpecsJson = S("64GB (2×32GB)","DDR5-6000","CL30","XMP 3.0","ARGB"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "G.Skill",  Name = "Trident Z5 RGB 64GB DDR5-6400",   Price = 279.99m,
                SpecsJson = S("64GB (2×32GB)","DDR5-6400","CL32","XMP 3.0","ARGB"), RamType = "DDR5" },

            // ── GPUs ───────────────────────────────────────────────────────────

            // NVIDIA RTX 4060 8GB
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "MSI",      Name = "VENTUS 2X OC GeForce RTX 4060 8GB",           Price = 299.99m,  SpecsJson = S("8GB GDDR6","115W TDP","PCIe 4.0 ×16","DLSS 3","Dual-Fan","Boost 2505MHz"), Tdp = 115 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Gigabyte", Name = "WINDFORCE OC GeForce RTX 4060 8GB",           Price = 299.99m,  SpecsJson = S("8GB GDDR6","115W TDP","PCIe 4.0 ×16","DLSS 3","Triple-Fan","RGB Fusion 2.0"), Tdp = 115 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "ASUS",     Name = "DUAL OC GeForce RTX 4060 8GB",                Price = 309.99m,  SpecsJson = S("8GB GDDR6","115W TDP","PCIe 4.0 ×16","DLSS 3","Dual-Fan","Auto-Extreme"), Tdp = 115 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Zotac",    Name = "GAMING Twin Edge OC RTX 4060 8GB",            Price = 299.99m,  SpecsJson = S("8GB GDDR6","115W TDP","PCIe 4.0 ×16","DLSS 3","Dual-Fan","IceStorm 2.0"), Tdp = 115 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Colorful", Name = "iGame GeForce RTX 4060 Ultra W OC 8GB",       Price = 299.99m,  SpecsJson = S("8GB GDDR6","115W TDP","PCIe 4.0 ×16","DLSS 3","Triple-Fan","ARGB"), Tdp = 115 },

            // NVIDIA RTX 4060 Ti 8GB
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "MSI",      Name = "GAMING X GeForce RTX 4060 Ti 8GB",            Price = 419.99m,  SpecsJson = S("8GB GDDR6","160W TDP","PCIe 4.0 ×16","DLSS 3","Triple-Fan","TORX Fan 5.0"), Tdp = 160 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "ASUS",     Name = "TUF Gaming OC GeForce RTX 4060 Ti 8GB",       Price = 409.99m,  SpecsJson = S("8GB GDDR6","160W TDP","PCIe 4.0 ×16","DLSS 3","Triple-Fan","Military-Grade"), Tdp = 160 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Palit",    Name = "Dual OC GeForce RTX 4060 Ti 8GB",             Price = 399.99m,  SpecsJson = S("8GB GDDR6","160W TDP","PCIe 4.0 ×16","DLSS 3","Dual-Fan","Compact Design"), Tdp = 160 },

            // NVIDIA RTX 4070 Super 12GB
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "MSI",      Name = "GAMING X SLIM OC GeForce RTX 4070 Super 12GB", Price = 609.99m, SpecsJson = S("12GB GDDR6X","220W TDP","PCIe 4.0 ×16","DLSS 3","Dual-Fan Slim","TORX Fan 5.0"), Tdp = 220 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "ASUS",     Name = "TUF Gaming OC GeForce RTX 4070 Super 12GB",   Price = 619.99m,  SpecsJson = S("12GB GDDR6X","220W TDP","PCIe 4.0 ×16","DLSS 3","Triple-Fan","Military-Grade"), Tdp = 220 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "PNY",      Name = "XLR8 Verto OC GeForce RTX 4070 Super 12GB",   Price = 589.99m,  SpecsJson = S("12GB GDDR6X","220W TDP","PCIe 4.0 ×16","DLSS 3","Triple-Fan","VERTO Cooler"), Tdp = 220 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Inno3D",   Name = "Twin X2 OC GeForce RTX 4070 Super 12GB",      Price = 599.99m,  SpecsJson = S("12GB GDDR6X","220W TDP","PCIe 4.0 ×16","DLSS 3","Dual-Fan","Compact Build"), Tdp = 220 },

            // NVIDIA RTX 4070 Ti Super 16GB
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "MSI",      Name = "SUPRIM X GeForce RTX 4070 Ti Super 16GB",     Price = 829.99m,  SpecsJson = S("16GB GDDR6X","285W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","Boost 2700MHz"), Tdp = 285 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "ASUS",     Name = "ROG STRIX OC GeForce RTX 4070 Ti Super 16GB", Price = 849.99m,  SpecsJson = S("16GB GDDR6X","285W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","ARGB"), Tdp = 285 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Gigabyte", Name = "AORUS MASTER GeForce RTX 4070 Ti Super 16GB", Price = 839.99m,  SpecsJson = S("16GB GDDR6X","285W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","LCD Edge View"), Tdp = 285 },

            // NVIDIA RTX 4080 Super 16GB
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "ASUS",     Name = "ROG STRIX OC GeForce RTX 4080 Super 16GB",    Price = 1049.99m, SpecsJson = S("16GB GDDR6X","320W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","ARGB"), Tdp = 320 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "MSI",      Name = "SUPRIM X GeForce RTX 4080 Super 16GB",        Price = 1029.99m, SpecsJson = S("16GB GDDR6X","320W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","Boost 2640MHz"), Tdp = 320 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Zotac",    Name = "GAMING AMP Extreme GeForce RTX 4080 Super 16GB", Price = 999.99m, SpecsJson = S("16GB GDDR6X","320W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","IceStorm 3.0"), Tdp = 320 },

            // NVIDIA RTX 4090 24GB
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "ASUS",     Name = "ROG STRIX OC GeForce RTX 4090 24GB",          Price = 1899.99m, SpecsJson = S("24GB GDDR6X","450W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","ARGB"), Tdp = 450 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "MSI",      Name = "SUPRIM X GeForce RTX 4090 24GB",              Price = 1849.99m, SpecsJson = S("24GB GDDR6X","450W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","TriFrozr 3S"), Tdp = 450 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Zotac",    Name = "GAMING AMP Extreme Holo RTX 4090 24GB",       Price = 1799.99m, SpecsJson = S("24GB GDDR6X","450W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","Holo ARGB"), Tdp = 450 },
            new() { CategoryId = cat["gpu"], ChipBrand = "NVIDIA", Brand = "Gigabyte", Name = "AORUS MASTER GeForce RTX 4090 24GB",          Price = 1849.99m, SpecsJson = S("24GB GDDR6X","450W TDP","PCIe 4.0 ×16","DLSS 3.5","Triple-Fan","LCD Edge View"), Tdp = 450 },

            // AMD RX 7600 8GB
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "MSI",      Name = "MECH 2X OC Radeon RX 7600 8GB",               Price = 269.99m,  SpecsJson = S("8GB GDDR6","165W TDP","PCIe 4.0 ×16","FSR 3","Dual-Fan","Boost 2755MHz"), Tdp = 165 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "ASUS",     Name = "DUAL OC Radeon RX 7600 8GB",                  Price = 279.99m,  SpecsJson = S("8GB GDDR6","165W TDP","PCIe 4.0 ×16","FSR 3","Dual-Fan","Auto-Extreme"), Tdp = 165 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "Gigabyte", Name = "EAGLE OC Radeon RX 7600 8GB",                 Price = 269.99m,  SpecsJson = S("8GB GDDR6","165W TDP","PCIe 4.0 ×16","FSR 3","Dual-Fan","WINDFORCE 2X"), Tdp = 165 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "ASRock",   Name = "Challenger OC Radeon RX 7600 8GB",            Price = 269.99m,  SpecsJson = S("8GB GDDR6","165W TDP","PCIe 4.0 ×16","FSR 3","Dual-Fan","Boost 2755MHz"), Tdp = 165 },

            // AMD RX 7800 XT 16GB
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "MSI",      Name = "GAMING Radeon RX 7800 XT 16GB",               Price = 499.99m,  SpecsJson = S("16GB GDDR6","263W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","TORX Fan 5.0"), Tdp = 263 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "ASUS",     Name = "TUF Gaming OC Radeon RX 7800 XT 16GB",        Price = 519.99m,  SpecsJson = S("16GB GDDR6","263W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","Military-Grade"), Tdp = 263 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "Gigabyte", Name = "GAMING OC Radeon RX 7800 XT 16GB",            Price = 509.99m,  SpecsJson = S("16GB GDDR6","263W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","WINDFORCE 3X"), Tdp = 263 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "ASRock",   Name = "Challenger Pro OC Radeon RX 7800 XT 16GB",    Price = 499.99m,  SpecsJson = S("16GB GDDR6","263W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","Boost 2520MHz"), Tdp = 263 },

            // AMD RX 7900 GRE 16GB
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "MSI",      Name = "GAMING Radeon RX 7900 GRE 16GB",              Price = 549.99m,  SpecsJson = S("16GB GDDR6","260W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","TORX Fan 5.0"), Tdp = 260 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "ASUS",     Name = "TUF Gaming OC Radeon RX 7900 GRE 16GB",       Price = 569.99m,  SpecsJson = S("16GB GDDR6","260W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","Military-Grade"), Tdp = 260 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "Gigabyte", Name = "GAMING OC Radeon RX 7900 GRE 16GB",           Price = 559.99m,  SpecsJson = S("16GB GDDR6","260W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","WINDFORCE 3X"), Tdp = 260 },

            // AMD RX 7900 XTX 24GB
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "ASUS",     Name = "ROG STRIX LC OC Radeon RX 7900 XTX 24GB",    Price = 799.99m,  SpecsJson = S("24GB GDDR6","355W TDP","PCIe 4.0 ×16","FSR 3","AIO Liquid Cool","ARGB"), Tdp = 355 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "MSI",      Name = "GAMING TRIO Radeon RX 7900 XTX 24GB",         Price = 779.99m,  SpecsJson = S("24GB GDDR6","355W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","TORX Fan 5.0"), Tdp = 355 },
            new() { CategoryId = cat["gpu"], ChipBrand = "AMD",    Brand = "Gigabyte", Name = "GAMING OC Radeon RX 7900 XTX 24GB",           Price = 769.99m,  SpecsJson = S("24GB GDDR6","355W TDP","PCIe 4.0 ×16","FSR 3","Triple-Fan","WINDFORCE 3X"), Tdp = 355 },

            // Intel Arc A770 16GB
            new() { CategoryId = cat["gpu"], ChipBrand = "Intel",  Brand = "ASRock",   Name = "Arc A770 Challenger OC 16GB",                 Price = 329.99m,  SpecsJson = S("16GB GDDR6","225W TDP","PCIe 4.0 ×16","XeSS / DX12U","Dual-Fan","Boost 2400MHz"), Tdp = 225 },
            new() { CategoryId = cat["gpu"], ChipBrand = "Intel",  Brand = "ASUS",     Name = "Arc A770 Dual OC 16GB",                       Price = 339.99m,  SpecsJson = S("16GB GDDR6","225W TDP","PCIe 4.0 ×16","XeSS / DX12U","Dual-Fan","Auto-Extreme"), Tdp = 225 },

            // ── Storage ────────────────────────────────────────────────────────

            // Budget PCIe 3.0
            new() { CategoryId = cat["storage"], Brand = "Crucial", Name = "P3 1TB NVMe M.2 PCIe 3.0",    Price = 59.99m,
                SpecsJson = S("1TB","PCIe 3.0 NVMe M.2","Чтение: 3500 МБ/с","Запись: 3000 МБ/с","Бюджет") },
            new() { CategoryId = cat["storage"], Brand = "Kingston", Name = "NV3 2TB NVMe M.2 PCIe 4.0", Price = 79.99m,
                SpecsJson = S("2TB","PCIe 4.0 NVMe M.2","Чтение: 6000 МБ/с","Запись: 4000 МБ/с","Бюджет") },

            // SATA
            new() { CategoryId = cat["storage"], Brand = "Samsung", Name = "870 EVO 1TB SATA",           Price = 89.99m,
                SpecsJson = S("1TB","SATA III 2.5\"","Чтение: 560 МБ/с","Запись: 530 МБ/с","MLC NAND") },
            new() { CategoryId = cat["storage"], Brand = "Crucial", Name = "MX500 2TB SATA",             Price = 99.99m,
                SpecsJson = S("2TB","SATA III 2.5\"","Чтение: 560 МБ/с","Запись: 510 МБ/с","Гарантия 5 лет") },

            // PCIe 4.0 Mid
            new() { CategoryId = cat["storage"], Brand = "Crucial", Name = "P3 Plus 2TB NVMe M.2",       Price = 89.99m,
                SpecsJson = S("2TB","PCIe 4.0 NVMe M.2","Чтение: 5000 МБ/с","Запись: 4200 МБ/с") },
            new() { CategoryId = cat["storage"], Brand = "WD",      Name = "Black SN850X 1TB NVMe M.2",  Price = 99.99m,
                SpecsJson = S("1TB","PCIe 4.0 NVMe M.2","Чтение: 7300 МБ/с","Запись: 6600 МБ/с","GameMode 2.0") },
            new() { CategoryId = cat["storage"], Brand = "Samsung", Name = "990 Pro 1TB NVMe M.2",       Price = 109.99m,
                SpecsJson = S("1TB","PCIe 4.0 NVMe M.2","Чтение: 7450 МБ/с","Запись: 6900 МБ/с","V-NAND") },
            new() { CategoryId = cat["storage"], Brand = "Seagate", Name = "FireCuda 530 2TB NVMe M.2",  Price = 149.99m,
                SpecsJson = S("2TB","PCIe 4.0 NVMe M.2","Чтение: 7300 МБ/с","Запись: 6900 МБ/с","Heatsink") },
            new() { CategoryId = cat["storage"], Brand = "Samsung", Name = "990 Pro 2TB NVMe M.2",       Price = 199.99m,
                SpecsJson = S("2TB","PCIe 4.0 NVMe M.2","Чтение: 7450 МБ/с","Запись: 6900 МБ/с","V-NAND") },

            // High Capacity
            new() { CategoryId = cat["storage"], Brand = "WD",      Name = "Black SN850X 4TB NVMe M.2",  Price = 329.99m,
                SpecsJson = S("4TB","PCIe 4.0 NVMe M.2","Чтение: 7300 МБ/с","Запись: 6600 МБ/с","GameMode 2.0") },
            new() { CategoryId = cat["storage"], Brand = "Samsung", Name = "990 Pro 4TB NVMe M.2",       Price = 349.99m,
                SpecsJson = S("4TB","PCIe 4.0 NVMe M.2","Чтение: 7450 МБ/с","Запись: 6900 МБ/с","V-NAND") },

            // ── PSUs ───────────────────────────────────────────────────────────

            // Budget
            new() { CategoryId = cat["psu"], Brand = "Corsair",  Name = "CX650F 650W 80+ Bronze",          Price = 79.99m,
                SpecsJson = S("650W","80+ Bronze","Полностью модульный","ATX 3.0","Гарантия 5 лет"), Wattage = 650 },
            new() { CategoryId = cat["psu"], Brand = "Seasonic", Name = "Focus GX-550 550W 80+ Gold",      Price = 89.99m,
                SpecsJson = S("550W","80+ Gold","Полностью модульный","Гарантия 10 лет","Hybrid Fan"), Wattage = 550 },

            // Mid
            new() { CategoryId = cat["psu"], Brand = "Corsair",  Name = "RM750e 750W 80+ Gold",            Price = 99.99m,
                SpecsJson = S("750W","80+ Gold","Полностью модульный","ATX 3.0","Zero RPM Mode"), Wattage = 750 },
            new() { CategoryId = cat["psu"], Brand = "Seasonic", Name = "Focus GX-750 750W 80+ Gold",      Price = 109.99m,
                SpecsJson = S("750W","80+ Gold","Полностью модульный","Гарантия 10 лет","Hybrid Fan"), Wattage = 750 },
            new() { CategoryId = cat["psu"], Brand = "Corsair",  Name = "RM850e 850W 80+ Gold",            Price = 119.99m,
                SpecsJson = S("850W","80+ Gold","Полностью модульный","ATX 3.0","Zero RPM Mode"), Wattage = 850 },
            new() { CategoryId = cat["psu"], Brand = "EVGA",     Name = "SuperNOVA 850 G6 80+ Gold",       Price = 129.99m,
                SpecsJson = S("850W","80+ Gold","Полностью модульный","Гарантия 10 лет","ECO Mode"), Wattage = 850 },
            new() { CategoryId = cat["psu"], Brand = "be quiet!", Name = "Straight Power 11 1000W Platinum", Price = 179.99m,
                SpecsJson = S("1000W","80+ Platinum","Полностью модульный","Silent Wings Fan","Гарантия 5 лет"), Wattage = 1000 },

            // High-end
            new() { CategoryId = cat["psu"], Brand = "Corsair",  Name = "HX1000 1000W 80+ Platinum",       Price = 199.99m,
                SpecsJson = S("1000W","80+ Platinum","Полностью модульный","Zero RPM Mode","Гарантия 10 лет"), Wattage = 1000 },
            new() { CategoryId = cat["psu"], Brand = "be quiet!", Name = "Dark Power 13 1000W 80+ Titanium", Price = 229.99m,
                SpecsJson = S("1000W","80+ Titanium","Полностью модульный","Silent Wings 4","OC Key"), Wattage = 1000 },
            new() { CategoryId = cat["psu"], Brand = "Seasonic", Name = "Prime TX-1000 1000W 80+ Titanium", Price = 269.99m,
                SpecsJson = S("1000W","80+ Titanium","Полностью модульный","Гарантия 12 лет","Fanless Mode"), Wattage = 1000 },

            // ── Coolers ────────────────────────────────────────────────────────

            // Budget Air
            new() { CategoryId = cat["cooler"], Brand = "ID-Cooling",   Name = "SE-224-XT",              Price = 29.99m,
                SpecsJson = S("Башенное","1x 120mm Fan","Up to 180W TDP","Бюджет"), MaxTdp = 180 },
            new() { CategoryId = cat["cooler"], Brand = "Cooler Master", Name = "Hyper 212 Halo",         Price = 34.99m,
                SpecsJson = S("Башенное","1x 120mm ARGB Fan","Up to 150W TDP","4 тепловые трубки"), MaxTdp = 150 },
            new() { CategoryId = cat["cooler"], Brand = "be quiet!",    Name = "Pure Rock 2",             Price = 39.99m,
                SpecsJson = S("Башенное","1x 120mm PWM Fan","Up to 150W TDP","Silent"), MaxTdp = 150 },

            // Mid Air
            new() { CategoryId = cat["cooler"], Brand = "DeepCool",     Name = "AK620",                  Price = 54.99m,
                SpecsJson = S("Башенное","2x 120mm Fans","Up to 260W TDP","Отличное цена/качество"), MaxTdp = 260 },
            new() { CategoryId = cat["cooler"], Brand = "be quiet!",    Name = "Dark Rock Pro 4",         Price = 89.99m,
                SpecsJson = S("Башенное","3x 120mm Silent Wings","Up to 250W TDP"), MaxTdp = 250 },
            new() { CategoryId = cat["cooler"], Brand = "Noctua",       Name = "NH-D15",                  Price = 99.99m,
                SpecsJson = S("Башенное","2x 140mm NF-A15 Fan","Up to 250W TDP","Лучший воздушник"), MaxTdp = 250 },

            // AIO
            new() { CategoryId = cat["cooler"], Brand = "Corsair",      Name = "H100i Elite Capellix 240mm", Price = 149.99m,
                SpecsJson = S("AIO Водяное 240mm","2x 120mm ARGB","Up to 300W TDP","LCD Pump Head"), MaxTdp = 300 },
            new() { CategoryId = cat["cooler"], Brand = "NZXT",         Name = "Kraken Z63 280mm",        Price = 179.99m,
                SpecsJson = S("AIO Водяное 280mm","2x 140mm Fan","Up to 300W TDP","LCD Pump Head"), MaxTdp = 300 },
            new() { CategoryId = cat["cooler"], Brand = "Corsair",      Name = "H150i Elite Capellix 360mm", Price = 179.99m,
                SpecsJson = S("AIO Водяное 360mm","3x 120mm ARGB","Up to 350W TDP","LCD Pump Head"), MaxTdp = 350 },
            new() { CategoryId = cat["cooler"], Brand = "Corsair",      Name = "H170i Elite LCD 420mm",   Price = 229.99m,
                SpecsJson = S("AIO Водяное 420mm","3x 140mm ARGB","Up to 400W TDP","LCD Pump Head","Флагман"), MaxTdp = 400 },

            // ── Cases ──────────────────────────────────────────────────────────

            // Budget / Compact
            new() { CategoryId = cat["case"], Brand = "Cooler Master", Name = "Q300L V2 mATX",        Price = 54.99m,
                SpecsJson = S("mATX Micro Tower","Mesh Panels","2x USB 3.0","Компактный"),
                SupportedFormFactorsJson = J("mATX","ITX") },
            new() { CategoryId = cat["case"], Brand = "Phanteks",      Name = "P300A Mesh ATX",       Price = 64.99m,
                SpecsJson = S("ATX Mid Tower","Full Mesh Front","1x 120mm Fan","USB 3.0","Высокий поток воздуха"),
                SupportedFormFactorsJson = J("ATX","mATX","ITX") },

            // Mid
            new() { CategoryId = cat["case"], Brand = "Lian Li",       Name = "Lancool 216 ATX",      Price = 94.99m,
                SpecsJson = S("ATX Mid Tower","Full Mesh Panels","2x 160mm Fans","USB 3.1 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX","ITX") },
            new() { CategoryId = cat["case"], Brand = "NZXT",          Name = "H5 Flow",              Price = 94.99m,
                SpecsJson = S("ATX Mid Tower","Dual Mesh Panels","2x 120mm Fans","USB 3.2 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX") },
            new() { CategoryId = cat["case"], Brand = "be quiet!",     Name = "Pure Base 500DX",      Price = 99.99m,
                SpecsJson = S("ATX Mid Tower","ARGB Top Strip","3x 140mm Fans","USB 3.0 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX") },
            new() { CategoryId = cat["case"], Brand = "Corsair",       Name = "4000D Airflow ATX",    Price = 104.99m,
                SpecsJson = S("ATX Mid Tower","Mesh Front Panel","3x 120mm Fans","USB 3.1 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX","ITX") },
            new() { CategoryId = cat["case"], Brand = "Fractal Design", Name = "North ATX",           Price = 109.99m,
                SpecsJson = S("ATX Mid Tower","Mesh + Wood Front","2x 140mm Fans","USB-C 3.2"),
                SupportedFormFactorsJson = J("ATX","mATX") },

            // Mid-High
            new() { CategoryId = cat["case"], Brand = "Lian Li",       Name = "O11 Dynamic EVO",     Price = 149.99m,
                SpecsJson = S("ATX Mid Tower","Dual Chamber","Tempered Glass x2","USB-C 3.2","До 13x 120mm"),
                SupportedFormFactorsJson = J("ATX","mATX") },
            new() { CategoryId = cat["case"], Brand = "Fractal Design", Name = "Torrent ATX",         Price = 149.99m,
                SpecsJson = S("ATX Mid Tower","Max Airflow","2x 180mm + 3x 140mm","USB-C 3.2"),
                SupportedFormFactorsJson = J("ATX","mATX") },

            // Premium
            new() { CategoryId = cat["case"], Brand = "Corsair",       Name = "5000X RGB ATX",       Price = 189.99m,
                SpecsJson = S("ATX Full Tower","4x 120mm ARGB Fans","Tempered Glass","USB 3.1 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX","ITX") },
        };

        db.Components.AddRange(components);
        await db.SaveChangesAsync();
    }

    private static string S(params string[] specs) => JsonSerializer.Serialize(specs);
    private static string J(params string[] values) => JsonSerializer.Serialize(values);
}
