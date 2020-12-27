using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ActivityWebsite.Models;
using Newtonsoft.Json;
using static ActivityWebsite.CustomHelper.Helper;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using System.Net;

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
        [ValidateInput(false)]
        public ActionResult Create(CreateClubModel model)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return AddModelError(ModelState);
            }
            return Content("Nice");
        }
    }
}
