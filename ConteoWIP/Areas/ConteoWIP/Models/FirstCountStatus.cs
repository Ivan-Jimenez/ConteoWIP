using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.ConteoWIP.Models
{
    public class FirstCountStatus
    {
        [Key]
        public string AreaLine { get; set; }
        public bool Finish { get; set; }
    }
}