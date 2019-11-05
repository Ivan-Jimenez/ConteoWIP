using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ConteoWIP.Areas.ConteoWIP.Models
{
    public class ReCountStatusBINS
    {
        [Key]
        public string AreaLine { get; set; }
        public bool Finish { get; set; }
    }
}