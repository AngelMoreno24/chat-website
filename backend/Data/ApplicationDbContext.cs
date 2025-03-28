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




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Enforce snake_case column names
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Conversation>().ToTable("Conversations");
            modelBuilder.Entity<ConversationMember>().ToTable("ConversationMembers");

            // Define unique constraint for ConversationMembers
            modelBuilder.Entity<ConversationMember>()
                .HasIndex(cm => new { cm.conversation_id, cm.user_id })
                .IsUnique()
                .HasDatabaseName("UQ_Conversation_User");

            // Define foreign key relationships
            modelBuilder.Entity<ConversationMember>()
                .HasOne(cm => cm.conversation)
                .WithMany(c => c.members)
                .HasForeignKey(cm => cm.conversation_id)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ConversationMembers_Conversations");

            modelBuilder.Entity<ConversationMember>()
                .HasOne(cm => cm.user)
                .WithMany(u => u.conversations)
                .HasForeignKey(cm => cm.user_id)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ConversationMembers_Users");
        }
    }
}
