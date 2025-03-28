using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageStatusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessageStatusController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("message/{message_id}")]
        public async Task<ActionResult<IEnumerable<MessageStatus>>> GetMessageStatuses(long message_id)
        {
            return await _context.MessageStatuses
                .Where(ms => ms.message_id == message_id)
                .Include(ms => ms.user)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<MessageStatus>> SetMessageStatus(MessageStatus messageStatus)
        {
            _context.MessageStatuses.Add(messageStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMessageStatuses), new { message_id = messageStatus.message_id }, messageStatus);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> MarkAsRead(long id)
        {
            var messageStatus = await _context.MessageStatuses.FindAsync(id);
            if (messageStatus == null)
            {
                return NotFound();
            }

            messageStatus.is_read = true;
            messageStatus.read_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}