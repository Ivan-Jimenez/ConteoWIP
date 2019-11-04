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
    public class UsuarioRolesController : ApiController
    {
        private UsuariosEntities db = new UsuariosEntities();

        // GET: api/UsuarioRoles
        public IQueryable<UsuarioRoles> GetUsuarioRoles()
        {
            return db.UsuarioRoles;
        }

        // GET: api/UsuarioRoles/5
        [ResponseType(typeof(UsuarioRoles))]
        public async Task<IHttpActionResult> GetUsuarioRoles(int id)
        {
            UsuarioRoles usuarioRoles = await db.UsuarioRoles.FindAsync(id);
            if (usuarioRoles == null)
            {
                return NotFound();
            }

            return Ok(usuarioRoles);
        }

        // PUT: api/UsuarioRoles/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUsuarioRoles(int id, UsuarioRoles usuarioRoles)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != usuarioRoles.Id)
            {
                return BadRequest();
            }

            db.Entry(usuarioRoles).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioRolesExists(id))
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

        // POST: api/UsuarioRoles
        [ResponseType(typeof(UsuarioRoles))]
        public async Task<IHttpActionResult> PostUsuarioRoles(UsuarioRoles usuarioRoles)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UsuarioRoles.AddOrUpdate(usuarioRoles);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = usuarioRoles.Id }, usuarioRoles);
        }

        // DELETE: api/UsuarioRoles/5
        [ResponseType(typeof(UsuarioRoles))]
        public async Task<IHttpActionResult> DeleteUsuarioRoles(int id)
        {
            UsuarioRoles usuarioRoles = await db.UsuarioRoles.FindAsync(id);
            if (usuarioRoles == null)
            {
                return NotFound();
            }

            db.UsuarioRoles.Remove(usuarioRoles);
            await db.SaveChangesAsync();

            return Ok(usuarioRoles);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UsuarioRolesExists(int id)
        {
            return db.UsuarioRoles.Count(e => e.Id == id) > 0;
        }
    }
}