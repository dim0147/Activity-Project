using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ActivityWebsite.Models;
using System.Web.Routing;

namespace ActivityWebsite.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager )
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


        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Find user by email first
            ApplicationUser user = null;
            user = UserManager.FindByEmail(model.UsernameOrEmail);

            // If not found by email, found by username
            if(user == null)
            {
                user = UserManager.FindByName(model.UsernameOrEmail);
            }

            // If still not found return error
            if(user == null)
            {
                ModelState.AddModelError("", "Invalid username or email!");
                return View();
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            SignInStatus result = await SignInManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberMe, shouldLockout: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    ModelState.AddModelError("", "Require Veritification.");
                    return View(model);
                case SignInStatus.Failure:
                    ModelState.AddModelError("", "Incorrect password.");
                    return View(model);
                default:
                    ModelState.AddModelError("", "Invalid login attempt.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            // If not valid request
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Initialzie application user
            ApplicationUser user = new ApplicationUser { 
                UserName = model.Username, 
                Email = model.Email, 
                DisplayName = model.DisplayName,
                PhoneNumber = model.PhoneNumber,
                authenticateType = "Web"
            };

            // Start transaction
            using (var contextTransaction = HttpContext.GetOwinContext().Get<ApplicationDbContext>().Database.BeginTransaction())
            {
                try
                {
                    // Create user in DB
                    IdentityResult resultCreateUser = await UserManager.CreateAsync(user, model.Password);
                    if (!resultCreateUser.Succeeded)
                    {
                        AddErrors(resultCreateUser);
                        throw new Exception();
                    }

                    // Set role for user
                    ApplicationUser CurrentUser = UserManager.FindByEmail(model.Email);
                    IdentityResult resultCreateUserRole = await UserManager.AddToRoleAsync(CurrentUser.Id, "Member");
                    if (!resultCreateUserRole.Succeeded)
                    {
                        AddErrors(resultCreateUserRole);
                        throw new Exception();
                    }

                    // SignIn user
                    //await SignInManager.SignInAsync(CurrentUser, isPersistent: false, rememberBrowser: false);

                    // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking this URL: " + callbackUrl);
                    contextTransaction.Commit();
                    ViewBag.confirmEmail = "We have sent you email link to confirm your account, please login to email and confirm your account";
                    return View(model);
                }
                catch (Exception)
                {
                    // Something failed, redisplay form
                    return View(model);
                }
            }
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                ViewBag.errorMessage = "Missing user Id or Code!";
                return View();
            }
            if(UserManager.FindById(userId) == null)
            {
                ViewBag.errorMessage = "User Not Exist!";
                return View();
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            if(!result.Succeeded)
            {
                ViewBag.errorMessage = "Confirm email failed!";
            }
            return View();
        }

        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Check if email is exist
            ApplicationUser user = await UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError("", "Email not found");
                return View("ForgotPassword");
            }
                
            // Check email is confirm or not
            if(!(await UserManager.IsEmailConfirmedAsync(user.Id)))
            {
                ModelState.AddModelError("", "Email not confirm");
                return View("ForgotPassword");
            }

            // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
            // Send an email with this link
            string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
            var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
            await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking this URL:" + callbackUrl);
            ViewBag.confirmMessage = "We have send you the email to reset password please go check your email!";
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code, string userId)
        {
            if (code == null || userId == null)
            {
                ViewBag.errorMessage = "Invalid code or userId";
            }
            return View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Check if user exist
            ApplicationUser user = await UserManager.FindByIdAsync(model.userId);
            if (user == null)
            {
                ModelState.AddModelError("", $"User not found!");
                return View();
            }

            // Reset password
            IdentityResult result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (!result.Succeeded)
            {
                AddErrors(result);
                return View();
            }

            // Success
            ViewBag.confirmMessage = "Change password success!";
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            // Check if information third-party is null
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Check if email not found
            if(loginInfo.Email == null)
            {
                ViewBag.errorMessage = $"Email Not found!";
                return View("ExternalLoginFailure");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                // User not register yet
                case SignInStatus.Failure:
                default:
                    var user = UserManager.FindByEmail(loginInfo.Email);
                    // Check if email is exist
                    if (user != null)
                    {
                        ViewBag.errorMessage = $"Email {loginInfo.Email} is existed already!";
                        return View("ExternalLoginFailure");
                    }

                    // User does not create an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email, DisplayName = loginInfo.DefaultUserName });
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            // If user login already
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (!ModelState.IsValid)
            {
                ViewBag.ReturnUrl = returnUrl;
                return View(model);
            }

            // Get the information about the user from the external login provider
            var info = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return View("ExternalLoginFailure");
            }

            using (var contextTransaction = HttpContext.GetOwinContext().Get<ApplicationDbContext>().Database.BeginTransaction())
            {
                try
                {

                    // Create new user
                    var user = new ApplicationUser
                    {
                        UserName = model.Username,
                        Email = model.Email,
                        DisplayName = model.DisplayName,
                        PhoneNumber = model.PhoneNumber,
                        authenticateType = info.Login.LoginProvider
                    };
                    var result = await UserManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        AddErrors(result);
                        ViewBag.ReturnUrl = returnUrl;
                        return View(model);
                    }

                    // Add login third-party information
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (!result.Succeeded)
                    {
                        AddErrors(result);
                        ViewBag.ReturnUrl = returnUrl;
                        return View(model);
                    }

                    // Add Role to user
                    IdentityResult resultCreateUserRole = await UserManager.AddToRoleAsync(user.Id, "Member");
                    if (!resultCreateUserRole.Succeeded)
                    {
                        AddErrors(resultCreateUserRole);
                        ViewBag.ReturnUrl = returnUrl;
                        return View(model);
                    }

                    // Commit transaction
                    contextTransaction.Commit();

                    // Signin to website
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    return RedirectToLocal(returnUrl);
                }
                catch (Exception err)
                {
                    ModelState.AddModelError("", "Something wrong happened, please try again later");
                    return View(model);
                }
            }
        }

        public ActionResult Disabled(string status)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return View();
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}