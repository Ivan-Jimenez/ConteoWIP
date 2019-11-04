using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class UsuarioRoles
    {
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int Id_Usuario { get; set; }
        public virtual Usuarios Usuario { get; set; }

        [ForeignKey("Rol")]
        public int Id_Rol { get; set; }
        public virtual Roles Rol { get; set; }
    }
}