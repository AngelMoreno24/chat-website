using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Conversation
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [MaxLength(100)]
        public string? Name { get; set; } // Nullable for private chats

        public bool IsGroup { get; set; } = false; // Default to false

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
