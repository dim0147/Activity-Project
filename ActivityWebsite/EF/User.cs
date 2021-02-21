using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using ActivityWebsite.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using ActivityWebsite.Config;

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
                DisplayName = user.DisplayName,
                Role = userRole,
                Status = user.status,
                AuthenticateType = user.authenticateType,
                PhoneNumber = user.PhoneNumber,
            } : null;

        }
    
        public static async Task<object> GetUserClubs(string userId)
        {
            using(var db = new DbModel())
            {
                return await db.Clubs
                    .Include("ClubCategories")
                    .Include("ClubCategories.Category")
                    .Include("UserFollows")
                    .Include("Posts")
                    .Include("Comments")
                    .Where(c => c.Owner == userId)
                    .Select(c => new
                    {
                        Id = c.Id,
                        Slug = c.Slug,
                        Image = ConfigurationApp.URL_DIR_CLUB_IMAGE + "/" + c.HeaderImg,
                        Name = c.Name,
                        Address = c.Address,
                        Lat = c.Lat,
                        Lng = c.Lng,
                        OperationHours = c.OperationHours,
                        Category = c.ClubCategories.Select(cate => new
                        {
                            Id = cate.Category.Id,
                            Name = cate.Category.name
                        }),
                        UserFollows = c.UserFollows.Count(),
                        Posts = c.Posts.Count(),
                        Rate = new { 
                            Average = c.Comments.Where(cmt => cmt.Rate != null).Average(cmt => cmt.Rate),
                            Total = c.Comments.Where(cmt => cmt.Rate != null).Count()
                        },
                        EstablishAt = c.EstablishedAt,
                        CreatedAt = c.CreatedAt
                    })
                    .ToListAsync();
            }
        }
    }
}