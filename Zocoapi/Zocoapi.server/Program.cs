using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Product.Server.Models;
using System.Text;
using Zocoapi.server.Models;

var builder = WebApplication.CreateBuilder(args);

// DbContext Configuration for various contexts
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ProductContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ArticleInfoContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<CalculatedThreadInfoContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<UnitContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<CategoryContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ContributionContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<UserContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<StitchInfoContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<StyleInfoContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<JobInfoContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<FileUploadContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ImageInfoContext>(options => options.UseSqlServer(connectionString));

// JWT Authentication Configuration
var jwtSettingsSection = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettingsSection);
var jwtSettings = jwtSettingsSection.Get<JwtSettings>();
var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// Authorization Configuration
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    //string allowedOrigins = "https://trsapp-frghbmg3ech0dudd.southeastasia-01.azurewebsites.net";
    string allowedOrigins = builder.Configuration.GetValue<string>("CorsSettings:AllowedOrigins");
    options.AddPolicy("AllowSpecificOrigin",
        corsBuilder => corsBuilder.WithOrigins(allowedOrigins)
                                  .AllowAnyMethod()
                                  .AllowAnyHeader()
                                  .AllowCredentials()
                                  .SetPreflightMaxAge(TimeSpan.FromMinutes(10)));
});

// Add Controllers
builder.Services.AddControllers();

// Swagger/OpenAPI Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Product API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// Middleware pipeline configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Product API v1"));
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
