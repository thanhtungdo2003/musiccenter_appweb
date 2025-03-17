using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MusicBusniess;
using MusicCenterAPI.Data;

namespace MusicCenterAPPWEB.Pages
{
    public class categoryModel : PageModel
    {
        public string categoryUid;
        private IMusicCenterAPI api;
        public categoryModel(IMusicCenterAPI api)
        {
            this.api = api;
        }
        public void OnGet(string uid)
        {
            if (Guid.TryParse(uid, out Guid id))
            {
                CategoryData category = new CategoryData(api, id);
                if (category.categoryUid != null)
                {
                    categoryUid = category.categoryUid;
                }
            }
        }
    }
}
