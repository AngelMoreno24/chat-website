using Postgrest.Attributes;
using Postgrest.Models;

namespace backend.Models
{
    public class Message:BaseModel
    {

        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("conversationId")]
        public long Username { get; set; }

        [PrimaryKey("senderId", false)]
        public long SenderId { get; set; }

        [PrimaryKey("content", false)]
        public long Content { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }

}

