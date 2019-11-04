using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ConteoWIP.Areas.Usuarios.Models;

namespace ConteoWIP.Areas.Usuarios.Controllers
{
    public class SistemasController : ApiController
    {
        private UsuariosEntities db = new UsuariosEntities();

        // GET: api/Sistemas
        public IQueryable<Sistemas> GetSistemas()
        {
            return db.Sistemas;
        }

        // GET: api/Sistemas/5
        [ResponseType(typeof(Sistemas))]
        public async Task<IHttpActionResult> GetSistemas(int id)
        {
            Sistemas sistemas = await db.Sistemas.FindAsync(id);
            if (sistemas == null)
            {
                return NotFound();
            }

            return Ok(sistemas);
        }

        // PUT: api/Sistemas/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSistemas(int id, Sistemas sistemas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sistemas.Id)
            {
                return BadRequest();
            }

            db.Entry(sistemas).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SistemasExists(id))
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

        // POST: api/Sistemas
        [ResponseType(typeof(Sistemas))]
        public async Task<IHttpActionResult> PostSistemas(Sistemas sistemas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Sistemas.Add(sistemas);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = sistemas.Id }, sistemas);
        }

        // DELETE: api/Sistemas/5
        [ResponseType(typeof(Sistemas))]
        public async Task<IHttpActionResult> DeleteSistemas(int id)
        {
            Sistemas sistemas = await db.Sistemas.FindAsync(id);
            if (sistemas == null)
            {
                return NotFound();
            }

            db.Sistemas.Remove(sistemas);
            await db.SaveChangesAsync();

            return Ok(sistemas);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SistemasExists(int id)
        {
            return db.Sistemas.Count(e => e.Id == id) > 0;
        }
    }
}