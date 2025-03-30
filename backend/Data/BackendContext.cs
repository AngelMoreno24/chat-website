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


    }
}
