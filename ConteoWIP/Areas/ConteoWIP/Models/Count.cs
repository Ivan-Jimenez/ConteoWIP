using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConteoWIP.Areas.ConteoWIP.Models
{
    public class Count
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [Required (ErrorMessage = "{0} is required")]
        public string Product { get; set; }
        [Required(ErrorMessage = "{0} is required")]
        public string Alias { get; set; }
        public string ProductName { get; set; }
        [Required(ErrorMessage = "{0} is required")]
        public string AreaLine { get; set; }
        public int OperationNumber { get; set; }
        [DataType(DataType.Text)]
        public string OperationDescription { get; set; }
        [Required(ErrorMessage = "{0} is required")]
        public int OrderNumber { get; set; }
        [Required(ErrorMessage = "{0} is required")]
        public int OrdQty { get; set; }
        public int Physical1 { get; set; }
        public int Result { get; set; }
        [DataType(DataType.Text)]
        public string Comments { get; set; }
        public int ReCount { get; set; }
        public int FinalResult { get; set; }
        public string Status { get; set; }
        public string ConciliationUser { get; set; }
    }
}