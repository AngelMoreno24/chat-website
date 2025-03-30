using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{

    [Authorize(Roles = "User")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("You have accessed the User controller.");
        }


        [HttpGet("profile")]
        public IActionResult GetUserProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId == null)
            {
                return Unauthorized("User not found.");
            }

            return Ok(new
            {
                Id = userId,
                Email = userEmail,
                Role = userRole
            });
        }
    }
}
