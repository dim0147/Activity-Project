using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.UI.WebControls;

namespace ActivityWebsite.Authenticate
{
    public class AuthorizeRoute
    {
        public class VerifyUser : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                // Check if user Not found, Logout and return to home
                var user = filterContext.HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(filterContext.HttpContext.User.Identity.GetUserId());
                if (user == null)
                {
                    filterContext.HttpContext.GetOwinContext().Authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        action = "Index",
                        controller = "Home",
                    }));
                    return;
                }
                // User status not normal
                if (user.status != "normal")
                {
                    string status = user.status == "lock" ? "Account Disabled" : "User not valid";
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        action = "Disabled",
                        controller = "Account",
                        status = status
                    }));
                    return;
                }
                filterContext.Controller.ViewData.Add("user", user);

            }
        }


        public  class ManageAuthorize : AuthorizeAttribute
        {
            protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
            {
                if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
                {
                    // Not login
                    base.HandleUnauthorizedRequest(filterContext);
                }
                else
                {
                    // Not admin or moderator
                    filterContext.Result = new ContentResult() { Content = "You don't have permission to access this page" };
                }
            }
        }
    }
}