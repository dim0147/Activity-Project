using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ActivityWebsite.Models;
using System.Configuration;
using ActivityWebsite.Config;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace ActivityWebsite.EF
{

    public class Result
    {
        public int Id;

        public string Slug;

        public string Name;

        public string HeaderImg;

        public DateTime EstablishAt;

        public double? TotalRate;

    }

    public class ClubHandle
    {

        public static bool isClubOwner(int clubId, string userId)
        {
            using (var db = new DbModel())
            {
                Club club = GetFullClubById(clubId);
                return club?.Owner == userId;
            }
        }

        public static async Task<object> SearchClubByName(string name, string category, int page)
        {
            using (var context = new DbModel())
            {
                var query = context.Clubs
                    .Include(c => c.Comments)
                    .Include(c => c.ClubCategories.Select(cc => cc.Category));

                if (name != null)
                {
                    query = query.Where(c => c.Name.ToLower().Contains(name.ToLower()));
                }

                var result = query.Select(c => new
                {
                    Id = c.Id,
                    Name = c.Name,
                    HeaderImg = ConfigurationApp.URL_DIR_CLUB_IMAGE + "/" + c.HeaderImg,
                    Slug = c.Slug,
                    TotalReviews = c.Comments.Count(),
                    EstablishedAt = c.EstablishedAt,
                    Categories = c.ClubCategories.Select(cc => new
                    {
                        Name = cc.Category.name
                    })
                });
                if (category != null)
                {
                    result = result.Where(c => c.Categories.Any(cate => cate.Name.ToLower().Contains(category.ToLower())));
                }
                return await result.OrderBy(c => c.Name).Skip(page * 4).Take(4).ToListAsync();
            }
        }

        public static Task<List<Result>> GetBestClub()
        {
            var context = new DbModel();
            return context.Clubs
                .Include(c => c.Comments)
                .Select(c => new Result
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    HeaderImg = ConfigurationApp.URL_DIR_CLUB_IMAGE + "/" + c.HeaderImg,
                    TotalRate = c.Comments.Where(cm => cm.Rate != 0).Average(cm => cm.Rate),
                    EstablishAt = c.EstablishedAt
                })
                .OrderByDescending(c => c.TotalRate).Take(5).ToListAsync();
        }

        public static object GetClubById(int id)
        {

            using (var db = new DbModel())
            {
                var club = db.Clubs
                             .Where(c => c.Id == id)
                             .Include(c => c.Images)
                             .Include(c => c.AspNetUser)
                             .Include("ClubCategories.Category")
                             .Include("Posts.PostTags")
                             .Include("Posts.AspNetUser")
                             .Include(c => c.Comments.Select(cm => cm.AspNetUser))
                             .Where(c => c.AspNetUser.status == "normal")
                             .Select(c => new
                             {
                                 club = new
                                 {
                                     Id = c.Id,
                                     Name = c.Name,
                                     Address = c.Address,
                                     Lat = c.Lat,
                                     Lng = c.Lng,
                                     Description = c.Description,
                                     OperationHours = c.OperationHours,
                                     Slug = c.Slug,
                                     EstablishedAt = c.EstablishedAt,
                                     Rate = (int?)c.Comments.Average(cm => cm.Rate),
                                     CreatedAt = c.CreatedAt,
                                     UpdatedAt = c.UpdatedAt,
                                     HeaderImg = ConfigurationApp.URL_DIR_CLUB_IMAGE + "/" + c.HeaderImg,
                                     ClubCategories = c.ClubCategories.Select(CC => new
                                     {
                                         Id = CC.Category.Id,
                                         Name = CC.Category.name,
                                         Description = CC.Category.description,
                                         image = ConfigurationApp.URL_DIR_CATEGORY_IMAGE + "/" + CC.Category.image
                                     }),
                                     Posts = c.Posts.Where(p => p.AspNetUser.status == "normal").Select(p => new
                                     {
                                         Id = p.Id,
                                         Title = p.Title,
                                         Slug = p.Slug,
                                         Text = p.Text,
                                         HeaderImg = ConfigurationApp.URL_DIR_POST_IMAGE + "/" + p.HeaderImg,
                                         CreatedAt = p.CreatedAt,
                                         Tags = p.PostTags.Select(postTag => new
                                         {
                                             Id = postTag.Id,
                                             Name = postTag.name,
                                             CreatedAt = postTag.CreatedAt
                                         }),
                                         Owner = new
                                         {
                                             Id = p.AspNetUser.Id,
                                             UserName = p.AspNetUser.UserName,
                                             Name = p.AspNetUser.DisplayName,
                                             CreatedAt = p.AspNetUser.CreatedAt,
                                             AuthenticateType = p.AspNetUser.authenticateType,
                                             status = p.AspNetUser.status,
                                         }
                                     }).Take(10),
                                     Thumbnails = c.Images.Select(img => new
                                     {
                                         Id = img.Id,
                                         image = ConfigurationApp.URL_DIR_CLUB_IMAGE + "/" + img.Name
                                     }),
                                     owner = new
                                     {
                                         Id = c.AspNetUser.Id,
                                         Username = c.AspNetUser.UserName,
                                         Name = c.AspNetUser.DisplayName,
                                         CreatedAt = c.AspNetUser.CreatedAt
                                     }

                                 }
                             })
                             .FirstOrDefault();
                return club;
            }
        }

        public static Club GetFullClubBySlug(string slug)
        {
            using (var db = new DbModel())
            {
                return db.Clubs.Where(c => c.Slug == slug).FirstOrDefault();
            }
        }
        public static Club GetFullClubById(int id)
        {
            using (var db = new DbModel())
            {
                return db.Clubs.Where(c => c.Id == id).FirstOrDefault();
            }
        }

        public static void DeleteClubCategories(int clubId)
        {
            using (var db = new DbModel())
            {
                db.ClubCategories.RemoveRange(db.ClubCategories.Where(cc => cc.ClubId == clubId));
                db.SaveChanges();
            }
        }

        public static object GetUserFollowClub(string userId, int clubId)
        {
            using (var db = new DbModel())
            {
                return db.UserFollows.Where(f => f.UserId == userId && f.ClubId == clubId).FirstOrDefault();
            }
        }

        public static object CreateUserFollowClub(string userId, int clubId)
        {
            try
            {
                using (var db = new DbModel())
                {
                    db.UserFollows.RemoveRange(db.UserFollows.Where(f => f.UserId == userId && f.ClubId == clubId));
                    db.SaveChanges();
                    var newFollow = new UserFollow
                    {
                        UserId = userId,
                        ClubId = clubId
                    };
                    db.UserFollows.Add(newFollow);
                    db.SaveChanges();
                    return newFollow;
                }
            }
            catch (Exception e)
            {
                return null;
            }

        }

        public static bool RemoveUserFollowClub(string userId, int clubId)
        {
            try
            {
                using (var db = new DbModel())
                {
                    db.UserFollows.RemoveRange(db.UserFollows.Where(f => f.UserId == userId && f.ClubId == clubId));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception e)
            {
                return false;
            }

        }

        public static object GetUserRateClub(string userId, int clubId)
        {
            using (var db = new DbModel())
            {
                return db.Comments.Where(c => c.Owner == userId && c.ClubId == clubId).FirstOrDefault();
            }
        }

        public static object CreateUserRateClub(string userId, int clubId, string text, int rate)
        {
            try
            {
                using (var db = new DbModel())
                {
                    var newComment = new Comment
                    {
                        Text = text,
                        Rate = rate,
                        Owner = userId,
                        Type = "comment-club",
                        ClubId = clubId
                    };
                    db.Comments.Add(newComment);
                    db.SaveChanges();
                    return newComment;
                }
            }
            catch (Exception e)
            {
                return null;
            }

        }

        public static object GetClubComments(int clubId, string userId, DateTime? continueTime)
        {
            using (var db = new DbModel())
            {
                var query = db.Comments
                    .Include("AspNetUser")
                    .Include("UserLikes")
                    .Include("Comments1.AspNetUser")
                    .Include("Comments1.UserLikes")
                    .Where(c => c.ClubId == clubId && c.ParentComment == null);

                if (continueTime != null)
                {
                    query = query.Where(c => DateTime.Compare(c.CreatedAt, (DateTime)continueTime) < 0);
                }
                var comment = query.Select(c => new
                {
                    Id = c.Id,
                    Text = c.Text,
                    Rate = c.Rate,
                    CreatedAt = c.CreatedAt,
                    Owner = new
                    {
                        Id = c.AspNetUser.Id,
                        UserName = c.AspNetUser.UserName,
                        Name = c.AspNetUser.DisplayName,
                        CreatedAt = c.AspNetUser.CreatedAt,
                        AuthenticateType = c.AspNetUser.authenticateType,
                        status = c.AspNetUser.status,
                    },
                    likes = c.UserLikes.Count(),
                    isLiked = (userId != null && c.UserLikes.Any(l => l.Owner == userId)) ? true : false
                })
                    .Where(c => c.Owner.status == "normal").OrderByDescending(c => c.CreatedAt).Take(5);
                var listReplies = comment.ToList();
                var lastCreatedTime = listReplies.LastOrDefault()?.CreatedAt;
                int totalLeft = lastCreatedTime != null ? db.Comments.Where(c => c.ClubId == clubId && c.ParentComment == null && DateTime.Compare(c.CreatedAt, (DateTime)lastCreatedTime) < 0).Count() : 0;
                return new
                {
                    comments = listReplies,
                    totalLeft = totalLeft,
                    continueTime = totalLeft > 0 ? lastCreatedTime : null
                };
            }
        }

        public static bool UserIsFollowClub(int clubId, string userId)
        {
            using (var db = new DbModel())
            {
                var result = db.UserFollows.Where(f => f.ClubId == clubId && f.UserId == userId).FirstOrDefault();
                return result != null;
            }
        }

        public static bool UserCanSendMessage(int clubId, string userId)
        {
            var isOwner = isClubOwner(clubId, userId);
            if (isOwner) return true;

            var isMember = UserIsFollowClub(clubId, userId);
            if (isMember) return true;
            else return false;
        }

        public static object CreateClubMessage(int clubId, string userId, string message)
        {
            using (var db = new DbModel())
            {
                var newMessage = new ClubMessage
                {
                    ClubId = clubId,
                    Owner = userId,
                    Text = message
                };
                db.ClubMessages.Add(newMessage);
                db.SaveChanges();
                var Owner = UserHandle.GetUserDetail(userId);
                if (Owner == null)
                {
                    return null;
                }


                return new
                {
                    Id = newMessage.Id,
                    Text = newMessage.Text,
                    Owner = Owner,
                    CreatedAt = newMessage.CreatedAt
                };
            }
        }

        public static object GetClubMember(int clubId)
        {
            using (var db = new DbModel())
            {
                return db.UserFollows
                    .Include(f => f.AspNetUser.AspNetRoles)
                    .Where(f => f.ClubId == clubId)
                    .Select(f => new
                    {
                        Id = f.AspNetUser.Id,
                        UserName = f.AspNetUser.UserName,
                        Name = f.AspNetUser.DisplayName,
                        Role = f.AspNetUser.AspNetRoles.FirstOrDefault() != null ? f.AspNetUser.AspNetRoles.FirstOrDefault().Name : null,
                        CreatedAt = f.AspNetUser.CreatedAt,
                        JoinedAt = f.CreatedAt,
                        AuthenticateType = f.AspNetUser.authenticateType
                    })
                    .ToList();
            }
        }

        public static object GetClubMessages(int clubId, DateTime? continueTime)
        {
            string currentUserId = HttpContext.Current.User.Identity.GetUserId();
            using (var db = new DbModel())
            {
                var query = db.ClubMessages
                                .Include(m => m.AspNetUser.AspNetRoles)
                                .Where(m => m.ClubId == clubId && m.AspNetUser.status == "normal");
                if (continueTime != null)
                    query = query.Where(m => m.CreatedAt < continueTime);
                var result = query.Select(m => new
                {
                    Id = m.Id,
                    Text = m.Text,
                    Owner = new
                    {
                        Id = m.AspNetUser.Id,
                        UserName = m.AspNetUser.UserName,
                        Name = m.AspNetUser.DisplayName,
                        Role = m.AspNetUser.AspNetRoles.FirstOrDefault() != null ? m.AspNetUser.AspNetRoles.FirstOrDefault().Name : null,
                        CreatedAt = m.AspNetUser.CreatedAt,
                        AuthenticateType = m.AspNetUser.authenticateType
                    },
                    CreatedAt = m.CreatedAt
                }).OrderByDescending(m => m.CreatedAt).Take(5);
                var listMessages = result.ToList();
                var lastCreatedTime = listMessages.LastOrDefault()?.CreatedAt;
                int totalLeft = lastCreatedTime != null ?
                    db.ClubMessages.Where(m => m.ClubId == clubId && m.AspNetUser.status == "normal" && m.CreatedAt < lastCreatedTime).Count() : 0;
                return new
                {
                    messages = listMessages,
                    totalLeft = totalLeft,
                    continueTime = totalLeft > 0 ? lastCreatedTime : null
                };
            }
        }

        public static async Task<bool> DeleteClub(int clubId)
        {
            using (var context = new DbModel())
            {
                try
                {
                    var listThumbnail = await context.Images.Where(i => i.ClubId == clubId).ToListAsync();
                    var listPosts = await context.Posts.Where(p => p.ClubId == clubId).Select(p => p.HeaderImg).ToListAsync();

                    var club = await context.Clubs.Where(c => c.Id == clubId).SingleOrDefaultAsync();
                    if (club == null) return false;

                    string headerImgName = club.HeaderImg;

                    context.Clubs.Remove(club);
                    context.SaveChanges();

                    foreach (var image in listThumbnail)
                    {
                        EF.ImageHandle.DelImg(image.Name, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);
                    }
                    EF.ImageHandle.DelImg(headerImgName, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);

                    foreach (var imageName in listPosts)
                    {
                        EF.ImageHandle.DelImg(imageName, ConfigurationApp.VIRTUAL_DIR_POST_IMAGE);
                    }

                    return true;
                }
                catch (Exception excp)
                {
                    return false;
                }
            }
        }

        public static bool ReportExist(int clubId, string userId)
        {
            using (var context = new DbModel())
            {
                int total = context.Reports.Where(r => r.ClubId == clubId && r.Owner == userId).Count();
                return total > 0;
            }
        }

        public static bool ReportClub(int clubId, string userId, string reason)
        {
            using (var context = new DbModel())
            {
                try
                {
                    Report report = new Report
                    {
                        Owner = userId,
                        Reason = reason,
                        ClubId = clubId,
                        Status = "pending",
                    };
                    context.Reports.Add(report);
                    context.SaveChanges();
                    return true;
                }
                catch (Exception err)
                {
                    return false;
                }
            }
        }

        public static int GetClubMonth()
        {
            using (var db = new DbModel())
            {
                return db.Clubs
                    .Where(c => c.CreatedAt.Year == DateTime.Now.Year && c.CreatedAt.Month == DateTime.Now.Month)
                    .Count();
            }
        }
    }
}