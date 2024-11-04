namespace Zocoapi.server.Models.ViewModels
{
    public class contributionViewModel
    {
        public long id { get; set; }
        public long? stitchId { get; set; }
        public decimal? needle { get; set; }
        public decimal? bobbin { get; set; }
        public decimal? cover { get; set; }
        public decimal? total { get; set; }
        public DateTime? created { get; set; }
        public DateTime? modified { get; set; }
        public long? editorId { get; set; }
        public long? authorId { get; set; }
        public string? authorName { get; set; }
        public string? editorName { get; set; }
        public bool isActive { get; set; }
    }
}
