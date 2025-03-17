using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MusicBusniess;
using MusicBusniess.Data;
using MusicCenterAPI.Data;
using System.Globalization;
using System.Security.Claims;
using System.Security.Principal;

namespace MusicCenterAPPWEB.Pages
{
    public class pay_confirmModel : PageModel
    {
        public string messager { get; set; }

        public IMusicCenterAPI api;
        public pay_confirmModel(IMusicCenterAPI api)
        {
            this.api = api;
        }
        public void OnGet(string id)
        {
            CollectionLinkRequest model = new CollectionLinkRequest(api, id);
            if (model.active)
            {
                messager = "Mã đơn này đã được thanh toán trước đó rồi";
                return;
            }
            messager = "Thanh toán thành công!";
            AccountData account = new AccountData(api, model.username);
            int exNewDate = 0;
            if (model.orderInfo == "PremiumReg 30DAY")
            {
                exNewDate = 30;
            }
            else if (model.orderInfo == "PremiumReg 1Y")
            {
                exNewDate = 365;
            }
            else if (model.orderInfo == "PremiumReg NOEX")
            {
                exNewDate = -1;
            }
            if (account.PremiumEx != "NOEX")
            {
                DateTime now = DateTime.Now;
                if (account.PremiumEx == "NONE")
                {
                    account.PremiumEx = now.ToString("dd-MM-yyyy");
                }
                else
                {
                    if (exNewDate == -1)
                    {
                        account.PremiumEx = "NOEX";
                    }
                    else
                    {
                        DateTime oldDate = DateTime.ParseExact(account.PremiumEx, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                        DateTime newDate = oldDate.AddDays(exNewDate);
                        account.PremiumEx = newDate.ToString("dd-MM-yyyy");
                    }
                }
                model.active = true;
                model.Save();
                account.Save();
            }
        }
    }
}
