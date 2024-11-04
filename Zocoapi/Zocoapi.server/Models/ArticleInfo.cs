namespace Zocoapi.server.Models
{
    public class ArticleInfo
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public decimal? Length { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public long? EditorId { get; set; }
        public long? AuthorId { get; set; }

        public bool IsActive { get; set; }
    }
}
