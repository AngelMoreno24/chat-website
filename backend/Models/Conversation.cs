using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Conversation
    {
        [Key]
        public int Id { get; set; }

        public string ConversationName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property to the many-to-many relationship
        public List<ConversationUser> ConversationUsers { get; set; } = new List<ConversationUser>();

        // Navigation Property to the related messages
        public List<Message> Messages { get; set; } = new List<Message>();


    }
}
