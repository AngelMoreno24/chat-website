using backend.Data;
using DotNetEnv;
using Microsoft.EntityFrameworkCore; 

var builder = WebApplication.CreateBuilder(args);

// Load .env file
Env.Load();

// Get connection string from environment variables
var connectionString = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTION");

if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Database connection string is missing.");
}

// Register ApplicationDbContext with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add services to the container.
builder.Services.AddControllers();
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
app.UseAuthorization();
app.MapControllers();
app.Run();