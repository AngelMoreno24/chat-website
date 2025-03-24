using Postgrest.Models;
using Postgrest.Attributes;

namespace backend.Models
{
    public class User:BaseModel
    {

        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("username")]
        public long Username { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
