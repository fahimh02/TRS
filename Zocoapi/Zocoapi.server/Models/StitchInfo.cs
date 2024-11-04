namespace Zocoapi.server.Models
{
    public class StitchInfo
    {
        public long Id { get; set; }
        public string? StitchType { get; set; }
        public string? StitchName { get; set; }
        public decimal? SeamWidth { get; set; } 

      
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public long? AuthorId { get; set; }
        public long? EditorId { get; set; }
        public bool IsActive { get; set; }


    }
}
