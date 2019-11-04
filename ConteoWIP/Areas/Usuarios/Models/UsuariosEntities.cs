using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class UsuariosEntities : DbContext
    {
        public UsuariosEntities() : base("Usuarios")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }
        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UsuarioRoles> UsuarioRoles { get; set; }
        public DbSet<Sistemas> Sistemas { get; set; }
        public DbSet<SistemaPantallas> SistemaPantallas { get; set; }

        public DbSet<UsuarioDivisiones> UsuarioDivisiones { get; set; }

        public DbSet<Divisiones> Divisiones { get; set; }
    }
}