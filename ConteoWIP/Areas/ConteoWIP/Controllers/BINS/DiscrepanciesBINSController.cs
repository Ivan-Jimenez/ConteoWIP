using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ConteoWIP.Areas.ConteoWIP.Models;

namespace ConteoWIP.Areas.ConteoWIP.Controllers.BINS
{
    public class DiscrepanciesBINSController : ApiController
    {
        private ConteoWIPEntities _db = new ConteoWIPEntities();


        // Get all discrepancies by area and count type
        public IQueryable<object> GetDiscrepanciesBINS(string area, string count_type)
        { 
            IQueryable<object> discrepancies = null;
            if (count_type.Equals("Count"))
            {
                discrepancies = from count in _db.CountBINs
                                    where count.AreaLine == area && count.Physical1 != count.OrdQty
                                    select new
                                    {
                                        ProductName = count.ProductName,
                                        AreaLine = count.AreaLine,
                                        OrderNumber = count.OrderNumber,
                                        OrdQty = count.OrdQty,
                                        Counted = count.Physical1,
                                        Result = count.Result,
                                        ResultCount = count.Result,
                                    };
            }
            else
            {
                discrepancies = from count in _db.CountBINs
                                where count.AreaLine == area && count.ReCount != count.OrdQty && count.Status != "OK"
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
                                    FinalReault = count.FinalResult,
                                    ResultCount = count.FinalResult,
                                    ConciliationUser = count.ConciliationUser,
                                    StdCost = count.StdCost,
                                    TotalCost = count.TotalCost,
                                    Status = count.Status
                                 };
            }
            return discrepancies;
        }

        // Get all discrepancies
        public IQueryable<object> GetDiscrepancies()
        {
            var discrepancies = from count in _db.CountBINs
                            where count.FinalResult != 0
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
                                ReCount = count.Result,
                                FinalReault = count.FinalResult,
                                ConciliationUser = count.ConciliationUser
                            };
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

        private bool CountExists(string id)
        {
            return _db.CountBINs.Count(e => e.OrderNumber == id) > 0;
        }
    }
}
