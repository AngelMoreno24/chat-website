using backend.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("MessageStatus")]
    public class MessageStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long id { get; set; }

        [Required]
        [Column("message_id")]
        public long message_id { get; set; }

        [Required]
        [Column("user_id")]
        public long user_id { get; set; }

        [Column("is_read")]
        public bool is_read { get; set; } = false;

        [Column("read_at")]
        public DateTime? read_at { get; set; } // Nullable, updated when read

        // Navigation properties
        [ForeignKey("message_id")]
        public Message message { get; set; }

        [ForeignKey("user_id")]
        public User user { get; set; }
    }
}