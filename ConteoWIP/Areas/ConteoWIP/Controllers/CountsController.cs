using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using ConteoWIP.Areas.ConteoWIP.Models;

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class CountsController : ApiController
    {
        private ConteoWIPEntities db = new ConteoWIPEntities();

        // Get all products
        public IQueryable<Count> GetCount()
        {
            return db.Count;
        }

        // Get products by area and count type
        public IQueryable<object> GetCount(string area, string count_type)
        {
            var newArea = area;

            if (area.Split('_')[0] == "SAL")
            {
                newArea = "SAL #" + area.Split('_')[1];
            }

            IQueryable<object> counts = null;
            if (count_type.Equals("Count"))
            {
                counts = from count in db.Count
                         where count.AreaLine == newArea
                         select new
                         {
                             OrderNumber = count.OrderNumber,
                             Product = count.Product,
                             Alias = count.Alias,
                             ProductName = count.ProductName,
                             AreaLine = count.AreaLine,
                             OperationNumber = count.OperationNumber,
                             OperationDescription = count.OperationDescription,
                             OrdQty = count.OrdQty,
                             Physical1 = count.Physical1,
                             Comments = count.Comments,
                             ReCount = count.ReCount,
                             FinalResult = count.FinalResult,
                             ResultCount = count.Result,
                             ConciliationUser = count.ConciliationUser,
                             StdCost = count.StdCost,
                             TotalCost = count.TotalCost,
                             Counted = count.Physical1,
                             Result = count.Result,
                             Status = count.Status
                         };
            }
            else
            {
                counts = from count in db.Count
                         where count.AreaLine == newArea && count.Status != "OK"
                         select new
                         {
                             OrderNumber = count.OrderNumber,
                             Product = count.Product,
                             Alias = count.Alias,
                             ProductName = count.ProductName,
                             AreaLine = count.AreaLine,
                             OperationNumber = count.OperationNumber,
                             OperationDescription = count.OperationDescription,
                             OrdQty = count.OrdQty,
                             Physical1 = count.Physical1,
                             Result = count.Result,
                             Comments = count.Comments,
                             ReCount = count.ReCount,
                             FinalResult = count.FinalResult,
                             ResultCount = count.FinalResult,
                             Counted = count.ReCount,
                             ConciliationUser = count.ConciliationUser,
                             StdCost = count.StdCost,
                             TotalCost = count.TotalCost,
                             Status = count.Status
                         };
            }
            return counts;
        }

        // Saves or updates an entry
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCount(int id, Count count)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != count.OrderNumber)
            {
                return BadRequest();
            }
            
            if (CountExists(id))
            {
                //db.Entry(count).State = EntityState.Modified;
                try
                {
                    var cnt = db.Count.Where(c => c.OrderNumber == count.OrderNumber).First();
                    cnt.Comments = count.Comments;
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }
            else
            {
                db.Count.Add(count);
                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.Accepted);
        }

        // Saves or updates the conciliation user
        public IHttpActionResult PutCount(int order, string conciliation)
        {
            var count = db.Count.Where(c => c.OrderNumber == order).First();
            count.ConciliationUser = conciliation;
            db.SaveChanges();
            return Ok(count);
        }

        // Saves or updates the count of the product by id
        public IHttpActionResult PutCount(int order, int counted, string count_type, string area)
        {
            var count = db.Count.Where(c => c.OrderNumber == order).First();
            if (count_type.Equals("Count"))
            {
                if (count.Physical1 == null)
                {
                    count.Physical1 = counted;
                }
                else if (count.AreaLine != area)
                {
                    count.Physical1 += counted;
                }

                count.Result = count.Physical1 - count.OrdQty;
                count.TotalCost = count.Result * count.StdCost;
                if (count.Physical1 == count.OrdQty)
                {
                    count.Status = "OK";
                }
                else if (count.Physical1 < count.OrdQty)
                {
                    count.Status = "Negative";
                }
                else
                {
                    count.Status = "Positive";
                }
            }
            else
            {
                if (count.Status == "OK")
                {
                    return Ok("StatusOK");
                }

                if (count.ReCount == null)
                {
                    count.ReCount = counted;
                }
                else if (count.AreaLine != area) 
                {
                    count.ReCount += counted;
                }

                count.FinalResult = count.ReCount - count.OrdQty;
                count.TotalCost = count.FinalResult * count.StdCost;
                if (count.ReCount == count.OrdQty)
                {
                    count.Status = "OK";
                }
                else if (count.ReCount < count.OrdQty)
                {
                    count.Status = "Negative";
                }
                else
                {
                    count.Status = "Positive";
                }
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
                            Alias = counts.Alias,
                            AreaLine = counts.AreaLine,
                            OperationNumber = counts.OperationNumber,
                            OperationDescription = counts.OperationDescription,
                            OrderNumber = counts.OrderNumber,
                            OrdQty = counts.OrdQty,
                            Result = counts.ReCount,
                            Comments = counts.Comments
                        };
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