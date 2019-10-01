using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pix.Entities;

namespace pix.Controllers
{
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
        public async Task<ActionResult<IEnumerable<TagCounter>>> GetTagCounters()
        {
            return await _context.TagCounters.ToListAsync();
        }

        // GET: api/TagCounters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TagCounter>> GetTagCounter(int id)
        {
            var tagCounter = await _context.TagCounters.FindAsync(id);

            if (tagCounter == null)
            {
                return NotFound();
            }

            return tagCounter;
        }

        // PUT: api/TagCounters/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTagCounter(int id, TagCounter tagCounter)
        {
            if (id != tagCounter.Id)
            {
                return BadRequest();
            }

            _context.Entry(tagCounter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagCounterExists(id))
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

        // POST: api/TagCounters
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<TagCounter>> PostTagCounter(TagCounter tagCounter)
        {
            _context.TagCounters.Add(tagCounter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTagCounter", new { id = tagCounter.Id }, tagCounter);
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

        private bool TagCounterExists(int id)
        {
            return _context.TagCounters.Any(e => e.Id == id);
        }
    }
}
