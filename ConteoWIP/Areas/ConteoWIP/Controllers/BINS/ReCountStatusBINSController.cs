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
    public class ReCountStatusBINSController : ApiController
    {
        private ConteoWIPEntities db = new ConteoWIPEntities();

        // GET: api/ReCountStatusBINS
        public IQueryable<ReCountStatusBINS> GetReCountStatusBINS()
        {
            return db.ReCountStatusBINS;
        }

        // GET: api/ReCountStatusBINS/5
        [ResponseType(typeof(ReCountStatusBINS))]
        public IHttpActionResult GetReCountStatusBINS(string id)
        {
            ReCountStatusBINS reCountStatusBINS = db.ReCountStatusBINS.Find(id);
            if (reCountStatusBINS == null)
            {
                return NotFound();
            }

            return Ok(reCountStatusBINS);
        }

        // PUT: api/ReCountStatusBINS/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutReCountStatusBINS(string id, ReCountStatusBINS reCountStatusBINS)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != reCountStatusBINS.AreaLine)
            {
                return BadRequest();
            }

            if (ReCountStatusBINSExists(id))
            {
                db.Entry(reCountStatusBINS).State = EntityState.Modified;
            }
            else
            {
                db.ReCountStatusBINS.Add(reCountStatusBINS);
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

        // POST: api/ReCountStatusBINS
        [ResponseType(typeof(ReCountStatusBINS))]
        public IHttpActionResult PostReCountStatusBINS(ReCountStatusBINS reCountStatusBINS)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ReCountStatusBINS.Add(reCountStatusBINS);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ReCountStatusBINSExists(reCountStatusBINS.AreaLine))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = reCountStatusBINS.AreaLine }, reCountStatusBINS);
        }

        // DELETE: api/ReCountStatusBINS/5
        [ResponseType(typeof(ReCountStatusBINS))]
        public IHttpActionResult DeleteReCountStatusBINS(string id)
        {
            ReCountStatusBINS reCountStatusBINS = db.ReCountStatusBINS.Find(id);
            if (reCountStatusBINS == null)
            {
                return NotFound();
            }

            db.ReCountStatusBINS.Remove(reCountStatusBINS);
            db.SaveChanges();

            return Ok(reCountStatusBINS);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ReCountStatusBINSExists(string id)
        {
            return db.ReCountStatusBINS.Count(e => e.AreaLine == id) > 0;
        }
    }
}