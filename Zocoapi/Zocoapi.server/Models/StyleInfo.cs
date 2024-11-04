using System.ComponentModel.DataAnnotations;

namespace Zocoapi.server.Models
{
    public class StyleInfo
    {
        public long Id { get; set; }
        public string? StyleCode { get; set; }
      
        public string? StyleName { get; set; }
        public string? StyleNumber { get; set; }

        [DataType(DataType.MultilineText)]
        public string? StyleDescription { get; set; }
        public decimal? ThicknessFabric { get; set; }
        public string? Season { get; set; }
        public string? BuyerName { get; set; }
        public string? Size { get; set; }
        public decimal? GeneralAllowance { get; set; }
        public decimal? TotalGarments { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public long? AuthorId { get; set; }
        public long? EditorId { get; set; }
    }
}
