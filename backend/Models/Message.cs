using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Message
    {

        [Key]
        public int Id { get; set; }  // Primary Key

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime SentAt { get; set; } = DateTime.UtcNow; // Timestamp when the message was sent

        [Required]
        public string SenderId { get; set; } // User ID of the sender

        // Foreign Key linking to Conversation
        [ForeignKey("Conversation")]
        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; }  // Navigation property

    }
}
