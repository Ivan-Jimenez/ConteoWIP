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
    public class FirstCountStatusBINSController : ApiController
    {
        private ConteoWIPEntities db = new ConteoWIPEntities();

        // GET: api/FirstCountStatusBINS
        public IQueryable<FirstCountStatusBINS> GetFirstCountStatusBINS()
        {
            return db.FirstCountStatusBINS;
        }

        // GET: api/FirstCountStatusBINS/5
        [ResponseType(typeof(FirstCountStatusBINS))]
        public IHttpActionResult GetFirstCountStatusBINS(string id)
        {
            FirstCountStatusBINS firstCountStatusBINS = db.FirstCountStatusBINS.Find(id);
            if (firstCountStatusBINS == null)
            {
                return NotFound();
            }

            return Ok(firstCountStatusBINS);
        }

        // Saves or updates an entry
        [ResponseType(typeof(void))]
        public IHttpActionResult PutFirstCountStatusBINS(string id, FirstCountStatusBINS firstCountStatusBINS)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != firstCountStatusBINS.AreaLine)
            {
                return BadRequest();
            }

            if (FirstCountStatusBINSExists(id))
            {
                db.Entry(firstCountStatusBINS).State = EntityState.Modified;
            }
            else
            {
                db.FirstCountStatusBINS.Add(firstCountStatusBINS); 
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

        // POST: api/FirstCountStatusBINS
        [ResponseType(typeof(FirstCountStatusBINS))]
        public IHttpActionResult PostFirstCountStatusBINS(FirstCountStatusBINS firstCountStatusBINS)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.FirstCountStatusBINS.Add(firstCountStatusBINS);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (FirstCountStatusBINSExists(firstCountStatusBINS.AreaLine))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = firstCountStatusBINS.AreaLine }, firstCountStatusBINS);
        }

        // DELETE: api/FirstCountStatusBINS/5
        [ResponseType(typeof(FirstCountStatusBINS))]
        public IHttpActionResult DeleteFirstCountStatusBINS(string id)
        {
            FirstCountStatusBINS firstCountStatusBINS = db.FirstCountStatusBINS.Find(id);
            if (firstCountStatusBINS == null)
            {
                return NotFound();
            }

            db.FirstCountStatusBINS.Remove(firstCountStatusBINS);
            db.SaveChanges();

            return Ok(firstCountStatusBINS);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FirstCountStatusBINSExists(string id)
        {
            return db.FirstCountStatusBINS.Count(e => e.AreaLine == id) > 0;
        }
    }
}