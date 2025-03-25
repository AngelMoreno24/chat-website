using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Supabase;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly Client _supabase;

        public MessagesController(Client supabase)
        {
            _supabase = supabase;
        }

        // Send a new message
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            var response = await _supabase.From<Message>().Insert(message);
            return Ok(response);
        }

        // Get messages for a conversation
        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetMessages(Guid conversationId)
        {
            var response = await _supabase
                .From<Message>()
                .Filter("conversation_id", Postgrest.Constants.Operator.Equals, conversationId)
                .Get();

            return Ok(response.Models);
        }
    }
}
