using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ActivityWebsite.Models;
using System.Text.RegularExpressions;
using System.Web.Routing;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using static ActivityWebsite.CustomHelper.Helper;
using System.Net;

namespace ActivityWebsite.Controllers
{
    [Authorize]
    [VerifyUser]
    public class ManageController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public ManageController()
        {
        }

        public ManageController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public async Task<ActionResult> Index()
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

            ViewBag.user.Email = Regex.Replace(user.Email, @"(?<=[\w]{1})[\w-\._\+%]*(?=[\w]{1}@)", m => new string('*', m.Length));

            return View();
        }

        public ActionResult ChangeUsername()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ChangeUsername(ChangeUsernameViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Check if username is exist
            var usernameIsExist = await UserManager.FindByNameAsync(model.Username);
            if (usernameIsExist != null)
            {
                ModelState.AddModelError("", $"{model.Username} is exist already!");
                return View(model);
            }

            // Change username
            ApplicationUser currentUser = ViewBag.user;
            currentUser.UserName = model.Username;
            var updateResult = await UserManager.UpdateAsync(currentUser);
            // Check if not success
            if (!updateResult.Succeeded)
            {
                AddErrors(updateResult);
                return View(model);
            }

            await SignInManager.SignInAsync(currentUser, isPersistent: true, rememberBrowser: false);

            ViewBag.successMessage = "Update username success!";
            return View(model);
        }

        public ActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            //  Change password
            var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
            if (!result.Succeeded)
            {
                AddErrors(result);
                return View(model);

            }

            // Login user
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            await SignInManager.SignInAsync(user, isPersistent: true, rememberBrowser: false);

            ViewBag.successMessage = "Change password success";
            return View();

        }

        public ActionResult SetPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SetPassword(SetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Change password
            var result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
            if (!result.Succeeded)
            {
                AddErrors(result);
                return View(model);
            }

            // Login user
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

            ViewBag.successMessage = "Set up new password success!";
            return View(model);
        }

        [HttpPost]
        public async Task<ActionResult> sendCodeConfirmEmail()
        {

            // Check if email is confirm already
            ApplicationUser user = ViewBag.user;
            if (user.EmailConfirmed)
            {
                JsonResult errorResponse = gerenateJsonRs(new { error = true, message = "Email have confirm already!" });
                ControllerContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return errorResponse;
            }

            // Gerenate email confirm url
            string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
            string callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);

            // Sending email
            await UserManager.SendEmailAsync(user.Id, "Confirm Email", "Please confirm your email by clicking this URL: " + callbackUrl);

            // Response success handle
            JsonResult successResponse = gerenateJsonRs(new { success = true, message = "Send code success!"});
            ControllerContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            return successResponse;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        #endregion
    }
}