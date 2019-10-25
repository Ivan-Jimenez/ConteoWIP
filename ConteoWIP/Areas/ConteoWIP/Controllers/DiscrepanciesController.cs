using ConteoWIP.Areas.ConteoWIP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class DiscrepanciesController : ApiController
    {
        private ConteoWIPEntities _db = new ConteoWIPEntities();

        public IQueryable<object> GetDiscrepancies(string area, string count_type)
        {
            IQueryable<object> discrepancies = null;
            if (count_type.Equals("Count"))
            {
                discrepancies = from count in _db.Count
                                    where count.AreaLine == area && count.Result != count.OrdQty
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
                discrepancies = from count in _db.Count
                                    where count.AreaLine == area && count.ReCount != count.OrdQty
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
            return discrepancies;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CountExists(int id)
        {
            return _db.Count.Count(e => e.OrderNumber == id) > 0;
        }
    }
}
