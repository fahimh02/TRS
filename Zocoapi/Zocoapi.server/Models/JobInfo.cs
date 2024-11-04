using System.ComponentModel.DataAnnotations;

namespace Zocoapi.server.Models
{
    public class JobInfo
    {
        
        public long Id { get; set; }
        public long StyleId { get; set; }
        public long? UnitId { get; set; }
        public string? Job { get; set; }
        public string? StitchType { get; set; }

        [DataType(DataType.MultilineText)]
        public string? StitchDescription { get; set; }
      
        public decimal? StitchCount { get; set; }
        public decimal? SewingAllowance { get; set; }
        public string? NeedleThreadName { get; set; }
        public string? BobbinThreadName { get; set; }
        public string? CoverThreadName { get; set; }
        public decimal? SeamLength { get; set; }
        public decimal? NumberOfLayers { get; set; }
        public decimal? StitchRow { get; set; }
       
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public long? AuthorId { get; set; }
        public long? EditorId { get; set; }
    }
}
