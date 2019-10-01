using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pix.Entities
{
    public class PixDbContext : DbContext
    {
        public PixDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Picture> Pictures { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TagCounter> TagCounters { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Tag> Tag { get; set; }
    }
}
