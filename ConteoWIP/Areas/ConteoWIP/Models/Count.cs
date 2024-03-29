﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConteoWIP.Areas.ConteoWIP.Models
{
    public class Count
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [Required(ErrorMessage = "{0} is required")]
        public int OrderNumber { get; set; }
        [Required(ErrorMessage ="{0} is required")]
        public string Product { get; set; }
        
        public string Alias { get; set; }

        public string ProductName { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        public string AreaLine { get; set; }

        public int OperationNumber { get; set; }

        [DataType(DataType.Text)]
        public string OperationDescription { get; set; }

        [Required(ErrorMessage = "{0} is required")]
        public int OrdQty { get; set; }

        public int? Physical1 { get; set; } = 0;

        public int? Result { get; set; } = 0;

        [DataType(DataType.Text)]
        public string Comments { get; set; }

        public int? ReCount { get; set; } = 0;

        public int? FinalResult { get; set; } = 0;

        [DataType(DataType.Text)]
        public string Status { get; set; }

        [DataType(DataType.Text)]
        public string ConciliationUser { get; set; }

        [Column(TypeName = "Money")]
        public int StdCost { get; set; }

        [Column(TypeName = "Money")]
        public int? TotalCost { get; set; }
    }
}