using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MusicBusniess;
using MusicCenterAPI.Data;
using MusicCenterAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;

namespace MusicCenterAPPWEB.Pages
{
    public class favoriteModel : PageModel
    {
        public string? UserName { get; set; }
        public IMusicCenterAPI api;

        public favoriteModel(IMusicCenterAPI api)
        {
            this.api = api;
        }

        public void OnGet(string userName, string sessionLoginUid)
        {
            var par = api.DecodeToken(sessionLoginUid);
            UserName = par.FindFirst(ClaimTypes.Name)?.Value;
            
        }
    }
}
