namespace Zocoapi.server.Models.ViewModels
{
    public class userInfoViewModel
    {
        public long id { get; set; }
        public string? username { get; set; }
        public string? email { get; set; }
        public string? role { get; set; }

        public DateTime? created { get; set; }
        public DateTime? modified { get; set; }

        public long? authorId { get; set; }
        public bool? isActive { get; set; }
        public string? authorName { get; set; }
        public long? editorId { get; set; }
        public string? editorName { get; set; }
    }
}
