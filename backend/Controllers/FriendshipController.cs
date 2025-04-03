using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FriendshipController : ControllerBase
    {
        private readonly BackendContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public FriendshipController(BackendContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // Send a friend request
        [HttpPost("send-request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendshipRequestModel model)
        {
            var user1 = await _userManager.FindByIdAsync(model.User1Id);
            var user2 = await _userManager.FindByIdAsync(model.User2Id);

            if (user1 == null || user2 == null)
            {
                return BadRequest("One or both users not found.");
            }

            var existingFriendship = await _context.Friendships
                .FirstOrDefaultAsync(f => (f.User1Id == model.User1Id && f.User2Id == model.User2Id) ||
                                          (f.User1Id == model.User2Id && f.User2Id == model.User1Id));

            if (existingFriendship != null)
            {
                return BadRequest("Friendship request already exists or the users are already friends.");
            }

            var friendship = new Friendship
            {
                User1Id = model.User1Id,
                User2Id = model.User2Id,
                IsAccepted = false // Friendship is pending
            };

            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request sent successfully." });
        }

        // Accept a friend request
        [HttpPost("accept-request")]
        public async Task<IActionResult> AcceptFriendRequest([FromBody] FriendshipRequestModel model)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => f.User1Id == model.User1Id && f.User2Id == model.User2Id);

            if (friendship == null || friendship.IsAccepted)
            {
                return BadRequest("No pending friend request found or friendship already accepted.");
            }

            friendship.IsAccepted = true;

            _context.Friendships.Update(friendship);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Friendship accepted." });
        }

        // Get the list of friends for a specific user
        [HttpGet("get-friends/{userId}")]
        public async Task<IActionResult> GetFriends(string userId)
        {
            var friendships = await _context.Friendships
                .Where(f => (f.User1Id == userId || f.User2Id == userId) && f.IsAccepted)
                .ToListAsync();

            var friends = friendships.Select(f =>
                f.User1Id == userId ? f.User2Id : f.User1Id).ToList();

            return Ok(friends);
        }

        // Check if two users are friends
        [HttpGet("are-friends/{userId1}/{userId2}")]
        public async Task<IActionResult> AreFriends(string userId1, string userId2)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => (f.User1Id == userId1 && f.User2Id == userId2) ||
                                          (f.User1Id == userId2 && f.User2Id == userId1));

            if (friendship != null && friendship.IsAccepted)
            {
                return Ok(new { message = "They are friends." });
            }

            return Ok(new { message = "They are not friends." });
        }
    }

    // Model for sending a friendship request
    public class FriendshipRequestModel
    {
        public string User1Id { get; set; }
        public string User2Id { get; set; }
    }
}