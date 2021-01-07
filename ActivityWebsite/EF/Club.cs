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
                return club.Owner == userId;
            }
        }

        public static object GetClubById(int id)
        {

            using(var db = new DbModel())
            {
                var club = db.Clubs
                             .Where(c => c.Id == id)
                             .Include(c => c.Images)
                             .Include(c => c.AspNetUser)
                             .Include("ClubCategories.Category")
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
                                     ClubCategories = c.ClubCategories.Select(CC => new { 
                                            Id = CC.Category.Id,
                                            Name = CC.Category.name,
                                            Description = CC.Category.description,
                                            image = ConfigurationApp.URL_DIR_CATEGORY_IMAGE + "/" + CC.Category.image
                                     }),
                                     Thumbnails = c.Images.Select( img => new { 
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
            using(var db = new DbModel())
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