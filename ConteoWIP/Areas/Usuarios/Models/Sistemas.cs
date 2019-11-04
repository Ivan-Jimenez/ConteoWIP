using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class Sistemas
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Roles> Roles { get; set; }
        public virtual ICollection<SistemaPantallas> SistemaPantalla { get; set; }
    }
}