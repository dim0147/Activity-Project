using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ActivityWebsite.Areas.Admin.Controllers
{
    public class ReactController : Controller
    {
        // GET: Admin/React
        public ActionResult Index()
        {
            return View("~/Areas/Admin/Views/Index.cshtml");
        }
    }
}