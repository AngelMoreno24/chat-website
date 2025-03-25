using Postgrest.Attributes;
using Postgrest.Models;

namespace backend.Models
{
    public class Conversation : BaseModel
    {

        [PrimaryKey("id", false)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column("name")]
        public string Name { get; set; }

        [Column("is_group")]
        public bool IsGroup { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
