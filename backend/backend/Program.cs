using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Supabase;
using System;

var builder = WebApplication.CreateBuilder(args);

// Load Supabase connection details from environment variables
var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL") ?? "https://your-project.supabase.co";
var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_KEY") ?? "your-anon-key";
var supabaseClient = new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions());

// Register Supabase Client as a Singleton
builder.Services.AddSingleton(supabaseClient);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Enable CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000") // Adjust for deployed frontend
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp"); // Enable CORS
app.UseAuthorization();
app.MapControllers();

app.Run();
