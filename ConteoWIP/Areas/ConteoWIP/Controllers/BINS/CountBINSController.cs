using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using ConteoWIP.Areas.ConteoWIP.Models;

namespace ConteoWIP.Areas.ConteoWIP.Controllers.BINS
{
    public class CountBINSController : ApiController
    {
        private ConteoWIPEntities db = new ConteoWIPEntities();

        // GET: api/CountBINS
        public IQueryable<CountBINS> GetCountBINs()
        {
            return db.CountBINs;
        }

        // Get products by area and count type
        public IQueryable<object> GetCountBINS(string area, string count_type)
        {
            var newArea = area;

            //if (area.Split('_')[0] == "SAL")
            //{
            //    newArea = "SAL #" + area.Split('_')[1];
            //}

            IQueryable<object> counts = null;
            if (count_type.Equals("Count"))
            {
                counts = from count in db.CountBINs
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
                counts = from count in db.CountBINs
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

        // Saves or updates and entry
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCountBINS(string id, CountBINS countBINS)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != countBINS.OrderNumber)
            {
                return BadRequest();
            }

            if (CountBINSExists(id, countBINS.AreaLine))
            {
                try
                {
                    var cnt = db.CountBINs.Where(c => c.OrderNumber == countBINS.OrderNumber && c.AreaLine == countBINS.AreaLine).First();
                    cnt.Comments = countBINS.Comments;
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }
            else
            {
                db.CountBINs.Add(countBINS);
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
        public IHttpActionResult PutCountBINS(string order, string area, string conciliation)
        {
            order = order.Replace(' ', '+');
            var count = db.CountBINs.Where(c => c.OrderNumber == order && c.AreaLine == area).First();
            count.ConciliationUser = conciliation;
            db.SaveChanges();
            return Ok(count); 
        }

        // Saves or updates the count of the product by id and area
        public IHttpActionResult PutCountBINS(string order, int counted, string count_type, string area)
        {
            var count = db.CountBINs.Where(c => c.OrderNumber == order && c.AreaLine == area).First();
            
            if (count_type.Equals("Count"))
            {
                count.Physical1 = counted;
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

                count.ReCount = counted;
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

        [ResponseType(typeof(CountBINS))]
        public IHttpActionResult GetCountBINS(string order, string area, string something)
        {
            var count = from counts in db.CountBINs
                        where counts.OrderNumber == order && counts.AreaLine == area
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

        private bool CountBINSExists(string id, string area)
        {
            return db.CountBINs.Count(e => e.OrderNumber == id && e.AreaLine == area) > 0;
        }
    }
}