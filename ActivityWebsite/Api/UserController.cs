using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.Models;
using Microsoft.AspNet.Identity;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity; // Maybe this one too
using System.Web;
using System.Threading.Tasks;

namespace ActivityWebsite.Api
{
    public class UserController : ApiController
    {

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/user")]
        public IHttpActionResult GetDefaultUser()
        {
            return Json(new { 
                success = true,
                user = EF.UserHandle.GetUserDetail(User.Identity.GetUserId()).Result
            });
        }
    }
}
