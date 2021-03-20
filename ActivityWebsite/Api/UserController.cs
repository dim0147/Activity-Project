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
using Microsoft.Owin.Security;

namespace ActivityWebsite.Api
{

    public class ModelDeleteUser
    {
        public string UserId { get; set; }
    }

    public class UserController : ApiController
    {

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/user")]
        public IHttpActionResult GetDefaultUser()
        {
            var user = EF.UserHandle.GetUserDetail(User.Identity.GetUserId());
            return Json(new { 
                success = true,
                user = EF.UserHandle.GetUserDetail(User.Identity.GetUserId())
            });
        }

        [HttpPost]
        [Route("api/user/login")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> LoginUser(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Content(HttpStatusCode.NotAcceptable, "Missing username or password");
            }
            ApplicationUserManager userManager = HttpContext.Current.Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            ApplicationSignInManager signinManager = HttpContext.Current.Request.GetOwinContext().GetUserManager<ApplicationSignInManager>();
            var user = await userManager.FindByEmailAsync(model.UsernameOrEmail);
            if(user == null)
            {
                return Content(HttpStatusCode.NotAcceptable, "Incorrect username or password");
            }
            var roles = await userManager.GetRolesAsync(user.Id);
            if (!roles.Contains("Admin") && !roles.Contains("Moderator"))
            {
                return Content(HttpStatusCode.NotAcceptable, "You don't have permission to access this site");
            }
            var result = await signinManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberMe, true);
            if(result != SignInStatus.Success)
            {
                return Content(HttpStatusCode.NotAcceptable, "Incorrect username or password");
            }
            return Content(HttpStatusCode.OK, "Login Success");
        }

        [HttpPost]
        [Route("api/user/logout")]
        public IHttpActionResult LogoutUser()
        {

            IAuthenticationManager AuthenticationManager = HttpContext.Current.Request.GetOwinContext().Authentication;
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return Content(HttpStatusCode.OK, "success");
        }

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/user/clubs")]
        public async Task<IHttpActionResult> GetUserClubs()
        {
            var result = await EF.UserHandle.GetUserClubs(User.Identity.GetUserId());
            return Json(new
            {
                success = true,
                data = result
            });
        }

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/user/posts")]
        public async Task<IHttpActionResult> GetUserPosts()
        {
            var result = await EF.UserHandle.GetUserPosts(User.Identity.GetUserId());
            return Json(new
            {
                success = true,
                data = result
            });
        }

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/user/following")]
        public async Task<IHttpActionResult> GetUserFollowing()
        {
            var result = await EF.UserHandle.GetUserFollowing(User.Identity.GetUserId());
            return Json(new
            {
                success = true,
                data = result
            });
        }

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/user/reports")]
        public async Task<IHttpActionResult> GetUserReports()
        {
            var result = await EF.UserHandle.GetUserReport(User.Identity.GetUserId());
            return Json(new
            {
                success = true,
                data = result
            });
        }
    
        [HttpGet]
        [Route("api/user/get-recent-user")]
        [Authorize(Roles ="Admin,Moderator")]
        [VerifyUser]
        public IHttpActionResult GetRecentUser()
        {
            return Json(EF.UserHandle.GetRecentUser());
        }

        [HttpGet]
        [Route("api/user/get-all-user")]
        [Authorize(Roles = "Admin,Moderator")]
        [VerifyUser]
        public IHttpActionResult GetAllUser()
        {
            return Json(EF.UserHandle.GetAllUser());
        }

        [HttpPost]
        [Route("api/user/delete-user")]
        [Authorize(Roles = "Admin")]
        [VerifyUser]
        public IHttpActionResult DeleteUser(ModelDeleteUser model)
        {
            var isSucess = EF.UserHandle.DeleteUser(model.UserId);
            if (!isSucess)
            {
                return Content(HttpStatusCode.InternalServerError, "Cannot delete");
            }

            return Content(HttpStatusCode.OK, "Delete Success");


        }

        [HttpGet]
        [Route("api/user/get-moderator")]
        [Authorize(Roles = "Admin")]
        [VerifyUser]
        public IHttpActionResult GetModerator()
        {
            return Json(EF.UserHandle.GetModerator());
        }

        [HttpPost]
        [Route("api/user/remote-moderator/{id}")]
        [Authorize(Roles = "Admin")]
        [VerifyUser]
        public IHttpActionResult RemoteModerator(string id)
        {
            return Json(EF.UserHandle.RemoteModerator(id));
        }

        [HttpDelete]
        [Route("api/user/denote-moderator/{id}")]
        [Authorize(Roles = "Admin")]
        [VerifyUser]
        public IHttpActionResult DenoteModerator(string id)
        {
            return Json(EF.UserHandle.DenoteModerator(id));
        }

    }
}
