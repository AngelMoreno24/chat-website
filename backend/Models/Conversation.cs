using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.Models
{
    [Table("Conversations")]
    public class Conversation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long id { get; set; }

        [Column("name")]
        public string? name { get; set; }

        [Column("is_group")]
        public bool is_group { get; set; } = false;

        [Column("created_at")]
        public DateTime created_at { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<ConversationMember> members { get; set; } = new List<ConversationMember>();
        public ICollection<Message> messages { get; set; } = new List<Message>();

    }
}
