using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MusicBusniess;
using MusicCenterAPI.Data;
using MusicCenterAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;

namespace MusicCenterAPPWEB.Pages
{
    public class playlistModel : PageModel
    {
        public Guid? PlaylistUid { get; set; }
        public string playlistName { get; set; }
        public string? UserName { get; set; }
        public List<RecordData> records;
        public IMusicCenterAPI api;

        public playlistModel(IMusicCenterAPI api)
        {
            this.api = api;
            PlaylistUid = null;
        }

        public void OnGet(string userName, string sessionLoginUid, string playlistUid)
        {
            var par = api.DecodeToken(sessionLoginUid);
            UserName = par.FindFirst(ClaimTypes.Name)?.Value;

            if (UserName != null)
                {
                    if (Guid.TryParse(playlistUid, out Guid pid)){
                        PlayListData playList = new PlayListData(api, pid);
                        PlaylistUid = pid;
                        playlistName = playList.playlistName;
                        UserName = this.UserName;
                        records = playList.records;
                    }
                }
            }
        public ArtistData getArtist(RecordData record)
        {
            ArtistData artist = new ArtistData(api, Guid.Parse(record.ArtistUid));
            return artist;
        } public CategoryData GetCategory(RecordData record)
        {
            CategoryData category = new CategoryData(api, Guid.Parse(record.CategoryUid));
            return category;
        }
    }
}
