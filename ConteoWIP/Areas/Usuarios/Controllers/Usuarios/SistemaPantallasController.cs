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
    public class SistemaPantallasController : ApiController
    {
        private UsuariosEntities db = new UsuariosEntities();

        // GET: api/SistemaPantallas
        public IQueryable<SistemaPantallas> GetSistemaPantallas()
        {
            return db.SistemaPantallas;
        }

        // GET: api/SistemaPantallas/5
        [ResponseType(typeof(SistemaPantallas))]
        public async Task<IHttpActionResult> GetSistemaPantallas(int id)
        {
            SistemaPantallas sistemaPantallas = await db.SistemaPantallas.FindAsync(id);
            if (sistemaPantallas == null)
            {
                return NotFound();
            }

            return Ok(sistemaPantallas);
        }

        // PUT: api/SistemaPantallas/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSistemaPantallas(int id, SistemaPantallas sistemaPantallas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sistemaPantallas.Id)
            {
                return BadRequest();
            }

            db.Entry(sistemaPantallas).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SistemaPantallasExists(id))
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

        // POST: api/SistemaPantallas
        [ResponseType(typeof(SistemaPantallas))]
        public async Task<IHttpActionResult> PostSistemaPantallas(SistemaPantallas sistemaPantallas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SistemaPantallas.Add(sistemaPantallas);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = sistemaPantallas.Id }, sistemaPantallas);
        }

        // DELETE: api/SistemaPantallas/5
        [ResponseType(typeof(SistemaPantallas))]
        public async Task<IHttpActionResult> DeleteSistemaPantallas(int id)
        {
            SistemaPantallas sistemaPantallas = await db.SistemaPantallas.FindAsync(id);
            if (sistemaPantallas == null)
            {
                return NotFound();
            }

            db.SistemaPantallas.Remove(sistemaPantallas);
            await db.SaveChangesAsync();

            return Ok(sistemaPantallas);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SistemaPantallasExists(int id)
        {
            return db.SistemaPantallas.Count(e => e.Id == id) > 0;
        }
    }
}