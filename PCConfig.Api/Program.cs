using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Data;
using PCConfig.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "CyberRig PC Configurator API", Version = "v1" }));

// SQLite для разработки. Для SQL Server: заменить UseSqlite на UseSqlServer
// и поменять строку подключения на "SqlServer" в appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IComponentService, ComponentService>();
builder.Services.AddScoped<IBuildService, BuildService>();

builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// ── App ───────────────────────────────────────────────────────────────────────
var app = builder.Build();

// Create DB and seed on startup.
// Switch to db.Database.MigrateAsync() after running: dotnet ef migrations add InitialCreate
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
    await DataSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CyberRig API v1"));
}

app.UseStaticFiles();   // serves wwwroot/
app.UseCors();
app.MapControllers();
app.MapFallbackToFile("index.html");  // SPA fallback

app.Run();
