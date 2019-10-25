using ConteoWIP.Areas.ConteoWIP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class UpdateCountController : ApiController
    {
        private ConteoWIPEntities _db = new ConteoWIPEntities();

        public IHttpActionResult PutUpdateCount(int order, int counted, string count_type)
        {
            var count = _db.Count.Where(c => c.OrderNumber == order).First();
            if (count_type.Equals("Count"))
            {
                count.Result = counted;
            }
            else
            {
                count.ReCount = counted;
            }
            _db.SaveChanges();
            return Ok(count);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose();
        }
    }
}
