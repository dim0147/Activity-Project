using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static ActivityWebsite.Authenticate.AuthorizeRoute;

namespace ActivityWebsite.Areas.Admin.Controllers
{
    [ManageAuthorize(Roles = "Admin")]
    [VerifyUser]
    public class HomeController : Controller
    {
        // GET: Admin/Home
        public ActionResult Index()
        {
            return View();
        }
    }
}