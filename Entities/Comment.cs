using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pix.Entities
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public string Text { get; set; }
        public Picture Picture { get; set; }
        public int PictureId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public DateTime Created { get; set; }
    }
}
