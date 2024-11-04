namespace Zocoapi.server.Models
{
    public class ImageInfo
    {
        public long Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // URL or base64 string of the image
        public long StyleId { get; set; } // Associated StyleId
        public DateTime CreatedAt { get; set; }
    }
}
