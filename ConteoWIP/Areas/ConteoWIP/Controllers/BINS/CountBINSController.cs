using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
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

        // GET: api/CountBINS/5
        [ResponseType(typeof(CountBINS))]
        public IHttpActionResult GetCountBINS(int id)
        {
            CountBINS countBINS = db.CountBINs.Find(id);
            if (countBINS == null)
            {
                return NotFound();
            }

            return Ok(countBINS);
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
        public IHttpActionResult PutCountBINS(int id, CountBINS countBINS)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != countBINS.OrderNumber)
            {
                return BadRequest();
            }

            if (CountBINSExists(id))
            {
                try
                {
                    var cnt = db.CountBINs.Where(c => c.OrderNumber == countBINS.OrderNumber).First();
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
        //public IHttpActionResult PutCountBINS(int order, string conciliation)
        //{
        //    var count = db.CountBINs.Where(c=>c.OrderNumber )
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CountBINSExists(int id)
        {
            return db.CountBINs.Count(e => e.ID == id) > 0;
        }
    }
}