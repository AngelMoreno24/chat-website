using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }




        //adds table models
        public DbSet<User> Users { get; set; } 
        public DbSet<Conversation> Conversations { get; set; } 
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<Message> Messages { get; set; }

        public DbSet<MessageStatus> MessageStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Conversation>().ToTable("Conversations");
            modelBuilder.Entity<ConversationMember>().ToTable("ConversationMembers");
            modelBuilder.Entity<Message>().ToTable("Messages");
            modelBuilder.Entity<MessageStatus>().ToTable("MessageStatus");

            // Define unique constraint for ConversationMembers
            modelBuilder.Entity<ConversationMember>()
                .HasIndex(cm => new { cm.conversation_id, cm.user_id })
                .IsUnique()
                .HasDatabaseName("UQ_Conversation_User");

            // Define Message foreign key relationships
            modelBuilder.Entity<Message>()
                .HasOne(m => m.conversation)
                .WithMany(c => c.messages)
                .HasForeignKey(m => m.conversation_id)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Messages_Conversations");

            modelBuilder.Entity<Message>()
                .HasOne(m => m.sender)
                .WithMany(u => u.messages)
                .HasForeignKey(m => m.sender_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Messages_Users");

            // Define MessageStatus foreign key relationships
            modelBuilder.Entity<MessageStatus>()
                .HasOne(ms => ms.message)
                .WithMany(m => m.message_statuses)
                .HasForeignKey(ms => ms.message_id)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MessageStatus_Messages");

            modelBuilder.Entity<MessageStatus>()
                .HasOne(ms => ms.user)
                .WithMany(u => u.message_statuses)
                .HasForeignKey(ms => ms.user_id)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MessageStatus_Users");
        }
    }
}
