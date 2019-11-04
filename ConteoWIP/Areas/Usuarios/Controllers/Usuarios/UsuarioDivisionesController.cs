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

namespace ConteoWIP.Areas.Templates.Controllers
{
    public class UsuarioDivisionesController : ApiController
    {
        private UsuariosEntities db = new UsuariosEntities();

        // GET: api/UsuarioDivisiones
        public IQueryable<UsuarioDivisiones> GetUsuarioDivisiones()
        {
            return db.UsuarioDivisiones;
        }

        // GET: api/UsuarioDivisiones/5
        [ResponseType(typeof(UsuarioDivisiones))]
        public async Task<IHttpActionResult> GetUsuarioDivisiones(int id)
        {
            UsuarioDivisiones usuarioDivisiones = await db.UsuarioDivisiones.FindAsync(id);
            if (usuarioDivisiones == null)
            {
                return NotFound();
            }

            return Ok(usuarioDivisiones);
        }

        // PUT: api/UsuarioDivisiones/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUsuarioDivisiones(int id, UsuarioDivisiones usuarioDivisiones)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != usuarioDivisiones.Id)
            {
                return BadRequest();
            }

            db.Entry(usuarioDivisiones).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioDivisionesExists(id))
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

        // POST: api/UsuarioDivisiones
        [ResponseType(typeof(UsuarioDivisiones))]
        public async Task<IHttpActionResult> PostUsuarioDivisiones(UsuarioDivisiones usuarioDivisiones)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UsuarioDivisiones.AddOrUpdate(usuarioDivisiones);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = usuarioDivisiones.Id }, usuarioDivisiones);
        }

        // DELETE: api/UsuarioDivisiones/5
        [ResponseType(typeof(UsuarioDivisiones))]
        public async Task<IHttpActionResult> DeleteUsuarioDivisiones(int id)
        {
            UsuarioDivisiones usuarioDivisiones = await db.UsuarioDivisiones.FindAsync(id);
            if (usuarioDivisiones == null)
            {
                return NotFound();
            }

            db.UsuarioDivisiones.Remove(usuarioDivisiones);
            await db.SaveChangesAsync();

            return Ok(usuarioDivisiones);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UsuarioDivisionesExists(int id)
        {
            return db.UsuarioDivisiones.Count(e => e.Id == id) > 0;
        }
    }
}