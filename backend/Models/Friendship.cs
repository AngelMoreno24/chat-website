using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models
{
    public class Friendship
    {
        public string User1Id { get; set; } // User 1's ID
        public string User2Id { get; set; } // User 2's ID

        public bool IsAccepted { get; set; } // Whether the friendship is accepted or pending
    }
}