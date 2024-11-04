namespace Zocoapi.server.Models.ViewModels
{
    public class stichInfoViewModel
    {
        public long id { get; set; }
        public string? stitchType { get; set; }
        public string? stitchName { get; set; }
        public decimal? seamWidth { get; set; }

        public DateTime? created { get; set; }
        public DateTime? modified { get; set; }
        public long? authorId { get; set; }
        public string? authorName { get; set; }
        public long? editorId { get; set; }
        public string? editorName { get; set; }


        public bool isActive { get; set; }
    }
}
