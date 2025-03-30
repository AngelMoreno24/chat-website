using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly BackendContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public ConversationController(BackendContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // POST api/conversation/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateConversation([FromBody] ConversationRequest request)
        {
            // Validate input
            if (string.IsNullOrEmpty(request.ConversationName) || request.UserIds == null || request.UserIds.Count == 0)
            {
                return BadRequest("Conversation name and users are required.");
            }

            // Create a new conversation
            var conversation = new Conversation
            {
                ConversationName = request.ConversationName,
                CreatedAt = DateTime.UtcNow
            };

            // Add the current user to the conversation (the user creating the conversation)
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);  // Get the current user ID
            if (!request.UserIds.Contains(currentUserId))
            {
                request.UserIds.Add(currentUserId);  // Make sure the creator is added to the conversation
            }

            // Add the users to the ConversationUser table
            var conversationUsers = new List<ConversationUser>();
            foreach (var userId in request.UserIds)
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    conversationUsers.Add(new ConversationUser
                    {
                        UserId = userId,
                        Conversation = conversation
                    });
                }
                else
                {
                    return BadRequest($"User with ID {userId} not found.");
                }
            }

            // Add the conversation and members to the context
            _context.Conversations.Add(conversation);
            _context.ConversationUsers.AddRange(conversationUsers);

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return the created conversation (you can choose what details to return)
            return CreatedAtAction(nameof(GetConversation), new { id = conversation.Id }, conversation);
        }

        // Optionally, create an endpoint to get the conversation by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetConversation(int id)
        {
            var conversation = await _context.Conversations
                .Include(c => c.ConversationUsers)
                .ThenInclude(cu => cu.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (conversation == null)
            {
                return NotFound();
            }

            return Ok(conversation);
        }
    }
}