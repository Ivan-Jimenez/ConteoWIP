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

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class ReCountStatusController : ApiController
    {
        private ConteoWIPEntities db = new ConteoWIPEntities();

        // GET: api/ReCountStatus
        public IQueryable<ReCountStatus> GetReCountStatus()
        {
            return db.ReCountStatus;
        }

        // GET: api/ReCountStatus/5
        [ResponseType(typeof(ReCountStatus))]
        public IHttpActionResult GetReCountStatus(string id)
        {
            ReCountStatus reCountStatus = db.ReCountStatus.Find(id);
            if (reCountStatus == null)
            {
                return NotFound();
            }

            return Ok(reCountStatus);
        }

        // PUT: api/ReCountStatus/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutReCountStatus(string id, ReCountStatus reCountStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != reCountStatus.AreaLine)
            {
                return BadRequest();
            }

            if (ReCountStatusExists(id))
            {
                db.Entry(reCountStatus).State = EntityState.Modified;
            }
            else
            {
                db.ReCountStatus.Add(reCountStatus);
            }

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return StatusCode(HttpStatusCode.Accepted);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ReCountStatusExists(string id)
        {
            return db.ReCountStatus.Count(e => e.AreaLine == id) > 0;
        }
    }
}