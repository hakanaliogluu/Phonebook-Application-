using System;

namespace TelephoneBookAPI.Data
{
    public class User
    {
        public int UserId { get; set; }
        public String Isim { get; set; }
        public String SoyIsim { get; set; }
        public String Email { get; set; }
        public String TelefonNumarasi { get; set; }
        public String Cinsiyet { get; set; }
        public String Sifre { get; set; }
        public DateTime MemberSince { get; set; }
    }
}
