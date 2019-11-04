using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class Roles
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }

        [ForeignKey("Sistema")]
        public int Id_sistema { get; set; }
        public virtual Sistemas Sistema { get; set; }

        public virtual ICollection<UsuarioRoles> UsuarioRoles { get; set; }
    }
}