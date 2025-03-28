using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{

    [Table("ConversationMembers")]
    public class ConversationMember
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long id { get; set; }

        [Required]
        [Column("conversation_id")]
        public long conversation_id { get; set; }

        [Required]
        [Column("user_id")]
        public long user_id { get; set; }

        [Column("joined_at")]
        public DateTime joined_at { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("conversation_id")]
        public Conversation conversation { get; set; }

        [ForeignKey("user_id")]
        public User user { get; set; }
    }
}
