using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using ConteoWIP.Areas.ConteoWIP.Models;

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class CountsController : ApiController
    {
        private ConteoWIPEntities db = new ConteoWIPEntities();

        public IQueryable<object> GetCount(string area, string count_type)
        {
            IQueryable<object> counts = null;
            if (count_type.Equals("Count"))
            {
                counts = from count in db.Count
                         where count.AreaLine == area
                         select new
                         {
                             Product = count.Product,
                             ProductName = count.ProductName,
                             AreaLine = count.AreaLine,
                             OrderNumber = count.OrderNumber,
                             OrdQty = count.OrdQty,
                             Result = count.Result
                         };
            }
            else
            {
                counts = from count in db.Count
                         where count.AreaLine == area
                         select new
                         {
                             Product = count.Product,
                             ProductName = count.ProductName,
                             AreaLine = count.AreaLine,
                             OrderNumber = count.OrderNumber,
                             OrdQty = count.OrdQty,
                             Result = count.ReCount
                         };
            }
            return counts;
        }

        // Saves or updates an entry
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutCount(int id, Count count)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != count.OrderNumber)
        //    {
        //        return BadRequest();
        //    }
        //}

        // Saves or updates the count of the product by id
        public IHttpActionResult PutCount(int order, int counted, string count_type)
        {
            var count = db.Count.Where(c => c.OrderNumber == order).First();
            if (count_type.Equals("Count"))
            {
                count.Result = counted;
            }
            else
            {
                count.ReCount = counted;
            }
            db.SaveChanges();
            return Ok(count);
        }

        [ResponseType(typeof(Count))]
        public IHttpActionResult GetCount(int order)
        {
            var count = from counts in db.Count
                        where counts.OrderNumber == order
                        select new
                        {
                            Product = counts.Product,
                            ProductName = counts.ProductName,
                            AreaLine = counts.AreaLine,
                            OrderNumber = counts.OrderNumber,
                            OrdQty = counts.OrdQty,
                            Result = counts.ReCount
                        };
            return Ok(count);
        }

        // POST: api/Counts
        [ResponseType(typeof(Count))]
        public IHttpActionResult PostCount(Count count)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Count.Add(count);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = count.Product }, count);
        }

        // DELETE: api/Counts/5
        [ResponseType(typeof(Count))]
        public IHttpActionResult DeleteCount(int id)
        {
            Count count = db.Count.Find(id);
            if (count == null)
            {
                return NotFound();
            }

            db.Count.Remove(count);
            db.SaveChanges();

            return Ok(count);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CountExists(int id)
        {
            return db.Count.Count(e => e.OrderNumber == id) > 0;
        }
    }
}