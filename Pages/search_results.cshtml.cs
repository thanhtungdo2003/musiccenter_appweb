using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MusicCenterAPPWEB.Pages
{
    public class search_resultsModel : PageModel
    {
        public string rawKeyWord;
        public void OnGet(string keyword)
        {
            string keywordBase = keyword;
            rawKeyWord = keyword.Substring(1);           
        }
    }
}
