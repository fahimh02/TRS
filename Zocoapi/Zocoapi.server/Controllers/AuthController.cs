using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Product.Server.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace Product.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtSettings _jwtSettings;
        private readonly UserContext _userContext;

        public AuthController(IOptions<JwtSettings> jwtSettings, UserContext userContext)
        {
            _jwtSettings = jwtSettings.Value;
            _userContext = userContext;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginRequest userLogin)
        {
            try
            {
                var user = _userContext.User.SingleOrDefault(u => u.Username == userLogin.Username);

                if (user == null || !BCrypt.Net.BCrypt.Verify(userLogin.Password, user.PasswordHash))
                {
                    return Unauthorized(new { Message = "Invalid username or password." });
                }
                if (user.IsActive== false)
                {
                    return Unauthorized(new { Message = "Unauthorized" });
                }

                var token = GenerateJwtToken(user);

                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingUser = _userContext.User.FirstOrDefault(u => u.Username == request.Username);
                if (existingUser != null)
                {
                    return BadRequest(new { Message = "Username already exists." });
                }

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var newUser = new User
                {
                    Username = request.Username,
                    PasswordHash = hashedPassword,
                    Email = request.Email,
                    Role = "user",
                    IsActive = true,
                    Created = DateTime.Now,
                    Modified = DateTime.Now,
                    AuthorId = 0,
                    EditorId = 0
                };

                _userContext.User.Add(newUser);
                _userContext.SaveChanges();

                var token = GenerateJwtToken(newUser);

                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class UserLoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserRegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
