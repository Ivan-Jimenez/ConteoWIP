using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ConteoWIP.Areas.Usuarios.Models;

namespace ConteoWIP.Areas.Usuarios.Controllers
{
    public class DivisionesController : ApiController
    {
        private UsuariosEntities db = new UsuariosEntities();

        // GET: api/Divisiones
        public IQueryable<Divisiones> GetDivisiones()
        {
                return db.Divisiones;
        }

        // GET: api/Divisiones/5
        [ResponseType(typeof(Divisiones))]
        public async Task<IHttpActionResult> GetDivisiones(int id)
        {
            Divisiones divisiones = await db.Divisiones.FindAsync(id);
            if (divisiones == null)
            {
                return NotFound();
            }

            return Ok(divisiones);
        }

        // PUT: api/Divisiones/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutDivisiones(int id, Divisiones divisiones)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != divisiones.Id)
            {
                return BadRequest();
            }

            db.Entry(divisiones).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DivisionesExists(id))
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

        // POST: api/Divisiones
        [ResponseType(typeof(Divisiones))]
        public async Task<IHttpActionResult> PostDivisiones(Divisiones divisiones)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Divisiones.AddOrUpdate(divisiones);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = divisiones.Id }, divisiones);
        }

        // DELETE: api/Divisiones/5
        [ResponseType(typeof(Divisiones))]
        public async Task<IHttpActionResult> DeleteDivisiones(int id)
        {
            Divisiones divisiones = await db.Divisiones.FindAsync(id);
            if (divisiones == null)
            {
                return NotFound();
            }

            db.Divisiones.Remove(divisiones);
            await db.SaveChangesAsync();

            return Ok(divisiones);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DivisionesExists(int id)
        {
            return db.Divisiones.Count(e => e.Id == id) > 0;
        }
    }
}