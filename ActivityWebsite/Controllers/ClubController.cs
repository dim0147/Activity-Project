using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ActivityWebsite.Models;
using Newtonsoft.Json;
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

        [HttpPost]
        public ActionResult Create(CreateClubModel model)
        {
            return Content("Nice");
        }
    }
}
