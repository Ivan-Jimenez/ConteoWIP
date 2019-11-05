using System.Data.Entity;

namespace ConteoWIP.Areas.ConteoWIP.Models
{
    public class ConteoWIPEntities : DbContext
    {
        public ConteoWIPEntities() : base("ConteoWIPEntities")
        {
            Configuration.LazyLoadingEnabled = false;
        }

        public DbSet<Count> Count { get; set; }
        public DbSet<FirstCountStatus> FirstCountStatus { get; set; }
        public DbSet<FirstCountStatusBINS> FirstCountStatusBINS { get; set; } 
        public DbSet<ReCountStatus> ReCountStatus { get; set; }
        public DbSet<ReCountStatusBINS> ReCountStatusBINS { get; set; }
        public DbSet<CountBINS> CountBINs { get; set; }
    }
}