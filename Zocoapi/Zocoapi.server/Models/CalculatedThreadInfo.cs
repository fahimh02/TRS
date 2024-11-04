using System.ComponentModel.DataAnnotations;

namespace Zocoapi.server.Models
{
    public class CalculatedThreadInfo
    {
        public long Id { get; set; }
        public long StyleId { get; set; }
        public long? UnitId { get; set; }
        public long? CurrencyId { get; set; }
        public decimal? NetConsumption { get; set; }
        public decimal? SewingAllowance { get; set; }
        public decimal? TotalConsumption { get; set; }
        public decimal? PricePerCone { get; set; }
        public decimal? ThreadCosting { get; set; }
        public decimal? TotalCone { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public long? AuthorId { get; set; }
        public long? EditorId { get; set; }
    }
    
}
