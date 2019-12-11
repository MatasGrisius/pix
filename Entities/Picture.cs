using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pix.Entities
{
    public class Picture
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public string Content { get; set; }
        public List<Comment> Comments { get; set; }
        public List<TagCounter> TagCounters { get; set; }
        public User User { get; set; }
        public int? UserId { get; set; }
        public DateTime Created { get; set; }
    }
}
