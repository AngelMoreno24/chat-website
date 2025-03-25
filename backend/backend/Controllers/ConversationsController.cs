using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Supabase;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationsController : ControllerBase
    {
        private readonly Client _supabase;

        public ConversationsController(Client supabase)
        {
            _supabase = supabase;
        }

        // Create a new conversation (DM or Group)
        [HttpPost]
        public async Task<IActionResult> CreateConversation([FromBody] Conversation conversation)
        {
            var response = await _supabase.From<Conversation>().Insert(conversation);
            return Ok(response);
        }

        // Get all conversations
        [HttpGet]
        public async Task<IActionResult> GetConversations()
        {
            var response = await _supabase.From<Conversation>().Get();
            return Ok(response.Models);
        }
    }
}
