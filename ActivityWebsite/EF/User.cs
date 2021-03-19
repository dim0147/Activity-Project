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

        public static object GetUserDetail(string userId)
        {
            ApplicationUserManager manager = HttpContext.Current.Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = manager.FindById(userId);
            string userRole = null;

            if(user != null)
            {
                var role = manager.GetRoles(user.Id);
                if (role.Count() > 0) userRole = role[0];
            }

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
            using (var db = new DbModel())
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
                        Rate = new
                        {
                            Average = c.Comments.Where(cmt => cmt.Rate != null).Average(cmt => cmt.Rate),
                            Total = c.Comments.Where(cmt => cmt.Rate != null).Count()
                        },
                        EstablishAt = c.EstablishedAt,
                        CreatedAt = c.CreatedAt
                    })
                    .ToListAsync();
            }
        }

        public static async Task<object> GetUserPosts(string userId)
        {
            using (var context = new DbModel())
            {
                return await context.Posts
                                .Include(p => p.Club)
                                .Include(p => p.AspNetUser)
                                .Include(p => p.Comments)
                                .Include(p => p.PostTags)
                                .Where(p => p.Owner == userId || p.Club.Owner == userId)
                                .Select(p => new
                                {
                                    Id = p.Id,
                                    Slug = p.Slug,
                                    Image = ConfigurationApp.URL_DIR_POST_IMAGE + "/" + p.HeaderImg,
                                    Title = p.Title,
                                    Club = new
                                    {
                                        Id = p.Club.Id,
                                        Slug = p.Club.Slug,
                                        Name = p.Club.Name
                                    },
                                    Tags = p.PostTags,
                                    Comments = p.Comments.Count(),
                                    Rate = new
                                    {
                                        Avegare = p.Comments.Where(c => c.Rate != 0).Average(c => c.Rate),
                                        Total = p.Comments.Where(c => c.Rate != 0).Count()
                                    },
                                    Author = new
                                    {
                                        Id = p.AspNetUser.Id,
                                        Username = p.AspNetUser.UserName,
                                        Name = p.AspNetUser.DisplayName,
                                    },
                                    CreatedAt = p.CreatedAt,
                                    UpdatedAt = p.UpdatedAt
                                })
                                .ToListAsync();
            }
        }

        public static async Task<object> GetUserFollowing(string userId)
        {
            using (var context = new DbModel())
            {
                return await context.UserFollows
                                .Include(f => f.Club)
                                .Where(f => f.UserId == userId)
                                .Select(f => new
                                {
                                    Id = f.Id,
                                    Club = new
                                    {
                                        Id = f.Club.Id,
                                        Name = f.Club.Name,
                                        Slug = f.Club.Slug,
                                        Image = ConfigurationApp.URL_DIR_CLUB_IMAGE + "/" + f.Club.HeaderImg,
                                        Description = f.Club.Description,
                                        EstablishAt = f.Club.EstablishedAt,
                                        CreatedAt = f.Club.CreatedAt
                                    },
                                    Owner = f.UserId,
                                    CreatedAt = f.CreatedAt
                                })
                                .ToListAsync();
            }
        }

        public static async Task<object> GetUserReport(string userId)
        {
            using (var context = new DbModel())
            {
                return await context.Reports
                            .Include(r => r.Club)
                            .Where(r => r.Owner == userId)
                            .Select(r => new
                            {
                                Id = r.Id,
                                Club = new
                                {
                                    Id = r.Club.Id,
                                    Slug = r.Club.Slug,
                                    Name = r.Club.Name,
                                    Image = ConfigurationApp.URL_DIR_CLUB_IMAGE + "/" + r.Club.HeaderImg
                                },
                                Reason = r.Reason,
                                ReplyText = r.ReplyText,
                                Status = r.Status,
                                CreatedAt = r.CreatedAt,
                                UpdatedAt = r.UpdatedAt
                            })
                            .ToListAsync();
            }
        }

        public static object GetRecentUser()
        {
            using (var db = new DbModel())
            {
                return db.AspNetUsers.Select(u => new
                {
                    Id = u.Id,
                    Username = u.UserName,
                    Name = u.DisplayName,
                    Email = u.Email,
                    Authenticate = u.authenticateType,
                    CreatedAt = u.CreatedAt,
                }).OrderByDescending(u => u.CreatedAt).Take(5).ToList();
            }
        }

        public static object GetAllUser()
        {
            using (var db = new DbModel())
            {
                return db.AspNetUsers
                    .Include(u => u.Clubs)
                    .Include(u => u.Posts)
                    .Select(u => new
                    {
                        Id = u.Id,
                        Username = u.UserName,
                        Name = u.DisplayName,
                        Email = u.Email,
                        Authenticate = u.authenticateType,
                        TotalClub = u.Clubs.Count(),
                        TotalPost = u.Posts.Count(),
                        CreatedAt = u.CreatedAt,
                    }).ToList();
            }
        }


        public static bool DeleteUser(string userId)
        {
            using (var db = new DbModel())
            {
                try
                {
                    db.AspNetUsers.RemoveRange(db.AspNetUsers.Where(u => u.Id == userId));
                    db.SaveChanges();
                    return true;
                }
                catch(Exception error)
                {
                    return false;
                }

            }
        }
    }
}