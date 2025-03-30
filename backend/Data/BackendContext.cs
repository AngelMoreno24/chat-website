using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace backend.Data
{
    public class BackendContext : IdentityDbContext<IdentityUser>
    {

        public BackendContext(DbContextOptions options):base(options)
        { 
        
        }

        // Add DbSet properties for Conversation and Message models

        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ConversationUser> ConversationUsers { get; set; }  // Add ConversationUser as a DbSet

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure many-to-many relationship
            modelBuilder.Entity<ConversationUser>()
                .HasKey(cu => new { cu.ConversationId, cu.UserId });  // Composite key

            modelBuilder.Entity<ConversationUser>()
                .HasOne(cu => cu.Conversation)
                .WithMany(c => c.ConversationUsers)
                .HasForeignKey(cu => cu.ConversationId);

            modelBuilder.Entity<ConversationUser>()
                .HasOne(cu => cu.User)
                .WithMany()  // No need for a reverse navigation property in IdentityUser
                .HasForeignKey(cu => cu.UserId);

            // Define the relationship between Message and Conversation
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
