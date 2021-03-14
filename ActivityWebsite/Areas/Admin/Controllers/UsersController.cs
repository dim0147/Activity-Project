using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ActivityWebsite.Areas.Admin.Controllers
{
    public class UsersController : Controller
    {
        // GET: Admin/Users
        public ActionResult Index()
        {
            return View("~/Areas/Admin/Views/Index.cshtml");
        }
    }
}