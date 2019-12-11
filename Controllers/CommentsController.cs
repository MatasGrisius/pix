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
    public class CommentsController : ControllerBase
    {
        private readonly PixDbContext _context;

        public CommentsController(PixDbContext context)
        {
            _context = context;
        }

        // GET: api/Comments
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            return Ok(await _context.Comments.ToListAsync());
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<ActionResult> PutComment(int id, Comment comment)
        {
            try
            {
                if (id != comment.Id)
                {
                    return BadRequest();
                }

                var commentFromDb = _context.Comments.FirstOrDefault(x => x.Id == id);
                if (commentFromDb != null)
                {
                    commentFromDb.Text = comment.Text;
                    commentFromDb.User = comment.User;
                    commentFromDb.UserId = comment.UserId;
                    commentFromDb.PictureId = comment.PictureId;
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

        // POST: api/Comments
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            try
            {
                comment.Created = DateTime.Now;
                comment.UserId = int.Parse(User.Identity.Name);
                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetComments", new { id = comment.Id }, comment);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Comment>> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return comment;
        }
    }
}
