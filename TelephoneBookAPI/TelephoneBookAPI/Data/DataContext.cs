using Microsoft.EntityFrameworkCore;

namespace TelephoneBookAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Person> Persons => Set<Person>();

        public DbSet<User> Users { get; set; }

    }

}
