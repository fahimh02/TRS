using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Product.Server.Models;
using System.Security.Claims;
using Zocoapi.server.Models;

namespace Zocoapi.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly FileUploadContext _fileUploadContext;
      
        private readonly UserContext _userContext;

        public FileUploadController(FileUploadContext fileUploadContext, UserContext userContext)
        {
            _fileUploadContext = fileUploadContext;
           
            _userContext = userContext;
        }

        private User GetCurrentUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return null;
            }

            var userId = int.Parse(userIdClaim.Value);
            var user = _userContext.User.Find(userId); // Synchronous call

            if (user != null)
            {
                user.PasswordHash = null; // Remove sensitive information
            }

            return user;
        }
        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try
            {
                // Check if a file is uploaded
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                // Define the file path to save the uploaded file
                var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

                // Ensure the directory exists
                if (!Directory.Exists(uploadsDirectory))
                {
                    Directory.CreateDirectory(uploadsDirectory);
                }

                // Generate the full file path
                var filePath = Path.Combine(uploadsDirectory, file.FileName);

                // Save the file to the specified path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Save file metadata to the database
                var fileUpload = new FileUpload
                {
                    FileName = file.FileName,
                    FilePath = filePath,
                    UploadDate = DateTime.UtcNow
                };

                _fileUploadContext.FileUploads.Add(fileUpload);
                await _fileUploadContext.SaveChangesAsync();

                // Return a success response
                return Ok(new { FilePath = filePath });
            }
            catch (Exception ex)
            {
                // Log the exception (optional, depending on your logging setup)
                // e.g., _logger.LogError(ex, "Error uploading file");

                // Return a generic error response
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }
        //[HttpGet]
        //[Route("image/{fileName}")]
        //public IActionResult GetImage(string fileName)
        //{
        //    try
        //    {
        //        var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "Uploads", fileName);

        //        if (!System.IO.File.Exists(filePath))
        //        {
        //            return NotFound();
        //        }

        //        var fileBytes = System.IO.File.ReadAllBytes(filePath);
        //        var contentType = "image/jpeg"; // Adjust based on file type
        //        return File(fileBytes, contentType);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
        //    }
        //}
    }
}
