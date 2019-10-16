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
    }
}