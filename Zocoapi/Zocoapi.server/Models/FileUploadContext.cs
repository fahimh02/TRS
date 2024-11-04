using Microsoft.EntityFrameworkCore;

namespace Zocoapi.server.Models
{
   
    public class FileUploadContext : DbContext
    {
        public FileUploadContext(DbContextOptions<FileUploadContext> options)
            : base(options)
        { }

        public DbSet<FileUpload> FileUploads { get; set; }
    }

}
