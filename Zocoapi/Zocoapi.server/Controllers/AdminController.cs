using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Product.Server.Models;
using System;
using System.Reflection;
using System.Security.Claims;
using Zocoapi.server.Models;
using Zocoapi.server.Models.ViewModels;
using Zocoapi.server.Services;

namespace Zocoapi.server.Controllers
{
    [Route("api/admin")]
    [ApiController]
    //[Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly StitchInfoContext _context;
        private readonly ContributionContext _contriibutionContext;
        private readonly ArticleInfoContext _articleInfoContext;
        private readonly UserContext _contextUsernfo;
        private readonly UnitContext _contextUnit;



        public AdminController(StitchInfoContext context, ContributionContext contriibutionContext, ArticleInfoContext articleInfoContext, UserContext contextUserInfo, UnitContext contextUnit)
        {
            _context = context;
            _contriibutionContext = contriibutionContext;
            _articleInfoContext = articleInfoContext;
            _contextUsernfo = contextUserInfo;
            _contextUnit = contextUnit;
        }
        [ApiExplorerSettings(IgnoreApi = true)]
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
        [ApiExplorerSettings(IgnoreApi = true)]
        public string? GetUserNameById(long? userId)
        {
            if (userId == null)
            {
                return null;
            }

            // Retrieve the user from the database based on the userId
            var user = _contextUsernfo.User.Find(userId); // Assuming the User entity exists in _contextUsernfo

            if (user != null)
            {
                return user.Username; // Assuming the User entity has a UserName property
            }

            return null; // Return null if the user is not found
        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<string?> GetUserNameByIdAsync(long? userId)
        {
            if (userId == null)
            {
                return null;
            }

            // Asynchronously retrieve the user from the database using FirstOrDefaultAsync
            var user = await _contextUsernfo.User
                .Where(u => u.Id == userId) // Assuming the primary key is 'Id'
                .FirstOrDefaultAsync();

            if (user != null)
            {
                return user.Username; // Assuming the User entity has a UserName property
            }

            return null; // Return null if the user is not found
        }


        #region StitchInfo

        // GET: api/admin/allstitchinfo
        [HttpGet("allstitchinfo")]
        public async Task<ActionResult<IEnumerable<stichInfoViewModel>>> GetAllStitchInfos()
        {
            try
            {
                List<StitchInfo> stitchInfos = new List<StitchInfo>();
                List<stichInfoViewModel> stitchInfoModels = new List<stichInfoViewModel>();
                stitchInfos = await _context.StitchInfos.ToListAsync();

                foreach (var st in stitchInfos)
                {
                    stichInfoViewModel stichInfoViewModel = new stichInfoViewModel
                    {
                        id = st.Id,
                        authorId = st.AuthorId,
                        editorId = st.EditorId,
                        authorName = await GetUserNameByIdAsync(st.AuthorId),
                        editorName = await GetUserNameByIdAsync(st.EditorId),
                        stitchType = st.StitchType,
                        seamWidth = st.SeamWidth,
                        stitchName = st.StitchName,
                        created = st.Created,
                        modified = st.Modified,
                        isActive = st.IsActive

                    };

                    stitchInfoModels.Add(stichInfoViewModel);
                }

                return stitchInfoModels;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/admin/stitchinfo
        [HttpGet("stitchinfo")]
        public async Task<ActionResult<IEnumerable<stichInfoViewModel>>> GetStitchInfos()
        {
            try
            {
                List<StitchInfo> stitchInfos = new List<StitchInfo>();
                List<stichInfoViewModel> stitchInfoModels = new List<stichInfoViewModel>();
                stitchInfos = await _context.StitchInfos.Where(x=> x.IsActive==true).ToListAsync();

                foreach (var st in stitchInfos)
                {
                    stichInfoViewModel stichInfoViewModel = new stichInfoViewModel
                    {
                        id = st.Id,
                        authorId = st.AuthorId,
                        editorId = st.EditorId,
                        authorName = await GetUserNameByIdAsync(st.AuthorId),
                        editorName = await GetUserNameByIdAsync(st.EditorId),
                        stitchType = st.StitchType,
                        seamWidth = st.SeamWidth,
                        stitchName = st.StitchName,
                        created = st.Created,
                        modified = st.Modified,
                        isActive = st.IsActive
                    };

                    stitchInfoModels.Add(stichInfoViewModel);
                }

                return stitchInfoModels;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // GET: api/admin/stitchinfo/{id}
        [HttpGet("stitchinfo/{id}")]
        public async Task<ActionResult<StitchInfo>> GetStitchInfo(long id)
        {
            var stitchInfo = await _context.StitchInfos.FindAsync(id);

            if (stitchInfo == null)
            {
                return NotFound();
            }

            return stitchInfo;
        }

        // POST: api/admin/stitchinfo
        [HttpPost("stitchinfo")]
        public async Task<ActionResult<StitchInfo>> PostStitchInfo(StitchInfo stitchInfo)
        {
            try
            {
                var user = GetCurrentUser();
                stitchInfo.Created = DateTime.Now;
                stitchInfo.Modified = DateTime.Now;

                if (user != null)
                {
                    stitchInfo.AuthorId = user.Id;
                    stitchInfo.EditorId = user.Id;
                }

                _context.StitchInfos.Add(stitchInfo);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetStitchInfo), new { id = stitchInfo.Id }, stitchInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/admin/stitchinfo/{id}
        [HttpPut("stitchinfo/{id}")]
        public async Task<IActionResult> PutStitchInfo(long id, StitchInfo stitchInfo)
        {
            try
            {
                var user = GetCurrentUser();

                if (id != stitchInfo.Id)
                {
                    return BadRequest();
                }

                if (user != null)
                {
                    stitchInfo.EditorId = user.Id;
                }

                stitchInfo.Modified = DateTime.Now;
                _context.Entry(stitchInfo).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StichInfoExists(id))
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

        // DELETE: api/admin/stitchinfo/{id}
        [HttpDelete("stitchinfo/{id}")]
        public async Task<IActionResult> DeleteStitchInfo(long id)
        {
            try
            {
                var stitchInfo = await _context.StitchInfos.FindAsync(id);
                if (stitchInfo == null)
                {
                    return NotFound();
                }

                _context.StitchInfos.Remove(stitchInfo);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

       
        private bool StichInfoExists(long id)
        {
            return _context.StitchInfos.Any(e => e.Id == id);
        }

        #endregion


        #region Unit
        // GET: api/admin/stitchinfo
        [HttpGet("allunit")]
        public async Task<ActionResult<IEnumerable<unitViewModel>>> GetAllUnits()
        {
            try
            {
                List<Unit> units = new List<Unit>();
                List<unitViewModel> unitViewModels = new List<unitViewModel>();
                StitchInfoService service = new StitchInfoService();
                units = await _contextUnit.Units.ToListAsync();
                foreach (var st in units)
                {
                    unitViewModel unitViewModel = new unitViewModel();
                    unitViewModel.id = st.Id;
                    unitViewModel.authorId = st.AuthorId;
                    unitViewModel.editorId = st.EditorId;
                    unitViewModel.authorName = await GetUserNameByIdAsync(st.AuthorId);
                    unitViewModel.editorName = await GetUserNameByIdAsync(st.EditorId);
                    unitViewModel.name = st.Name;
                    unitViewModel.isActive = st.IsActive;
                    unitViewModel.created = st.Created;
                    unitViewModel.modified = st.Modified;
                    unitViewModel.description = st.Description;

                    // var viewModel = service.ConvertToViewModel(st, GetUserNameById(st.AuthorId) , GetUserNameById(st.EditorId) );
                    unitViewModels.Add(unitViewModel);

                }


                return unitViewModels;

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("unit")]
        public async Task<ActionResult<IEnumerable<unitViewModel>>> GetActiveUnits()
        {
            try
            {
                List<Unit> units = new List<Unit>();
                List<unitViewModel> unitViewModels = new List<unitViewModel>();
                StitchInfoService service = new StitchInfoService();
                units = await _contextUnit.Units.Where(x => x.IsActive == true).ToListAsync();
                foreach (var st in units)
                {
                    unitViewModel unitViewModel = new unitViewModel();
                    unitViewModel.id = st.Id;
                    unitViewModel.authorId = st.AuthorId;
                    unitViewModel.editorId = st.EditorId;
                    unitViewModel.authorName = await GetUserNameByIdAsync(st.AuthorId);
                    unitViewModel.editorName = await GetUserNameByIdAsync(st.EditorId);
                    unitViewModel.name = st.Name;
                    unitViewModel.isActive = st.IsActive;
                    unitViewModel.created = st.Created;
                    unitViewModel.modified = st.Modified;
                    unitViewModel.description = st.Description;

                    // var viewModel = service.ConvertToViewModel(st, GetUserNameById(st.AuthorId) , GetUserNameById(st.EditorId) );
                    unitViewModels.Add(unitViewModel);

                }


                return unitViewModels;

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        // GET: api/admin/stitchinfo/5
        [HttpGet("unit/{id}")]
        public async Task<ActionResult<unitViewModel>> GetUnit(long id)
        {
            var st = await _contextUnit.Units.FindAsync(id);

            if (st == null)
            {
                return NotFound();
            }
            unitViewModel unitViewModel = new unitViewModel();
            unitViewModel.id = st.Id;
            unitViewModel.authorId = st.AuthorId;
            unitViewModel.editorId = st.EditorId;
            unitViewModel.authorName = await GetUserNameByIdAsync(st.AuthorId);
            unitViewModel.editorName = await GetUserNameByIdAsync(st.EditorId);
            unitViewModel.name = st.Name;
            unitViewModel.isActive = st.IsActive;
            unitViewModel.created = st.Created;
            unitViewModel.modified = st.Modified;
            unitViewModel.description = st.Description;

            return unitViewModel;
        }

        // POST: api/admin/stitchinfo
        [HttpPost("unit")]
        public async Task<ActionResult<StitchInfo>> PostUnit(unitViewModel unit)
        {
            try
            {
                Unit unit1 = new Unit();
                
                unit1.Name = unit.name;
                unit1.Created =DateTime.Now;
                unit1.Modified =DateTime.Now;
                unit1.IsActive = unit.isActive;
                unit1.Description = unit.description;
                unit1.Id = unit.id;


                var user = GetCurrentUser();
                if (user != null)
                {
                    unit1.AuthorId = user.Id;// DateTime.Now;
                    unit1.EditorId = user.Id; // DateTime.Now;
                }

                _contextUnit.Units.Add(unit1);
                await _contextUnit.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUnit), new { id = unit1.Id }, unit1);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/admin/stitchinfo/5
        [HttpPut("unit/{id}")]
        public async Task<IActionResult> PutUnit(long id, unitViewModel unitViewModel)
        {
            try
            {
                var unit =await  _contextUnit.Units.FindAsync(id);
                if (unit != null)
                {
                    unit.Name = unitViewModel.name;
                    unit.Description = unitViewModel.description;
                    unit.Modified = DateTime.Now;
                    unit.IsActive = unitViewModel.isActive;
                    unit.AuthorId = unitViewModel.authorId;
                    unit.EditorId = unitViewModel.editorId;

                    var user = GetCurrentUser();
                    if (user != null)
                    {
                        unit.EditorId = user.Id; // DateTime.Now;
                    }
                    if (id != unitViewModel.id)
                    {
                        return BadRequest();
                    }

                    _contextUnit.Entry(unit).State = EntityState.Modified;

                    try
                    {
                        await _contextUnit.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!UnitExists(id))
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
                else {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        // DELETE: api/admin/stitchinfo/5
        [HttpDelete("unit/{id}")]
        public async Task<IActionResult> DeleteUnit(long id)
        {
            try
            {
                var stitchInfo = await _contextUnit.Units.FindAsync(id);
                if (stitchInfo == null)
                {
                    return NotFound();
                }

                _contextUnit.Units.Remove(stitchInfo);
                await _contextUnit.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        private bool UnitExists(long id)
        {
            return _contextUnit.Units.Any(e => e.Id == id);
        }

        #endregion
        #region Contribution


        // GET: api/admin/allcontribution

        [HttpGet("allcontribution")]
        public async Task<ActionResult<IEnumerable<contributionViewModel>>> GetAllContributions()
       
        {
            try
            {
                List<Contribution> contributionInfos = new List<Contribution>();
                List<contributionViewModel> contributionInfoModels = new List<contributionViewModel>();
                //StitchInfoService service = new StitchInfoService();
                contributionInfos = await _contriibutionContext.Contributions.ToListAsync(); 
                foreach (var st in contributionInfos)
                {
                    contributionViewModel contributionInfoViewModel = new contributionViewModel();
                    contributionInfoViewModel.id = st.Id;
                    contributionInfoViewModel.authorId = st.AuthorId;
                    contributionInfoViewModel.editorId = st.EditorId;
                    contributionInfoViewModel.authorName = await GetUserNameByIdAsync(st.AuthorId);
                    contributionInfoViewModel.editorName = await GetUserNameByIdAsync(st.EditorId);
                    contributionInfoViewModel.stitchId = st.StitchId;
                    contributionInfoViewModel.needle = st.Needle;
                    contributionInfoViewModel.bobbin = st.Bobbin;
                    contributionInfoViewModel.cover = st.Cover;
                    contributionInfoViewModel.total = st.Total;
                    contributionInfoViewModel.created = st.Created;
                    contributionInfoViewModel.modified = st.Modified;
                    contributionInfoViewModel.isActive = st.IsActive;
                    contributionInfoModels.Add(contributionInfoViewModel);
                }
                return contributionInfoModels;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        // GET: api/admin/contribution
        [HttpGet("contribution")]
        public async Task<ActionResult<IEnumerable<contributionViewModel>>> GetContribution()
        {
            try
            {
                List<Contribution> contributionInfos = new List<Contribution>();
                List<contributionViewModel> contributionInfoModels = new List<contributionViewModel>();
                contributionInfos = await _contriibutionContext.Contributions.Where(x => x.IsActive == true).ToListAsync();
                //StitchInfoService service = new StitchInfoService();
                //contributionInfos = await _contriibutionContext.Contributions.ToListAsync();
                foreach (var st in contributionInfos)
                {
                    contributionViewModel contributionInfoViewModel = new contributionViewModel();
                    contributionInfoViewModel.id = st.Id;
                    contributionInfoViewModel.authorId = st.AuthorId;
                    contributionInfoViewModel.editorId = st.EditorId;
                    contributionInfoViewModel.authorName = await GetUserNameByIdAsync(st.AuthorId);
                    contributionInfoViewModel.editorName = await GetUserNameByIdAsync(st.EditorId);
                    contributionInfoViewModel.stitchId = st.StitchId;
                    contributionInfoViewModel.needle = st.Needle;
                    contributionInfoViewModel.bobbin = st.Bobbin;
                    contributionInfoViewModel.cover = st.Cover;
                    contributionInfoViewModel.total = st.Total;
                    contributionInfoViewModel.created = st.Created;
                    contributionInfoViewModel.modified = st.Modified;
                    contributionInfoViewModel.isActive = st.IsActive;
                    contributionInfoModels.Add(contributionInfoViewModel);
                }
                return contributionInfoModels;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET: api/admin/contribution/5
        [HttpGet("contribution/{id}")]
     
        public async Task<ActionResult<Contribution>> GetContributions(long id)
        {
            var stitchInfo = await _contriibutionContext.Contributions.FindAsync(id);

            if (stitchInfo == null)
            {
                return NotFound();
            }

            return stitchInfo;
        }


        // GET: api/admin/contribution/stitch/{stichId}
        [HttpGet("contribution/stich/{stichId}")]
        public async Task<ActionResult<Contribution>> GetContributionByStichId(long stichId)
        {
            var contribution = await _contriibutionContext.Contributions
                                   .FirstOrDefaultAsync(c => c.StitchId == stichId);

            if (contribution == null)
            {
                return NotFound();
            }

            return contribution;
        }


        // POST: api/admin/contribution
        [HttpPost("contribution")]

        public async Task<ActionResult<Contribution>> PostContribution(Contribution stitchInfo)
        {
            try
            {
                stitchInfo.Created = DateTime.Now;
                stitchInfo.Modified = DateTime.Now;
                var user = GetCurrentUser();
                if (user != null)
                {
                    stitchInfo.AuthorId = user.Id;// DateTime.Now;
                    stitchInfo.EditorId = user.Id;// DateTime.Now;
                }
                stitchInfo.Created= DateTime.Now;
                stitchInfo.Modified = DateTime.Now;
                _contriibutionContext.Contributions.Add(stitchInfo);
                await _contriibutionContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetContributions), new { id = stitchInfo.Id }, stitchInfo);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/admin/contribution/5
        [HttpPut("contribution/{id}")]
        public async Task<IActionResult> PutContribution(long id, Contribution stitchInfo)
        {
            try
            {
                if (id != stitchInfo.Id)
                {
                    return BadRequest();
                }
                var user = GetCurrentUser();
                if (user != null)
                {
                    stitchInfo.EditorId = user.Id;// DateTime.Now;
                    stitchInfo.Modified = DateTime.Now;
                }
                
                _contriibutionContext.Entry(stitchInfo).State = EntityState.Modified;

                try
                {
                    await _contriibutionContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ContributionExists(id))
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

        // DELETE: api/admin/contribution/5
        [HttpDelete("contribution/{id}")]
        public async Task<IActionResult> DeleteContribution(long id)
        {
            try
            {
                var stitchInfo = await _contriibutionContext.Contributions.FindAsync(id);
                if (stitchInfo == null)
                {
                    return NotFound();
                }

                _contriibutionContext.Contributions.Remove(stitchInfo);
                await _contriibutionContext.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private bool ContributionExists(long id)
        {
            return _contriibutionContext.Contributions.Any(e => e.Id == id);
        }

        #endregion

        #region ArticleInfo
        [HttpGet("allarticleinfo")]
        public async Task<ActionResult<IEnumerable<articleInfoViewModel>>> GetAllArticleInfos()
        {
            try
            {
                List<ArticleInfo> articleInfos = new List<ArticleInfo>();
                List<articleInfoViewModel> articleInfosViewModels = new List<articleInfoViewModel>();
                //StitchInfoService service = new StitchInfoService();
                articleInfos = await _articleInfoContext.ArticleInfo.ToListAsync();
                foreach (var st in articleInfos)
                {
                    articleInfoViewModel articleInfosViewModel = new articleInfoViewModel();
                    articleInfosViewModel.id = st.Id;
                    articleInfosViewModel.name = st.;
                    articleInfosViewModel.authorId = st.AuthorId;
                    articleInfosViewModel.editorId = st.EditorId;
                    articleInfosViewModel.authorName = await GetUserNameByIdAsync(st.AuthorId);
                    articleInfosViewModel.editorName = await GetUserNameByIdAsync(st.EditorId);
                    articleInfosViewModel.length = st.Length;
                   
                    articleInfosViewModel.created = st.Created;
                    articleInfosViewModel.modified = st.Modified;
                    articleInfosViewModel.isActive = st.IsActive;
                    articleInfosViewModels.Add(articleInfosViewModel);

    
    }
                return articleInfosViewModels;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("articleinfo")]
        public async Task<ActionResult<IEnumerable<articleInfoViewModel>>> GetArticleInfos()
        {
            try
            {
                List<ArticleInfo> articleInfos = new List<ArticleInfo>();
                List<articleInfoViewModel> articleInfosViewModels = new List<articleInfoViewModel>();
                //StitchInfoService service = new StitchInfoService();
                articleInfos = await _articleInfoContext.ArticleInfo.ToListAsync();
                articleInfos = await _articleInfoContext.ArticleInfo.Where(x => x.IsActive == true).ToListAsync(); 
                foreach (var st in articleInfos)
                {
                    articleInfoViewModel articleInfosViewModel = new articleInfoViewModel();
                    articleInfosViewModel.id = st.Id;
                    articleInfosViewModel.name = st.Name;
                    articleInfosViewModel.authorId = st.AuthorId;
                    articleInfosViewModel.editorId = st.EditorId;
                    articleInfosViewModel.authorName = await GetUserNameByIdAsync(st.AuthorId);
                    articleInfosViewModel.editorName = await GetUserNameByIdAsync(st.EditorId);
                    articleInfosViewModel.length = st.Length;

                    articleInfosViewModel.created = st.Created;
                    articleInfosViewModel.isActive = st.IsActive;
                    articleInfosViewModel.modified = st.Modified;
                    articleInfosViewModels.Add(articleInfosViewModel);


                }
                return articleInfosViewModels;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET: api/admin/articleinfo
        //[HttpGet("articleinfo")]
        //public async Task<ActionResult<IEnumerable<ArticleInfo>>> GetArticleInfos()
        //{
        //    try
        //    {
        //        return await _articleInfoContext.ArticleInfo.ToListAsync();

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }

        //}

        // GET: api/admin/articleinfo/5
        [HttpGet("articleinfo/{id}")]
        public async Task<ActionResult<ArticleInfo>> GetArticleInfos(long id)
        {
            var stitchInfo = await _articleInfoContext.ArticleInfo.FindAsync(id);

            if (stitchInfo == null)
            {
                return NotFound();
            }

            return stitchInfo;
        }

        // POST: api/admin/articleinfo
        [HttpPost("articleinfo")]
        public async Task<ActionResult<Contribution>> PostArticleInfo(ArticleInfo stitchInfo)
        {
            try
            {
                stitchInfo.Created = DateTime.Now;
                stitchInfo.Modified = DateTime.Now;
                var user = GetCurrentUser();
                if (user != null)
                {
                    stitchInfo.AuthorId = user.Id;// DateTime.Now;
                    stitchInfo.EditorId = user.Id;// DateTime.Now;
                }
                _articleInfoContext.ArticleInfo.Add(stitchInfo);
                await _articleInfoContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetArticleInfos), new { id = stitchInfo.Id }, stitchInfo);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/admin/articleinfo/5
        [HttpPut("articleinfo/{id}")]
        public async Task<IActionResult> PutArticleInfo(long id, ArticleInfo stitchInfo)
        {
            try
            {
                if (id != stitchInfo.Id)
                {
                    return BadRequest();
                }
                var user = GetCurrentUser();
                if (user != null)
                {
                    stitchInfo.EditorId = user.Id;// DateTime.Now;
                }
                stitchInfo.Modified = DateTime.Now;
                _articleInfoContext.Entry(stitchInfo).State = EntityState.Modified;

                try
                {
                    await _articleInfoContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ArticleInfoExists(id))
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

        // DELETE: api/admin/articleinfo/5
        [HttpDelete("articleinfo/{id}")]
        public async Task<IActionResult> DeleteArticleInfo(long id)
        {
            try
            {
                var stitchInfo = await _articleInfoContext.ArticleInfo.FindAsync(id);
                if (stitchInfo == null)
                {
                    return NotFound();
                }

                _articleInfoContext.ArticleInfo.Remove(stitchInfo);
                await _articleInfoContext.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private bool ArticleInfoExists(long id)
        {
            return _articleInfoContext.ArticleInfo.Any(e => e.Id == id);
        }

        #endregion
    }
}
