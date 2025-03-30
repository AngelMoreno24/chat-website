namespace backend.Models
{
    public class ConversationRequest
    {
        public string ConversationName { get; set; } = string.Empty;
        public List<string> UserIds { get; set; } = new List<string>();  
    }
}
