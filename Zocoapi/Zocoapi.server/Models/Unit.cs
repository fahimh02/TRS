namespace Zocoapi.server.Models
{
    public class Unit
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
        public long EditorId { get; set; }
        public long AuthorId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
