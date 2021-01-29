using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using ActivityWebsite.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace ActivityWebsite.EF
{
    public class UserHandle : ApiController
    {

        public static async Task<object> GetUserDetail(string userId)
        {
            ApplicationUserManager manager = HttpContext.Current.Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await manager.FindByIdAsync(userId);
            var userRole = user != null ? manager.GetRoles(user.Id)?[0] : null;
            return user != null ? new
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.UserName,
                DisplayNamme = user.DisplayName,
                Role = userRole,
                Status = user.status,
                AuthenticateType = user.authenticateType,
                PhoneNumber = user.PhoneNumber,
            } : null;

        }
    
    }
}