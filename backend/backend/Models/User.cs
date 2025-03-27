using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class User
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long id { get; set; }

        [Required]
        [MaxLength(50)]
        public string username { get; set; }

        [Required]
        [MaxLength(100)]
        public string email { get; set; }

        [Required]
        public string password_hash { get; set; }

        public DateTime created_at { get; set; } = DateTime.UtcNow;
    }
}
