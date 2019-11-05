using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pix.Entities
{
    public class TagCounter
    {
        [Key]
        public int Id { get; set; }
        public Tag Tag { get; set; }
        [Required]
        public int TagId { get; set; }
        public Picture Picture { get; set; }
        [Required]
        public int PictureId { get; set; }
        public User User { get; set; }
        [Required]
        public int UserId { get; set; }
    }
}
