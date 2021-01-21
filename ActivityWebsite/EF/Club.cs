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
    }
}