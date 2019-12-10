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
    public class PicturesController : ControllerBase
    {
        private readonly PixDbContext _context;

        public PicturesController(PixDbContext context)
        {
            _context = context;
        }

        // GET: api/Pictures
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Picture>>> GetPictures()
        {
            return Ok(await _context.Pictures.ToListAsync());
        }

        // GET: api/Pictures/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Picture>> GetPicture(int id)
        {
            var picture = await _context.Pictures.FindAsync(id);

            if (picture == null)
            {
                return NotFound();
            }

            _context.Entry(picture).Collection(e => e.Comments).Load();
            return Ok(picture);
        }

        // PUT: api/Pictures/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<ActionResult> PutPicture(int id, Picture picture)
        {
            try
            {
                if (id != picture.Id)
                {
                    return BadRequest();
                }

                var pictureFromDb = _context.Pictures.FirstOrDefault(x => x.Id == id);
                if (pictureFromDb != null)
                {
                    pictureFromDb.Name = picture.Name;
                    pictureFromDb.Content = picture.Content;
                    pictureFromDb.Created = DateTime.Now;
                    pictureFromDb.Description = picture.Description;
                    pictureFromDb.Comments = picture.Comments;
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            } catch (Exception e)
            {
                return BadRequest();
            }
        }

        // POST: api/Pictures
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Picture>> PostPicture(Picture picture)
        {
            try
            {
                picture.Created = DateTime.Now;
                _context.Pictures.Add(picture);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPicture", new { id = picture.Id }, picture);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        // DELETE: api/Pictures/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Picture>> DeletePicture(int id)
        {
            var picture = await _context.Pictures.FindAsync(id);
            if (picture == null)
            {
                return NotFound();
            }

            await _context.Comments.Where(e => e.PictureId == id).ForEachAsync(e => _context.Comments.Remove(e));
            _context.Pictures.Remove(picture);
            await _context.SaveChangesAsync();

            return picture;
        }
    }
}
