using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pix.Entities;

namespace pix.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TagCountersController : ControllerBase
    {
        private readonly PixDbContext _context;

        public TagCountersController(PixDbContext context)
        {
            _context = context;
        }

        // GET: api/TagCounters
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TagCounter>>> GetTagCounters()
        {
            return Ok(await _context.TagCounters.ToListAsync());
        }

        // GET: api/TagCounters/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<TagCounter>> GetTagCounter(int id)
        {
            var tagCounter = await _context.TagCounters.FindAsync(id);

            if (tagCounter == null)
            {
                return NotFound();
            }

            return Ok(tagCounter);
        }

        // PUT: api/TagCounters/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<ActionResult> PutTagCounter(int id, TagCounter tagCounter)
        {
            try
            {
                if (id != tagCounter.Id)
                {
                    return BadRequest();
                }

                var tagCounterFromDb = _context.TagCounters.FirstOrDefault(x => x.Id == id);
                if (tagCounterFromDb != null)
                {
                    tagCounterFromDb.Picture = tagCounter.Picture;
                    tagCounterFromDb.PictureId = tagCounter.PictureId;
                    tagCounterFromDb.Tag = tagCounter.Tag;
                    tagCounterFromDb.TagId = tagCounter.TagId;
                    tagCounterFromDb.User = tagCounter.User;
                    tagCounterFromDb.UserId = tagCounter.UserId;
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        // POST: api/TagCounters
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<TagCounter>> PostTagCounter(TagCounter tagCounter)
        {
            try
            {
                _context.TagCounters.Add(tagCounter);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTagCounters", new { id = tagCounter.Id }, tagCounter);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        // DELETE: api/TagCounters/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TagCounter>> DeleteTagCounter(int id)
        {
            var tagCounter = await _context.TagCounters.FindAsync(id);
            if (tagCounter == null)
            {
                return NotFound();
            }

            _context.TagCounters.Remove(tagCounter);
            await _context.SaveChangesAsync();

            return tagCounter;
        }
    }
}
