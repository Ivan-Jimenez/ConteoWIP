using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class UsuarioDivisiones
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuarios")]
        public int Id_Usuario { get; set; }
        public virtual Usuarios Usuarios { get; set; }

        [ForeignKey("Divisiones")]
        public int Id_Division { get; set; }
        public virtual Divisiones Divisiones { get; set; }

        [ForeignKey("Sistemas")]
        public int Id_Sistema { get; set; }
        public virtual Sistemas Sistemas { get; set; }
    }
}