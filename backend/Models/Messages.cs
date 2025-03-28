using backend.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Messages")]
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long id { get; set; }

        [Required]
        [Column("conversation_id")]
        public long conversation_id { get; set; }

        [Column("sender_id")]
        public long? sender_id { get; set; } // Nullable sender_id

        [Required]
        [Column("content")]
        public string content { get; set; }

        [Column("created_at")]
        public DateTime created_at { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("conversation_id")]
        public Conversation conversation { get; set; }

        [ForeignKey("sender_id")]
        public User sender { get; set; }
    }
}