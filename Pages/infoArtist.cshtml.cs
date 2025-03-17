using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MusicBusniess;
using MusicCenterAPI;
using MusicCenterAPI.Data;
using MusicCenterAPI.ProcedureStorage;
using System.Data.SqlClient;

namespace MusicCenterAPPWEB.Pages
{
    public class infoArtistModel : PageModel
    {
        public string? ArtistUid { get; set; }
        public string StageName { get; set; }
        public string Avata { get; set; }
        public int Visits { get; set; }
        private IMusicCenterAPI api;
        public infoArtistModel(IMusicCenterAPI api)
        {
            this.api = api;
        }
        public void OnGet(string id)
        {
            ArtistUid = null;
            if (Guid.TryParse(id, out Guid aritstUid))
            {
                ArtistData artist = new ArtistData(api, aritstUid);
                ArtistUid = artist.ArtistUid;
                StageName = artist.StageName;
                Avata = artist.Avata;
                Visits = artist.Visits;
            }
        }
        public List<Dictionary<string, object>> getRecords()
        {
            SqlParameter[] parameters = new SqlParameter[]
              {
                    new SqlParameter("@AritsUid", System.Data.SqlDbType.NVarChar) {Value = ArtistUid.ToString()}
              };
            return api.CoventToDictionarysWithDataTable(api.ProcedureCall(ProcedureName.GET_RECORDS_FOR_ARTIST, parameters));
        }
    }
}
