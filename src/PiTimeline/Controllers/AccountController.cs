using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PiTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AuthConfiguration _configuration;

        public AccountController(IOptions<AuthConfiguration> options)
        {
            _configuration = options.Value;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] CredentialsDto credentials)
        {
            if (credentials.Username == _configuration.DefaultAdmin 
                && credentials.Password == _configuration.DefaultAdminPassword)
            {
                return new JsonResult(new Dictionary<string, object>
                {
                    { "access_token", GetToken(credentials.Username) }
                });
            }

            return Error("Auth failed.");
        }

        private string GetToken(string username)
        {
            // always add 16 characters since sha256 requires 128 bits
            var secret = _configuration.Secret + "0123456789abcdef"; 

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var credentails = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
            };

            var token = new JwtSecurityToken(
                _configuration.Issuer,
                _configuration.Audience,
                claims,
                expires: DateTime.Now.AddDays(_configuration.TokenExpiresOnDays),
                signingCredentials: credentails
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private JsonResult Error(string message)
        {
            return new JsonResult(message) { StatusCode = 401 };
        }
    }
}
