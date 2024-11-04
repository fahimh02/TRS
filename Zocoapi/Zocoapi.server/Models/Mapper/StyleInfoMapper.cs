namespace Zocoapi.server.Models.Mapper
{
    public class StyleInfoMapper
    {
        public StyleInfo style{ get; set; }
        public List<JobInfo>? jobs { get; set; }
        public List<CalculatedThreadInfo>? calculatedInfos { get; set; }
        public List<ImageInfo>? Images { get; set; }
    }
}
