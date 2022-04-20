namespace PiTimeline.Shared.Configuration
{
    public class AuthConfiguration
    {
        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string DefaultAdmin { get; set; }
        public string DefaultAdminPassword { get; set; }
        public int TokenExpiresOnDays { get; set; }
    }
}
