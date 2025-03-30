using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class ConversationUser
    {
        public int ConversationId { get; set; }  // Foreign key to Conversation
        public Conversation Conversation { get; set; }  // Navigation property

        public string UserId { get; set; }  // Foreign key to User (IdentityUser)
        public IdentityUser User { get; set; }  // Navigation property
    }
}
