using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TelephoneBookAPI.Data
{
    public class JwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(string id, string isim, string soyisim, string email, string telefonnumarasi, string cinsiyet)
        {
            var secretKey = _config["JwtConfig:Key"];
            var tokenDuration = int.Parse(_config["JwtConfig:Duration"]);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var signature = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", id),
                new Claim("isim", isim),
                new Claim("soyisim", soyisim),
                new Claim("email", email),
                new Claim("telefonnumarasi", telefonnumarasi),
                new Claim("cinsiyet", cinsiyet)
            };

            var jwtToken = new JwtSecurityToken(
                issuer: "localhost",
                audience: "localhost",
                claims: claims,
                expires: DateTime.Now.AddMinutes(tokenDuration),
                signingCredentials: signature
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
