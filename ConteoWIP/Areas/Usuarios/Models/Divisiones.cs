using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class Divisiones
    {
        [Key]
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public string Clave1 { get; set; }
        public string Clave2 { get; set; }

        //public virtual ICollection<Empleados> empleado { get; set; }
        //public virtual ICollection<Turnos> Turno { get; set; }
        public virtual ICollection<UsuarioDivisiones> UsuarioDivisiones { get; set; }
    }
}