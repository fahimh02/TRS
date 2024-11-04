using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Product.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Zocoapi.server.Models.ViewModels;

namespace Zocoapi.server.Controllers


{


    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<string?> GetUserNameByIdAsync(long? userId)
        {
            if (userId == null)
            {
                return null;
            }

            // Asynchronously retrieve the user from the database using FirstOrDefaultAsync
            var user = await _context.User
                .Where(u => u.Id == userId) // Assuming the primary key is 'Id'
                .FirstOrDefaultAsync();

            if (user != null)
            {
                return user.Username; // Assuming the User entity has a UserName property
            }

            return null; // Return null if the user is not found
        }

        //GET: api/Users
        // [HttpGet]
        //public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        //{
        //    var username = User.Identity.Name;

        //    var user = await _context.User.FirstOrDefaultAsync(u => u.Username == username);

        //    if (user == null || user.Role != "admin")
        //    {
        //        return Forbid(); // O puedes devolver Unauthorized() dependiendo de tu lógica de permisos
        //    }

        //    return await _context.User.ToListAsync();
        //}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<userInfoViewModel>>> GetUsers()
        {
            //var username = User.Identity.Name;
            var username = User.Identity.Name;

            var user = await _context.User.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null || user.Role != "admin")
            {
                return Forbid(); // O puedes devolver Unauthorized() dependiendo de tu lógica de permisos
            }

            List<userInfoViewModel> userInfoViewModels = new List<userInfoViewModel>();
            userInfoViewModel userInfoViewModel = new userInfoViewModel();


            List<User> users = await _context.User.ToListAsync();
            foreach (var usertemp in users)
            {
                userInfoViewModel = new userInfoViewModel();
                userInfoViewModel.id = usertemp.Id;
                userInfoViewModel.username = usertemp.Username;
                userInfoViewModel.email = usertemp.Email;
                userInfoViewModel.role = usertemp.Role;
                userInfoViewModel.created = usertemp.Created;
                userInfoViewModel.modified = usertemp.Modified;
                userInfoViewModel.authorId = usertemp.AuthorId;
                userInfoViewModel.editorId = usertemp.EditorId;
                userInfoViewModel.isActive = usertemp.IsActive;
        
                userInfoViewModel.authorName = await GetUserNameByIdAsync(usertemp.AuthorId);
                userInfoViewModel.editorName = await GetUserNameByIdAsync(usertemp.EditorId);
                userInfoViewModels.Add(userInfoViewModel);

            }
            return userInfoViewModels;
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] User newUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);  // Return validation errors
            }

            var username = User.Identity.Name;

            // Get the current logged-in user to check if they are an admin
            var currentUser = await _context.User.FirstOrDefaultAsync(u => u.Username == username);
            if (currentUser == null || currentUser.Role != "admin")
            {
                return Forbid();  // Only admin can create new users
            }

            // Check if the username or email already exists
            var userExists = await _context.User.AnyAsync(u => u.Username == newUser.Username || u.Email == newUser.Email);
            if (userExists)
            {
                return Conflict(new { message = "A user with the same username or email already exists." });
            }

            // Here, you would hash the password before saving it.
            if (string.IsNullOrEmpty(newUser.PasswordHash))
            {
                return BadRequest(new { message = "Password is required." });
            }

            // Example: Hashing the password (you should use a proper hashing library like BCrypt or similar)
            newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newUser.PasswordHash);

            // Set creation metadata
            newUser.Created = DateTime.Now;
            newUser.AuthorId = currentUser.Id;
            newUser.EditorId = currentUser.Id;
            newUser.IsActive = true;  // Default value for new users
            newUser.Modified = DateTime.Now;  // Set modified to null for new users

            try
            {
                _context.User.Add(newUser);  // Add the new user to the database
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);  // Return 201 Created with user info
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the user.", error = ex.Message });
            }
        }


        // POST: api/Users
        //[HttpPost]
        //public async Task<ActionResult<User>> PostUser(User userToInsert)
        //{
        //    try
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        var existingUser = await _context.User.FirstOrDefaultAsync(u => u.Username == userToInsert.Username);
        //        if (existingUser != null)
        //        {
        //            return BadRequest(new { Message = "Username already exists." });
        //        }

        //        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userToInsert.PasswordHash); // Encriptar la contraseña
        //        User  currentUser = GetCurrentUserModel();
        //        if(currentUser!= null)
        //        {
        //            userToInsert.AuthorId = currentUser.Id;
        //            userToInsert.EditorId = currentUser.Id;
        //        }
        //        userToInsert.PasswordHash = hashedPassword;
        //        userToInsert.Created = DateTime.Now;
        //        userToInsert.Modified   = DateTime.Now;


        //        _context.User.Add(userToInsert);
        //        await _context.SaveChangesAsync();

        //        return CreatedAtAction(nameof(GetUser), new { id = userToInsert.Id }, userToInsert);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, userInfoViewModel updatedUser)
        {
            var username = User.Identity.Name;

            // Get the current logged-in user (admin check)
            var currentUser = await _context.User.FirstOrDefaultAsync(u => u.Username == username);
            if (currentUser == null || currentUser.Role != "admin")
            {
                return Forbid();  // Only admin can update users
            }

            if (id != updatedUser.id)
            {
                return BadRequest();  // Ensure the correct user ID is being updated
            }

            // Retrieve the existing user from the database
            var existingUser = await _context.User.FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser == null)
            {
                return NotFound();  // Return 404 if the user is not found
            }

            // Update only the allowed properties from the view model
            existingUser.Username = updatedUser.username ?? existingUser.Username;  // Preserve existing values if null
            existingUser.Email = updatedUser.email ?? existingUser.Email;
            existingUser.Role = updatedUser.role ?? existingUser.Role;
            existingUser.IsActive = updatedUser.isActive ?? existingUser.IsActive;
            existingUser.Modified = DateTime.Now;
            existingUser.EditorId = currentUser.Id;  // Set the editor to the current user

            // Save changes
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(existingUser);  // Return the updated user information
        }

        private bool UserExists(long id)
        {
            return _context.User.Any(u => u.Id == id);
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var username = User.Identity.Name;

            var currentUser = await _context.User.FirstOrDefaultAsync(u => u.Username == username);

            if (currentUser == null || currentUser.Role != "admin")
            {
                return Forbid(); // O puedes devolver Unauthorized() dependiendo de tu lógica de permisos
            }

            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }
        [ApiExplorerSettings(IgnoreApi = true)]
        private User GetCurrentUserModel()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return null;
            }

            var userId = int.Parse(userIdClaim.Value);
            var userTemp = _context.User.Find(userId); // Synchronous call

            if (userTemp != null)
            {
                userTemp.PasswordHash = null; // Remove sensitive information
            }

            return userTemp;
        }

        [HttpGet("user-role")]
        public IActionResult GetUserRole()
        {
            // Obtiene el claim del rol del usuario
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            if (roleClaim != null)
            {
                string userRole = roleClaim.Value;
                return Ok(new { Role = userRole });
            }

            return Unauthorized("User role not found.");
        }


        // GET: api/Users/current
        [HttpGet("current")]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            // Obtiene el id del usuario desde el claim del token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Busca el usuario en la base de datos por su id
            var user = await _context.User.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            // Elimina el PasswordHash antes de devolver el usuario
            user.PasswordHash = null;

            return user;
        }

        // PATCH: api/Users/current/role/admin
        [HttpPatch("current/role/admin")]
        [Authorize]
        public async Task<ActionResult<User>> ChangeCurrentUserRoleToAdmin()
        {
            // Obtiene el id del usuario desde el claim del token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Busca el usuario en la base de datos por su id
            var user = await _context.User.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Cambia el rol del usuario a "admin"
            user.Role = "admin";

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user); // Devuelve el usuario modificado
        }

        // PATCH: api/Users/current/role/user
        [HttpPatch("current/role/user")]
        [Authorize]
        public async Task<ActionResult<User>> ChangeCurrentUserRoleToUser()
        {
            // Obtiene el id del usuario desde el claim del token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Busca el usuario en la base de datos por su id
            var user = await _context.User.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Cambia el rol del usuario a "user"
            user.Role = "user";

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user); // Devuelve el usuario modificado
        }


    }
}
