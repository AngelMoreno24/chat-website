using Postgrest.Attributes;
using Postgrest.Models;

namespace backend.Models
{
    public class Message:BaseModel
    {

        [PrimaryKey("id", false)]
        public Guid Id { get; set; } = Guid.NewGuid();  // Unique ID

        [Column("conversation_id")]
        public Guid ConversationId { get; set; }  // Links to Conversation

        [Column("sender_id")]
        public Guid SenderId { get; set; }  // Links to User

        [Column("content")]
        public string Content { get; set; }  // Message text

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}

