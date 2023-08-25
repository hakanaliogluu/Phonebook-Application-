using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using TelephoneBookAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using System.Linq;

namespace TelephoneBookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly DataContext _context;
        private IHttpContextAccessor _httpContextAccessor;

        public PersonController(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;

        }

        public User CurrentUser
        {
            get
            {
                var isAuthenticated = _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated;
                if (isAuthenticated == true)
                {
                    var userIdValue = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (int.TryParse(userIdValue, out int userId))
                    {
                        // Diğer özellikleri de doldurun
                        var isim = _httpContextAccessor.HttpContext.User.FindFirstValue("isim");
                        var soyIsim = _httpContextAccessor.HttpContext.User.FindFirstValue("soyisim");
                        var email = _httpContextAccessor.HttpContext.User.FindFirstValue("email");
                        var telefonNumarasi = _httpContextAccessor.HttpContext.User.FindFirstValue("telefonnumarasi");
                        var cinsiyet = _httpContextAccessor.HttpContext.User.FindFirstValue("cinsiyet");

                        return new User
                        {
                            UserId = userId,
                            Isim = isim,
                            SoyIsim = soyIsim,
                            Email = email,
                            TelefonNumarasi = telefonNumarasi,
                            Cinsiyet = cinsiyet
                        };
                    }
                }

                // Kimlik doğrulanamadıysa veya UserId dönüşümü başarısız olduysa default User nesnesini döndürün
                return new User
                {
                    UserId = 3, // Veya istediğiniz default değeri buraya yazın
                };
            }
        }




        [HttpGet("{userId}")]
        public async Task<ActionResult<List<Person>>> GetPersons(int userId)
        {
            try
            {
                // UserId'ye ait kişileri veritabanından çekelim
                var persons = await _context.Persons
                    .Where(p => p.UserId == userId) // Sadece giriş yapan kullanıcının verilerini seç
                    .ToListAsync();

                return Ok(persons);
            }
            catch (Exception ex)
            {
                // Hata durumunda mesaj ve hata kodu döndür
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }


        [HttpPost]
        public async Task<ActionResult<List<Person>>> CreatePersons([FromQuery] int userId, Person person)
        {
            var currentUser = CurrentUser; // Mevcut kullanıcı bilgisini al
            person.UserId = userId; // Kişi nesnesine mevcut kullanıcının UserId'sini ata

            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            try
            {
                // UserId'ye ait kişileri veritabanından çekelim
                var persons = await _context.Persons
                    .Where(p => p.UserId == userId) // Sadece giriş yapan kullanıcının verilerini seç
                    .ToListAsync();

                return Ok(persons);
            }
            catch (Exception ex)
            {
                // Hata durumunda mesaj ve hata kodu döndür
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut]
        public async Task<ActionResult<List<Person>>> UpdatePersons([FromQuery] int userId, Person person)
        {
            var dbPerson = await _context.Persons.FindAsync(person.Id);
            if (dbPerson == null)
                return BadRequest("Kişi Bulunamadı.");

            dbPerson.Ad = person.Ad;
            dbPerson.Soyad = person.Soyad;
            dbPerson.Numara = person.Numara;
            person.UserId = userId; // Kişi nesnesine mevcut kullanıcının UserId'sini ata


            await _context.SaveChangesAsync();

            try
            {
                // UserId'ye ait kişileri veritabanından çekelim
                var persons = await _context.Persons
                    .Where(p => p.UserId == userId) // Sadece giriş yapan kullanıcının verilerini seç
                    .ToListAsync();

                return Ok(persons);
            }
            catch (Exception ex)
            {
                // Hata durumunda mesaj ve hata kodu döndür
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Person>>> DeletePersons([FromQuery] int userId, int id)
        {
            var dbPerson = await _context.Persons.FindAsync(id);
            if (dbPerson == null)
                return BadRequest("Kişi Bulunamadı.");

            _context.Persons.Remove(dbPerson);

            await _context.SaveChangesAsync();

            try
            {
                // UserId'ye ait kişileri veritabanından çekelim
                var persons = await _context.Persons
                    .Where(p => p.UserId == userId) // Sadece giriş yapan kullanıcının verilerini seç
                    .ToListAsync();

                return Ok(persons);
            }
            catch (Exception ex)
            {
                // Hata durumunda mesaj ve hata kodu döndür
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

    }
}