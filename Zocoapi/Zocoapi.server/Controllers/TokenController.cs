using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Product.Server.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;

namespace Product.Server.Controllers
{
    [Route("api/token")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly JwtSettings _jwtSettings;

        public TokenController(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }

        [HttpGet("validate")]
        [Authorize] // Asegura que solo los usuarios autenticados puedan acceder a esta acción
        public IActionResult ValidateToken()
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);

            try
            {
                // Obtiene el token desde la cabecera Authorization (Bearer <token>)
                var tokenString = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                // Valida el token y obtiene la información contenida en él
                tokenHandler.ValidateToken(tokenString, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidAudience = _jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero // No permitir margen de tiempo para expiración del token
                }, out SecurityToken validatedToken);

                // Si la validación es exitosa, el token es válido
                return Ok(new { Message = "Token is valid." });
            }
            catch (Exception ex)
            {
                // Manejo de excepciones en caso de token inválido o expirado
                return Unauthorized(new { Message = "Invalid token." });
            }
        }
    }
}
