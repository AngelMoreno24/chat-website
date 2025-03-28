using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConversationMembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConversationMember>>> GetConversationMembers()
        {
            return await _context.ConversationMembers
                .Include(cm => cm.user)
                .Include(cm => cm.conversation)
                .ToListAsync();
        }

        [HttpGet("conversation/{conversation_id}")]
        public async Task<ActionResult<IEnumerable<ConversationMember>>> GetMembersByConversation(long conversation_id)
        {
            return await _context.ConversationMembers
                .Where(cm => cm.conversation_id == conversation_id)
                .Include(cm => cm.user)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ConversationMember>> AddUserToConversation(ConversationMember conversationMember)
        {
            var existingMember = await _context.ConversationMembers
                .FirstOrDefaultAsync(cm => cm.conversation_id == conversationMember.conversation_id
                                        && cm.user_id == conversationMember.user_id);

            if (existingMember != null)
                return Conflict("User is already in this conversation.");

            _context.ConversationMembers.Add(conversationMember);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConversationMembers), new { id = conversationMember.id }, conversationMember);
        }

        [HttpDelete("{conversation_id}/{user_id}")]
        public async Task<IActionResult> RemoveUserFromConversation(long conversation_id, long user_id)
        {
            var conversationMember = await _context.ConversationMembers
                .FirstOrDefaultAsync(cm => cm.conversation_id == conversation_id && cm.user_id == user_id);

            if (conversationMember == null)
                return NotFound();

            _context.ConversationMembers.Remove(conversationMember);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}