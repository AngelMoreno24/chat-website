using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long id { get; set; }

        [Column("username")]
        [Required]
        [MaxLength(50)]
        public string username { get; set; }

        [Column("email")]
        [Required]
        [MaxLength(100)]
        public string email { get; set; }

        [Column("password_hash")]
        [Required]
        public string password_hash { get; set; }

        [Column("created_at")]
        public DateTime created_at { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<ConversationMember> conversations { get; set; } = new List<ConversationMember>();

        public ICollection<Message> messages { get; set; } = new List<Message>();

        public ICollection<MessageStatus> message_statuses { get; set; } = new List<MessageStatus>();

    }
}
