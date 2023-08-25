using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using TelephoneBookAPI.Data;

namespace TelephoneBookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("PersonOrigins")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly UserContext _context;

       
        public UserController(IConfiguration config, UserContext context) 
        {
            _config = config;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("CreateUser")]
        public IActionResult Create(User user)
        {
            if(_context.Users.Where(u => u.Email == user.Email).FirstOrDefault() != null)
            {
                return Ok("Already Exist");
            }

            user.MemberSince = DateTime.Now;
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("Succes");
        }

        [AllowAnonymous]
        [HttpPost("LoginUser")]
        public IActionResult Login(Login user)
        {
            var userAvailable = _context.Users.Where(u => u.Email == user.Email && u.Sifre == user.Sifre).FirstOrDefault();

            if(userAvailable != null)
            {
                return Ok(new JwtService(_config).GenerateToken(
                    userAvailable.UserId.ToString(),
                    userAvailable.Isim,
                    userAvailable.SoyIsim,
                    userAvailable.Email,
                    userAvailable.TelefonNumarasi,
                    userAvailable.Cinsiyet
                    )
                );
            }


            
            return Ok("Failure");

        }
    }
}
