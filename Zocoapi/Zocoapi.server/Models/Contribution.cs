using System.Numerics;

namespace Zocoapi.server.Models
{
    public class Contribution
    {
        public long Id { get; set; }
        public long? StitchId { get; set; }
        public decimal? Needle { get; set; }
        public decimal? Bobbin { get; set; }
        public decimal? Cover { get; set; }
        public decimal? Total { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public long? EditorId { get; set; }
        public long? AuthorId { get; set; }
        public bool IsActive { get; set; }
    }
}
