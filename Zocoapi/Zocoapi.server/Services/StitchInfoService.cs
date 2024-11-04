using Zocoapi.server.Models.ViewModels;
using Zocoapi.server.Models;

namespace Zocoapi.server.Services
{

   
    public class StitchInfoService
    {
        // This method converts a StitchInfo model to a stitchInfoViewModel
        public stichInfoViewModel ConvertToViewModel(StitchInfo model, string? authorName, string? editorName)
        {
            return new stichInfoViewModel
            {
                id = model.Id,
                stitchType = model.StitchType,
                stitchName = model.StitchName,
                seamWidth = model.SeamWidth,
                created = model.Created,
                modified = model.Modified,
                authorId = model.AuthorId,
                authorName = authorName, // Assume you are passing author name from outside
                editorId = model.EditorId,
                editorName = editorName  // Assume you are passing editor name from outside
            };
        }
    }
}
