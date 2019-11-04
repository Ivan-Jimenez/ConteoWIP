using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class Usuarios
    {
        [Key]
        public int Id { get; set; }
        public string Usuario { get; set; }
        public string Email { get; set; }
        public virtual ICollection<UsuarioRoles> UsuarioRoles { get; set; }
    }
}