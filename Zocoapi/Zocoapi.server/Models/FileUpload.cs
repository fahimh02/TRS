namespace Zocoapi.server.Models
{

    public class FileUpload
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; }
    }

}
