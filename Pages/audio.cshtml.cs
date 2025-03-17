using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MuscicCenter.Storage;
using MusicBusniess;
using MusicCenterAPI.Data;
using MusicCenterAPI.Models;

namespace MusicCenterAPPWEB.Pages
{
    public class audioModel : PageModel
    {
        public IMusicCenterAPI api;
        public audioModel(IMusicCenterAPI api)
        {
            this.api = api;
        }
        public string? uid { get; set; }
        public string categoryUid { get; set; }
        public string displayName { get; set; }
        public int views { get; set; }
        public ArtistData artist { get; set; }
        public IFormFile recordPath { get; set; }
        public IFormFile Poster { get; set; }
        public IFormFile CoverPhoto { get; set; }
      

        public void OnGet(string id)
        {
            Guid idValue;
            if (Guid.TryParse(id, out idValue))
            {
                if (idValue == null) return;
                var record = new RecordData(api, idValue.ToString());
                Console.WriteLine("Name: "+record.DisplayName);
                ArtistData artistData = new ArtistData(api, Guid.Parse(record.ArtistUid));
                if (record != null)
                {
                    uid = record.RecordUid;
                    artist = artistData;
                    categoryUid = record.CategoryUid;
                    displayName = record.DisplayName;
                    recordPath = api.FileExport("poster-record", record.Record);
                    CoverPhoto = api.FileExport("poster-coverphoto", record.CoverPhoto);
                    Poster = api.FileExport("poster-record", record.Poster);
                    views = (int)api.getValueByKey(DatabaseStruct.RecordTable, "Views", "RecordUid", uid.ToString());
                }
            }
        }

    }
}
