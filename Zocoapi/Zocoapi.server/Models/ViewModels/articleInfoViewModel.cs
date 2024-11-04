namespace Zocoapi.server.Models.ViewModels
{
    public class articleInfoViewModel
    {
        public long id { get; set; }
        public string name { get; set; }
        public decimal? length { get; set; }
        public DateTime? created { get; set; }
        public DateTime? modified { get; set; }
        public long? editorId { get; set; }
        public string? editorName { get; set; }
        public long? authorId { get; set; }
        public string? authorName{ get; set; }

        public bool isActive { get; set; }
    }
}
