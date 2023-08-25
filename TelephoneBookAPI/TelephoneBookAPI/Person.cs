using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TelephoneBookAPI.Controllers;
using TelephoneBookAPI.Data;

namespace TelephoneBookAPI
{
    public class Person
    {
        public int Id { get; set; }
        public string Ad { get; set; } = string.Empty;
        public string Soyad { get; set; } = string.Empty;
        public string Numara { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}


