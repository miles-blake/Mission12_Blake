using BookstoreApp.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add session state
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add HttpContextAccessor for session access
builder.Services.AddHttpContextAccessor();

// Configure CORS for React client
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add database context
var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "Bookstore.sqlite");
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// Register repository
builder.Services.AddScoped<IBookstoreRepository, EFBookstoreRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseSession();

app.UseAuthorization();

app.MapControllers();

app.Run();
