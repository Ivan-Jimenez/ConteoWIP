using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.Usuarios.Models
{
    public class SistemaPantallas
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Sistema")]
        public int Id_sistema { get; set; }
        public virtual Sistemas Sistema { get; set; }


        public string Persona_Encargada { get; set; }
        public string Descripcion { get; set; }
        public string Ext { get; set; }
    }
}