using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using ConteoWIP.Areas.ConteoWIP.Models;

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class FirstCountStatusController : ApiController
    {
        private ConteoWIPEntities db = new ConteoWIPEntities();

        // GET: api/FirstCountStatus
        public IQueryable<FirstCountStatus> GetFirstCountStatus()
        {
            return db.FirstCountStatus;
        }

        // GET: api/FirstCountStatus/5
        [ResponseType(typeof(FirstCountStatus))]
        public IHttpActionResult GetFirstCountStatus(string id)
        {
            FirstCountStatus firstCountStatus = db.FirstCountStatus.Find(id);
            if (firstCountStatus == null)
            {
                return NotFound();
            }

            return Ok(firstCountStatus);
        }

        // Save or update an entry.
        [ResponseType(typeof(void))]
        public IHttpActionResult PutFirstCountStatus(string id, FirstCountStatus firstCountStatus)
        {
            if (id.Split('_')[0] == "SAL")
            {
                id = "SAL #" + id.Split('_')[1];
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != firstCountStatus.AreaLine)
            {
                return BadRequest();
            }

            if (FirstCountStatusExists(id))
            {
                db.Entry(firstCountStatus).State = EntityState.Modified;
            }
            else
            {
                db.FirstCountStatus.Add(firstCountStatus);
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

        private bool FirstCountStatusExists(string id)
        {
            return db.FirstCountStatus.Count(e => e.AreaLine == id) > 0;
        }
    }
}