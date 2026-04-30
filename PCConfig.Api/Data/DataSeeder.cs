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
            // ── Cases ──────────────────────────────────────────────────────────
            new() { CategoryId = cat["case"], Brand = "Corsair",        Name = "4000D Airflow ATX",   Price = 104.99m,
                SpecsJson = S("ATX Mid Tower","Mesh Front Panel","3x 120mm Fans","USB 3.1 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX","ITX") },
            new() { CategoryId = cat["case"], Brand = "Corsair",        Name = "5000X RGB ATX",       Price = 189.99m,
                SpecsJson = S("ATX Full Tower","4x 120mm ARGB Fans","Tempered Glass","USB 3.1 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX","ITX") },
            new() { CategoryId = cat["case"], Brand = "NZXT",           Name = "H5 Flow",             Price = 94.99m,
                SpecsJson = S("ATX Mid Tower","Dual Mesh Panels","2x 120mm Fans","USB 3.2 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX") },
            new() { CategoryId = cat["case"], Brand = "Fractal Design", Name = "North ATX",           Price = 109.99m,
                SpecsJson = S("ATX Mid Tower","Mesh + Wood Front","2x 140mm Fans","USB-C 3.2"),
                SupportedFormFactorsJson = J("ATX","mATX") },
            new() { CategoryId = cat["case"], Brand = "Lian Li",        Name = "Lancool 216 ATX",     Price = 94.99m,
                SpecsJson = S("ATX Mid Tower","Full Mesh Panels","2x 160mm Fans","USB 3.1 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX","ITX") },
            new() { CategoryId = cat["case"], Brand = "be quiet!",      Name = "Pure Base 500DX",     Price = 99.99m,
                SpecsJson = S("ATX Mid Tower","ARGB Top Strip","3x 140mm Fans","USB 3.0 Type-C"),
                SupportedFormFactorsJson = J("ATX","mATX") },

            // ── CPUs ───────────────────────────────────────────────────────────
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 5 7600X",   Price = 229.99m,
                SpecsJson = S("6 Cores / 12 Threads","AM5 Socket","5.3 GHz Boost","105W TDP"),
                Socket = "AM5", Tdp = 105 },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 7 7700X",   Price = 299.99m,
                SpecsJson = S("8 Cores / 16 Threads","AM5 Socket","5.4 GHz Boost","105W TDP"),
                Socket = "AM5", Tdp = 105 },
            new() { CategoryId = cat["cpu"], Brand = "AMD",   Name = "Ryzen 9 7900X",   Price = 449.99m,
                SpecsJson = S("12 Cores / 24 Threads","AM5 Socket","5.6 GHz Boost","170W TDP"),
                Socket = "AM5", Tdp = 170 },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i5-14600K",  Price = 289.99m,
                SpecsJson = S("14 Cores / 20 Threads","LGA1700 Socket","5.3 GHz Boost","125W TDP"),
                Socket = "LGA1700", Tdp = 125 },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i7-14700K",  Price = 409.99m,
                SpecsJson = S("20 Cores / 28 Threads","LGA1700 Socket","5.6 GHz Boost","125W TDP"),
                Socket = "LGA1700", Tdp = 125 },
            new() { CategoryId = cat["cpu"], Brand = "Intel", Name = "Core i9-14900K",  Price = 549.99m,
                SpecsJson = S("24 Cores / 32 Threads","LGA1700 Socket","6.0 GHz Boost","125W TDP"),
                Socket = "LGA1700", Tdp = 125 },

            // ── Coolers ────────────────────────────────────────────────────────
            new() { CategoryId = cat["cooler"], Brand = "Noctua",   Name = "NH-D15",                  Price = 99.99m,
                SpecsJson = S("Dual Tower Air","2x 140mm Fans","Up to 250W TDP","Ultra Quiet"),
                MaxTdp = 250 },
            new() { CategoryId = cat["cooler"], Brand = "be quiet!", Name = "Dark Rock Pro 4",         Price = 89.99m,
                SpecsJson = S("Dual Tower Air","3x 120mm Silent Wings","Up to 250W TDP"),
                MaxTdp = 250 },
            new() { CategoryId = cat["cooler"], Brand = "Corsair",   Name = "H100i Elite Capellix",    Price = 149.99m,
                SpecsJson = S("240mm AIO","2x 120mm ARGB","Up to 300W TDP","LCD Pump Head"),
                MaxTdp = 300 },
            new() { CategoryId = cat["cooler"], Brand = "Corsair",   Name = "H150i Elite Capellix",    Price = 179.99m,
                SpecsJson = S("360mm AIO","3x 120mm ARGB","Up to 350W TDP","LCD Pump Head"),
                MaxTdp = 350 },
            new() { CategoryId = cat["cooler"], Brand = "DeepCool",  Name = "AK620",                   Price = 54.99m,
                SpecsJson = S("Dual Tower Air","2x 120mm Fans","Up to 260W TDP","Budget Pick"),
                MaxTdp = 260 },

            // ── Motherboards ───────────────────────────────────────────────────
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Strix B650-A Gaming",    Price = 279.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5","PCIe 5.0","2.5G LAN"),
                Socket = "AM5", FormFactor = "ATX", RamType = "DDR5" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MAG B650 TOMAHAWK WIFI",     Price = 219.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5","PCIe 5.0","WiFi 6E"),
                Socket = "AM5", FormFactor = "ATX", RamType = "DDR5" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "B650 AORUS Elite AX",        Price = 239.99m,
                SpecsJson = S("AM5 Socket","ATX","DDR5","PCIe 5.0","WiFi 6E"),
                Socket = "AM5", FormFactor = "ATX", RamType = "DDR5" },
            new() { CategoryId = cat["motherboard"], Brand = "ASUS",     Name = "ROG Strix Z790-E Gaming",    Price = 349.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5","PCIe 5.0","Thunderbolt 4"),
                Socket = "LGA1700", FormFactor = "ATX", RamType = "DDR5" },
            new() { CategoryId = cat["motherboard"], Brand = "MSI",      Name = "MAG Z790 TOMAHAWK WIFI",     Price = 299.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5","PCIe 5.0","WiFi 6E"),
                Socket = "LGA1700", FormFactor = "ATX", RamType = "DDR5" },
            new() { CategoryId = cat["motherboard"], Brand = "Gigabyte", Name = "Z790 AORUS Master",          Price = 419.99m,
                SpecsJson = S("LGA1700 Socket","ATX","DDR5","PCIe 5.0","USB4 40Gbps"),
                Socket = "LGA1700", FormFactor = "ATX", RamType = "DDR5" },

            // ── RAM ────────────────────────────────────────────────────────────
            new() { CategoryId = cat["ram"], Brand = "Corsair",  Name = "Vengeance 32GB DDR5-6000",           Price = 119.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-6000","CL30","EXPO / XMP 3.0"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "G.Skill",  Name = "Trident Z5 RGB 32GB DDR5-6400",      Price = 139.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-6400","CL32","XMP 3.0","ARGB"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "Kingston", Name = "Fury Beast 32GB DDR5-5200",          Price = 109.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-5200","CL40","EXPO / XMP 3.0"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "Corsair",  Name = "Dominator Platinum 64GB DDR5-6000",  Price = 219.99m,
                SpecsJson = S("64GB (2×32GB)","DDR5-6000","CL30","XMP 3.0","ARGB"), RamType = "DDR5" },
            new() { CategoryId = cat["ram"], Brand = "G.Skill",  Name = "Ripjaws S5 32GB DDR5-6000",          Price = 114.99m,
                SpecsJson = S("32GB (2×16GB)","DDR5-6000","CL32","XMP 3.0"), RamType = "DDR5" },

            // ── GPUs ───────────────────────────────────────────────────────────
            new() { CategoryId = cat["gpu"], Brand = "NVIDIA", Name = "GeForce RTX 4060 Ti 8GB",    Price = 399.99m,
                SpecsJson = S("8GB GDDR6","165W TDP","PCIe 4.0 ×16","DLSS 3","1080p / 1440p"), Tdp = 165 },
            new() { CategoryId = cat["gpu"], Brand = "NVIDIA", Name = "GeForce RTX 4070 12GB",      Price = 599.99m,
                SpecsJson = S("12GB GDDR6X","200W TDP","PCIe 4.0 ×16","DLSS 3","1440p"), Tdp = 200 },
            new() { CategoryId = cat["gpu"], Brand = "NVIDIA", Name = "GeForce RTX 4070 Super 12GB",Price = 599.99m,
                SpecsJson = S("12GB GDDR6X","220W TDP","PCIe 4.0 ×16","DLSS 3","1440p / 4K"), Tdp = 220 },
            new() { CategoryId = cat["gpu"], Brand = "NVIDIA", Name = "GeForce RTX 4080 Super 16GB",Price = 999.99m,
                SpecsJson = S("16GB GDDR6X","320W TDP","PCIe 4.0 ×16","DLSS 3","4K"), Tdp = 320 },
            new() { CategoryId = cat["gpu"], Brand = "NVIDIA", Name = "GeForce RTX 4090 24GB",      Price = 1799.99m,
                SpecsJson = S("24GB GDDR6X","450W TDP","PCIe 4.0 ×16","DLSS 3","4K Ultra"), Tdp = 450 },
            new() { CategoryId = cat["gpu"], Brand = "AMD",    Name = "Radeon RX 7800 XT 16GB",     Price = 499.99m,
                SpecsJson = S("16GB GDDR6","263W TDP","PCIe 4.0 ×16","FSR 3","1440p"), Tdp = 263 },
            new() { CategoryId = cat["gpu"], Brand = "AMD",    Name = "Radeon RX 7900 GRE 16GB",    Price = 549.99m,
                SpecsJson = S("16GB GDDR6","260W TDP","PCIe 4.0 ×16","FSR 3","1440p / 4K"), Tdp = 260 },

            // ── Storage ────────────────────────────────────────────────────────
            new() { CategoryId = cat["storage"], Brand = "Samsung", Name = "990 Pro 1TB NVMe M.2",       Price = 109.99m,
                SpecsJson = S("1TB","PCIe 4.0 NVMe","7 450 MB/s Read","6 900 MB/s Write") },
            new() { CategoryId = cat["storage"], Brand = "Samsung", Name = "990 Pro 2TB NVMe M.2",       Price = 199.99m,
                SpecsJson = S("2TB","PCIe 4.0 NVMe","7 450 MB/s Read","6 900 MB/s Write") },
            new() { CategoryId = cat["storage"], Brand = "WD",      Name = "Black SN850X 1TB NVMe M.2",  Price = 99.99m,
                SpecsJson = S("1TB","PCIe 4.0 NVMe","7 300 MB/s Read","6 600 MB/s Write") },
            new() { CategoryId = cat["storage"], Brand = "Seagate", Name = "FireCuda 530 2TB NVMe M.2",  Price = 149.99m,
                SpecsJson = S("2TB","PCIe 4.0 NVMe","7 300 MB/s Read","6 900 MB/s Write") },
            new() { CategoryId = cat["storage"], Brand = "Crucial", Name = "P3 Plus 2TB NVMe M.2",       Price = 89.99m,
                SpecsJson = S("2TB","PCIe 4.0 NVMe","5 000 MB/s Read","4 200 MB/s Write","Budget") },

            // ── PSUs ───────────────────────────────────────────────────────────
            new() { CategoryId = cat["psu"], Brand = "Corsair",  Name = "RM750e 750W 80+ Gold",          Price = 99.99m,
                SpecsJson = S("750W","80+ Gold","Fully Modular","ATX 3.0","Zero RPM Mode"), Wattage = 750 },
            new() { CategoryId = cat["psu"], Brand = "Corsair",  Name = "RM850e 850W 80+ Gold",          Price = 119.99m,
                SpecsJson = S("850W","80+ Gold","Fully Modular","ATX 3.0","Zero RPM Mode"), Wattage = 850 },
            new() { CategoryId = cat["psu"], Brand = "EVGA",     Name = "SuperNOVA 850 G6 80+ Gold",     Price = 129.99m,
                SpecsJson = S("850W","80+ Gold","Fully Modular","10 Year Warranty"), Wattage = 850 },
            new() { CategoryId = cat["psu"], Brand = "be quiet!", Name = "Straight Power 11 1000W Plat.", Price = 179.99m,
                SpecsJson = S("1000W","80+ Platinum","Fully Modular","Silent Wings Fan"), Wattage = 1000 },
            new() { CategoryId = cat["psu"], Brand = "Seasonic", Name = "Focus GX-750 750W 80+ Gold",    Price = 109.99m,
                SpecsJson = S("750W","80+ Gold","Fully Modular","10 Year Warranty","Hybrid Fan"), Wattage = 750 },
        };

        db.Components.AddRange(components);
        await db.SaveChangesAsync();
    }

    private static string S(params string[] specs) => JsonSerializer.Serialize(specs);
    private static string J(params string[] values) => JsonSerializer.Serialize(values);
}
