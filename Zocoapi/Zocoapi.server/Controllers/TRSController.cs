using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Product.Server.Models;
using System.Reflection;
using System.Runtime;
using System.Security.Claims;
using Zocoapi.server.Models;
using Zocoapi.server.Models.Mapper;
using static System.Net.Mime.MediaTypeNames;

namespace Zocoapi.server.Controllers
{
    [Route("api/trs")]
    [ApiController]
    public class TRSController : ControllerBase
    {
        private readonly StyleInfoContext _contextStyleInfo;
        private readonly JobInfoContext _contextJobInfo;
        private readonly UserContext _contextUsernfo;
        private readonly ImageInfoContext _contextImageInfo;
        private readonly CalculatedThreadInfoContext _contextCalculatedThreadInfo;

        public TRSController(StyleInfoContext contextStyleInfo, JobInfoContext contextJobInfo, UserContext contextUserInfo,CalculatedThreadInfoContext contextCalculatedThreadInfo, ImageInfoContext contextImageInfo)
        {
            _contextStyleInfo = contextStyleInfo;
            _contextJobInfo = contextJobInfo;
            _contextUsernfo = contextUserInfo;
            _contextCalculatedThreadInfo = contextCalculatedThreadInfo;
            _contextImageInfo = contextImageInfo;
        }
        private User GetCurrentUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return null;
            }

            var userId = int.Parse(userIdClaim.Value);
            var user = _contextUsernfo.User.Find(userId); // Synchronous call

            if (user != null)
            {
                user.PasswordHash = null; // Remove sensitive information
            }

            return user;
        }

        [HttpGet("current")]
        public ActionResult<User> GetCurrentUserAction()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return Unauthorized("User not authenticated.");
            }

            return user;
        }
        
        #region StyleInfo


        // GET: api/trs/styleinfo
        [HttpGet("styleinfo")]
        public async Task<ActionResult<IEnumerable<StyleInfo>>> GetStyleInfos()
        {
            try
            {
                var user = GetCurrentUser();
                return await _contextStyleInfo.StyleInfo.ToListAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("mystyleinfo")]
        public async Task<ActionResult<IEnumerable<StyleInfo>>> GetMyStyleInfos()
        {
            try
            {
                var user = GetCurrentUser();
                if (user == null) {
                    return NotFound();
                }
                else
                {
                    return await _contextStyleInfo.StyleInfo.Where(x=>x.AuthorId==user.Id).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET: api/trs/styleinfo/5
        [HttpGet("styleinfo/{id}")]
        public async Task<ActionResult<StyleInfo>> GetStyleInfo(long id)
        {
            var styleInfo = await _contextStyleInfo.StyleInfo.FindAsync(id);
            

            if (styleInfo == null)
            {
                return NotFound();
            }

            return styleInfo;
        }

        // POST: api/trs/styleinfo
        [HttpPost("styleinfo")]
        public async Task<ActionResult<StitchInfo>> PostStyleInfo(StyleInfo styleInfo)
        {
            try
            {
                var user = GetCurrentUser();
                if (user != null)
                {
                    styleInfo.AuthorId = user.Id;// DateTime.Now;
                    styleInfo.EditorId = user.Id;// DateTime.Now;
                }
                
                styleInfo.Created = DateTime.Now;
                styleInfo.Modified = DateTime.Now;
                
                _contextStyleInfo.StyleInfo.Add(styleInfo);
                await _contextStyleInfo.SaveChangesAsync();

                return CreatedAtAction(nameof(GetStyleInfo), new { id = styleInfo.Id }, styleInfo);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/trs/styleinfo/5
        [HttpPut("styleinfo/{id}")]
        public async Task<IActionResult> PutStyleInfo(long id, StyleInfo styleInfo)
        {
            try
            {
                if (id != styleInfo.Id)
                {
                    return BadRequest();
                }
                var user = GetCurrentUser();
                if (user != null)
                {
  
                    styleInfo.EditorId = user.Id;// DateTime.Now;
                }
                styleInfo.Modified=DateTime.Now;

                _contextStyleInfo.Entry(styleInfo).State = EntityState.Modified;

                try
                {
                    await _contextStyleInfo.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StyleInfoExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        // DELETE: api/trs/styleinfo/5
        [HttpDelete("styleinfo/{id}")]
        public async Task<IActionResult> DeleteStyleInfo(long id)
        {
            using (var transaction = await _contextStyleInfo.Database.BeginTransactionAsync()) 
            {
                try
                {
                    var styleInfo = await _contextStyleInfo.StyleInfo.FindAsync(id);
                    if (styleInfo == null)
                    {
                        return NotFound();
                    }

                    List<ImageInfo> ImageInfos = _contextImageInfo.ImageInfo.Where(x => x.StyleId == styleInfo.Id).ToList();
                    if (ImageInfos.Count > 0)
                    {
                        foreach (var imageInfo in ImageInfos)
                        {
                            _contextImageInfo.ImageInfo.Remove(imageInfo);
                        }
                        await _contextImageInfo.SaveChangesAsync();
                    }

                    List<JobInfo> jobInfos = _contextJobInfo.JobInfo.Where(x => x.StyleId == styleInfo.Id).ToList();
                    if (jobInfos.Count > 0)
                    {
                        foreach (var jobInfo in jobInfos)
                        {
                            _contextJobInfo.JobInfo.Remove(jobInfo);
                        }
                        await _contextJobInfo.SaveChangesAsync();
                    }

                    List<CalculatedThreadInfo> calcInfos = _contextCalculatedThreadInfo.CalculatedThreadInfo.Where(x => x.StyleId == styleInfo.Id).ToList();
                    if (jobInfos.Count > 0)
                    {
                        foreach (var calcInfo in calcInfos)
                        {
                            _contextCalculatedThreadInfo.CalculatedThreadInfo.Remove(calcInfo);
                        }
                        await _contextCalculatedThreadInfo.SaveChangesAsync();
                    }

                    _contextStyleInfo.StyleInfo.Remove(styleInfo);
                    await _contextStyleInfo.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(ex.Message);
                }
            }
             


        }

        private bool StyleInfoExists(long id)
        {
            return _contextStyleInfo.StyleInfo.Any(e => e.Id == id);
        }

        #endregion

        #region JobInfo


        // GET: api/trs/jobinfo
        [HttpGet("jobinfo")]
        public async Task<ActionResult<IEnumerable<JobInfo>>> GetJobInfos()
        {
            try
            {
                return await _contextJobInfo.JobInfo.ToListAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET: api/trs/jobinfo/5
        [HttpGet("jobinfo/{id}")]
        public async Task<ActionResult<JobInfo>> GetJobInfo(long id)
        {
            var stitchInfo = await _contextJobInfo.JobInfo.FindAsync(id);

            if (stitchInfo == null)
            {
                return NotFound();
            }

            return stitchInfo;
        }

        // POST: api/trs/jobinfo
        [HttpPost("jobinfo")]
        public async Task<ActionResult<StitchInfo>> PostJobInfo(JobInfo jobInfo)
        {
            try
            {
                jobInfo.Created = DateTime.Now;
                jobInfo.Modified = DateTime.Now;
                var user = GetCurrentUser();
                if (user != null)
                {
                    jobInfo.AuthorId = user.Id;// DateTime.Now;
                    jobInfo.EditorId = user.Id;// DateTime.Now;
                }
                _contextJobInfo.JobInfo.Add(jobInfo); 
                await _contextJobInfo.SaveChangesAsync();

                return CreatedAtAction(nameof(GetJobInfo), new { id = jobInfo.Id }, jobInfo);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/trs/jobinfo/5
        [HttpPut("jobinfo/{id}")]
        public async Task<IActionResult> PutJobInfo(long id, JobInfo jobInfo)
        {
            try
            {
                if (id != jobInfo.Id)
                {
                    return BadRequest();
                }
                var user = GetCurrentUser();
                if (user != null)
                {
                    jobInfo.EditorId = user.Id;// DateTime.Now;
                }
                jobInfo.Modified = DateTime.Now;
                _contextJobInfo.Entry(jobInfo).State = EntityState.Modified;

                try
                {
                    await _contextJobInfo.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!JobInfoExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        // DELETE: api/trs/jobinfo/5
        [HttpDelete("jobinfo/{id}")]
        public async Task<IActionResult> DeleteJobInfo(long id)
        {
            try
            {
                var stitchInfo = await _contextJobInfo.JobInfo.FindAsync(id);
                if (stitchInfo == null)
                {
                    return NotFound();
                }

                _contextJobInfo.JobInfo.Remove(stitchInfo);
                await _contextJobInfo.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        private bool JobInfoExists(long id)
        {
            return _contextJobInfo.JobInfo.Any(e => e.Id == id);
        }
        [HttpGet("jobinfobystyleid/{id}")]
        public async Task<List<JobInfo>> GetJobInfoByStyleId(long id)
        {
            List<JobInfo> jobInfos = new List<JobInfo>();

            jobInfos = await _contextJobInfo.JobInfo.Where(x => x.StyleId == id).ToListAsync();
            if (jobInfos.Count == 0)
            {
                return null;  // If no job info is found, you return null. Consider returning an empty list instead for better practice.
            }
            else
            {
                return jobInfos;
            }
        }

        

        #endregion

        #region CalculatedThreadInfo


        // GET: api/trs/calculatedthreadinfo
        [HttpGet("calculatedthreadinfo")]
        public async Task<ActionResult<IEnumerable<CalculatedThreadInfo>>> GetCalculatedThreadInfos()
        {
            try
            {
                return await _contextCalculatedThreadInfo.CalculatedThreadInfo.ToListAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET: api/trs/calculatedthreadinfo/5
        [HttpGet("calculatedthreadinfo/{id}")]
        public async Task<ActionResult<CalculatedThreadInfo>> GetCalculatedThreadInfo(long id)
        {
            var calculatedThreadInfo = await _contextCalculatedThreadInfo.CalculatedThreadInfo.FindAsync(id);

            if (calculatedThreadInfo == null)
            {
                return NotFound();
            }

            return calculatedThreadInfo;
        }

        // POST: api/trs/calculatedthreadinfo
        [HttpPost("calculatedthreadinfo")]
        public async Task<ActionResult<StitchInfo>> PostCalculatedThreadInfo(CalculatedThreadInfo calculatedThreadInfo)
        {
            try
            {
                calculatedThreadInfo.Created = DateTime.Now;
                calculatedThreadInfo.Modified = DateTime.Now;
                var user = GetCurrentUser();
                if (user != null)
                {
                    calculatedThreadInfo.AuthorId = user.Id;// DateTime.Now;
                    calculatedThreadInfo.EditorId = user.Id;// DateTime.Now;
                }
                _contextCalculatedThreadInfo.CalculatedThreadInfo.Add(calculatedThreadInfo);
                await _contextCalculatedThreadInfo.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCalculatedThreadInfo), new { id = calculatedThreadInfo.Id }, calculatedThreadInfo);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/trs/calculatedthreadinfo/5
        [HttpPut("calculatedthreadinfo/{id}")]
        public async Task<IActionResult> PutCalculatedThreadInfo(long id, CalculatedThreadInfo calculatedThreadInfo)
        {
            try
            {
                if (id != calculatedThreadInfo.Id)
                {
                    return BadRequest();
                }
                var user = GetCurrentUser();
                if (user != null)
                {
                    calculatedThreadInfo.EditorId = user.Id;// DateTime.Now;
                }
                calculatedThreadInfo.Modified = DateTime.Now;
                _contextCalculatedThreadInfo.Entry(calculatedThreadInfo).State = EntityState.Modified;

                try
                {
                    await _contextCalculatedThreadInfo.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CalculatedThreadInfoExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        // DELETE: api/trs/calculatedthreadinfo/5
        [HttpDelete("calculatedthreadinfo/{id}")]
        public async Task<IActionResult> DeleteCalculatedThreadInfo(long id)
        {
            try
            {
                var calculatedThreadInfo = await _contextCalculatedThreadInfo.CalculatedThreadInfo.FindAsync(id);
                if (calculatedThreadInfo == null)
                {
                    return NotFound();
                }

                _contextCalculatedThreadInfo.CalculatedThreadInfo.Remove(calculatedThreadInfo);
                await _contextCalculatedThreadInfo.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        private bool CalculatedThreadInfoExists(long id)
        {
            return _contextCalculatedThreadInfo.CalculatedThreadInfo.Any(e => e.Id == id);
        }
        private async Task<List<CalculatedThreadInfo>> GetCalculatedThreadInfoByStyleId(long styleId)
        {
            List<CalculatedThreadInfo> jobInfos = new List<CalculatedThreadInfo>();

            jobInfos = await _contextCalculatedThreadInfo.CalculatedThreadInfo.Where(x => x.StyleId == styleId).ToListAsync();
            if (jobInfos.Count == 0)
            {
                return null;  // If no job info is found, you return null. Consider returning an empty list instead for better practice.
            }
            else
            {
                return jobInfos;
            }
        }


        #endregion

        #region Mapper functions 

        [HttpPost("stylemapperinfo")]
        public async Task<ActionResult<StyleInfo>> PostStyleMapperInfo( StyleInfoMapper newMappedData)
        {
            using (var transaction = await _contextStyleInfo.Database.BeginTransactionAsync())
            {
                try
                {
                    var user = GetCurrentUser();
                    StyleInfo style = newMappedData.style;

                    if (user != null)
                    {
                        style.AuthorId = user.Id;
                        style.EditorId = user.Id;
                    }

                    style.Created = DateTime.Now;
                    style.Modified = DateTime.Now;

                    // Add the StyleInfo to the database
                    _contextStyleInfo.StyleInfo.Add(style);
                    await _contextStyleInfo.SaveChangesAsync();

                    // Save related JobInfo records
                    if (newMappedData.jobs != null && newMappedData.jobs.Any())
                    {
                        foreach (var job in newMappedData.jobs)
                        {
                            JobInfo jobInfo = new JobInfo();
                            jobInfo = job;
                            jobInfo.StyleId = style.Id; // Link the job to the saved style
                            jobInfo.Id =0;
                            if (user != null)
                            {
                                jobInfo.AuthorId = user.Id;
                                jobInfo.EditorId = user.Id;
                            }
                            job.Created = DateTime.Now;
                            job.Modified = DateTime.Now;
                            _contextJobInfo.JobInfo.Add(jobInfo);
                        }
                        await _contextJobInfo.SaveChangesAsync();
                    }

                    // Save related CalculatedThreadInfo records
                    if (newMappedData.calculatedInfos != null && newMappedData.calculatedInfos.Any())
                    {
                        foreach (var calculatedInfo in newMappedData.calculatedInfos)
                        {
                            CalculatedThreadInfo calculatedThreadInfo = new CalculatedThreadInfo();
                            calculatedThreadInfo = calculatedInfo;

                            if (user != null)
                            {
                                calculatedThreadInfo.AuthorId = user.Id;
                                calculatedThreadInfo.EditorId = user.Id;
                            }
                            calculatedThreadInfo.Created = DateTime.Now;
                            calculatedThreadInfo.Modified = DateTime.Now;

                            calculatedThreadInfo.StyleId = style.Id; // Link calculated info to the saved style
                            calculatedThreadInfo.Id = 0;
                            _contextCalculatedThreadInfo.CalculatedThreadInfo.Add(calculatedThreadInfo);
                        }
                        await _contextCalculatedThreadInfo.SaveChangesAsync();
                    }

                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();

                    return CreatedAtAction(nameof(GetStyleInfo), new { id = style.Id }, style);
                }
                catch (Exception ex)
                {
                    // Rollback the transaction in case of an error
                    await transaction.RollbackAsync();
                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpPut("stylemapperinfo/{id}")]
        public async Task<ActionResult<StitchInfo>> PutStyleMapperInfo(long id, [FromBody] StyleInfoMapper styleInfo)

        {
            using (var transaction = await _contextStyleInfo.Database.BeginTransactionAsync())
            {
                try
                {
                    var user = GetCurrentUser();
                    StyleInfo style = styleInfo.style;

                    if (user != null)
                    {
                        style.AuthorId = user.Id;
                        style.EditorId = user.Id;
                    }
                    if(styleInfo.style.Id==0)
                    {
                        style.Created = DateTime.Now;
                        style.Modified = DateTime.Now;
                        _contextStyleInfo.StyleInfo.Add(style);

                    }
                    else
                    {
                        style.Modified = DateTime.Now;
                        _contextStyleInfo.StyleInfo.Update(style);
                    }
                    await _contextStyleInfo.SaveChangesAsync();

                    // Save related JobInfo records
                    if (styleInfo.jobs != null && styleInfo.jobs.Any())
                    {
                        foreach (var job in styleInfo.jobs)
                        {
                            JobInfo jobInfo = new JobInfo();
                            jobInfo = job;
                            jobInfo.StyleId = style.Id; // Link the job to the saved style
                            if (user != null)
                            {
                                jobInfo.AuthorId = user.Id;
                                jobInfo.EditorId = user.Id;
                            }
                            if (jobInfo.Id == 0)
                            {
                                jobInfo.Created = DateTime.Now;
                                jobInfo.Modified = DateTime.Now;
                                _contextJobInfo.JobInfo.Add(jobInfo);

                            }
                            else
                            {
                                jobInfo.Modified = DateTime.Now;
                                _contextJobInfo.JobInfo.Update(jobInfo);
                            }
                        }
                        List<JobInfo> allJobs = _contextJobInfo.JobInfo.Where(x => x.StyleId == styleInfo.style.Id).ToList();
                        foreach (var job in allJobs)
                        {
                            long jobId = job.Id;

                            // Check if styleInfo.jobs does not contain the jobId
                            if (!styleInfo.jobs.Any(j => j.Id == jobId))
                            {
                                // Logic to delete the job
                                // Assuming you have a method to delete a job from styleInfo.jobs
                                //styleInfo.jobs.Remove(job); // Adjust this line if your structure is different
                                _contextJobInfo.JobInfo.Remove(job);
                            }
                        }

                        await _contextJobInfo.SaveChangesAsync();
                    }

                    // Save related CalculatedThreadInfo records
                    if (styleInfo.calculatedInfos != null && styleInfo.calculatedInfos.Any())
                    {
                        foreach (var calculatedInfo in styleInfo.calculatedInfos)
                        {
                            CalculatedThreadInfo calculatedThreadInfo = new CalculatedThreadInfo();
                            calculatedThreadInfo = calculatedInfo;

                            if (user != null)
                            {
                                calculatedThreadInfo.AuthorId = user.Id;
                                calculatedThreadInfo.EditorId = user.Id;
                            }
                            if (calculatedThreadInfo.Id == 0)
                            {
                                calculatedThreadInfo.StyleId = style.Id;
                                calculatedThreadInfo.Created = DateTime.Now;
                                calculatedThreadInfo.Modified = DateTime.Now;
                                _contextCalculatedThreadInfo.CalculatedThreadInfo.Add(calculatedThreadInfo);

                            }
                            else
                            {
                                calculatedThreadInfo.Modified = DateTime.Now;
                                _contextCalculatedThreadInfo.CalculatedThreadInfo.Update(calculatedThreadInfo);
                            }
                        }
                        await _contextCalculatedThreadInfo.SaveChangesAsync();
                    }
                    // Save related Images
                    List<ImageInfo> ImageInfos = _contextImageInfo.ImageInfo.Where(x => x.StyleId == styleInfo.style.Id).ToList();
                    if (ImageInfos.Count > 0)
                    {
                        foreach (var imageInfo in ImageInfos)
                        {
                            _contextImageInfo.ImageInfo.Remove(imageInfo);
                        }
                        await _contextImageInfo.SaveChangesAsync();
                    }
                    
                    if (styleInfo.Images != null && styleInfo.Images.Any())
                    {
                        
                        foreach (var imageInfo in styleInfo.Images)
                        {
                            ImageInfo image = new ImageInfo
                            {
                                ImageUrl = imageInfo.ImageUrl,
                                StyleId = style.Id,
                                CreatedAt= DateTime.Now
                            };

                            // Optionally, handle author/editor IDs if needed
                            if (user != null)
                            {
                                // Add any additional fields here if necessary
                            }

                            // Assuming you have a context for images, add the image
                            _contextImageInfo.ImageInfo.Add(image); // Adjust to your actual context
                        }
                        await _contextImageInfo.SaveChangesAsync();
                    }

                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();

                    return CreatedAtAction(nameof(GetStyleInfo), new { id = style.Id }, style);
                }
                catch (Exception ex)
                {
                    // Rollback the transaction in case of an error
                    await transaction.RollbackAsync();
                    return BadRequest(ex.Message);
                }
            }
        }
        // GET: api/trs/styleinfo/5
        [HttpGet("stylemapperinfo/{id}")]
        public async Task<ActionResult<StyleInfoMapper>> GetStyleMapperInfo(long id)
        {
            try {
                var styleInfo = await _contextStyleInfo.StyleInfo.FindAsync(id);
                StyleInfoMapper styleInfoMapper = new StyleInfoMapper();
                if (styleInfo != null)
                {
                    styleInfoMapper.style = styleInfo;
                    styleInfoMapper.jobs = await GetJobInfoByStyleId(styleInfo.Id);
                    styleInfoMapper.calculatedInfos = await GetCalculatedThreadInfoByStyleId(styleInfo.Id);
                    styleInfoMapper.Images = await _contextImageInfo.ImageInfo
                    .Where(img => img.StyleId == styleInfo.Id)
                    .ToListAsync(); // Adjust if you have a different context for images
                        return styleInfoMapper;
                    }
                return null;
            }
            catch (Exception ex)
            {
                 return NotFound(ex.Message);
            }
        }
        #endregion

    }
}
