using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static ActivityWebsite.Authenticate.AuthorizeRoute;

namespace ActivityWebsite.Controllers
{

    public class ClubController : Controller
    {
        [Authorize]
        [VerifyUser]
        public ActionResult Create()
        {
            return View();
        }
    }
}
