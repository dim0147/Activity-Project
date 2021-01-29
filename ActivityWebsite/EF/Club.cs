using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ActivityWebsite.Models;
using System.Configuration;
using ActivityWebsite.Config;

namespace ActivityWebsite.EF
{
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

    }
}