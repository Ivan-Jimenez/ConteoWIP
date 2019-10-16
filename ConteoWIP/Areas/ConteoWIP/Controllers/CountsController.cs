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

        // GET: api/Counts
        public IQueryable<Count> GetCount()
        {
            return db.Count;
        }

        // GET: api/Counts/5
        [ResponseType(typeof(Count))]
        public IHttpActionResult GetCount(int id)
        {
            Count count = db.Count.Find(id);
            if (count == null)
            {
                return NotFound();
            }

            return Ok(count);
        }

        // PUT: api/Counts/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCount(int id, Count count)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != count.ID)
            {
                return BadRequest();
            }

            db.Entry(count).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
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

            return CreatedAtRoute("DefaultApi", new { id = count.ID }, count);
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
            return db.Count.Count(e => e.ID == id) > 0;
        }
    }
}