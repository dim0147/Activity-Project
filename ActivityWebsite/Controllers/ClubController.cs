using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ActivityWebsite.Models;
using Newtonsoft.Json;
using ActivityWebsite.CustomHelper;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using System.Net;

namespace ActivityWebsite.Controllers
{

    public class ClubController : Controller
    {
        private const string DIR_UPLOAD_CLUB_IMAGE = "~/Content/Media/Images/Club";

        [Authorize]
        [VerifyUser]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        [Authorize]
        [VerifyUser]
        public ActionResult Create(CreateClubModel model)
        {
            ApplicationUser user = ViewBag.user;
            if (!ModelState.IsValid)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Helper.AddModelError(ModelState);
            }

            using (DbModel db = new DbModel())
            {

                // Check if club name is exist
                string slugChecked = Helper.GerenateClubNameSlug(model.name);
                var clubExist = db.Clubs.Where(c => c.Slug == slugChecked).FirstOrDefault();
                if(clubExist != null)
                {
                    return Helper.ResponseHandle(HttpStatusCode.Conflict, new { 
                        error = true,
                        errors = new string[] {$"Club '{model.name}' exist already!"}
                    });
                }

                // Start transaction 
                using(var transaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        // Add header images
                        string nameHeaderImg = EF.ImageHandle.SaveImg(model.headerImg, DIR_UPLOAD_CLUB_IMAGE);
                        if (nameHeaderImg == null)
                        {
                            return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                            {
                                error = true,
                                errors = new string[] { "Can't save header image" }
                            });
                        }

                        // Create club
                        Club club = new Club
                        {
                            Name = model.name,
                            Address = model.address.name,
                            Lat = model.address.lat,
                            Lng = model.address.lng,
                            Description = model.description,
                            OperationHours = model.operationHours,
                            Slug = Helper.GerenateClubNameSlug(model.name),
                            EstablishedAt = model.establishedAt,
                            Owner = user.Id,
                            HeaderImg = nameHeaderImg
                        };
                        db.Clubs.Add(club);
                        db.SaveChanges();

                        // Add Category
                        IList<ClubCategory> clubCategories = new List<ClubCategory>();
                        foreach(int categoryId in model.categories)
                        {
                            clubCategories.Add(new ClubCategory
                            {
                                CategoryId = categoryId,
                                ClubId = club.Id
                            });
                        }
                        db.ClubCategories.AddRange(clubCategories);
                        db.SaveChanges();

                        // Add thumbnails
                        IList<Image> listImgs = new List<Image>();
                        foreach(var img in model.thumbnails)
                        {
                            string nameImg = EF.ImageHandle.SaveImg(img, DIR_UPLOAD_CLUB_IMAGE);
                            if(nameImg == null)
                            {
                                return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                                {
                                    error = true,
                                    errors = new string[] { "Can't save thumbnail image" }
                                });
                            }
                            listImgs.Add(new Image
                            {
                                Name = nameImg,
                                ClubId = club.Id,
                                Type = "club-thumbnail-image"
                            });
                        }
                        db.Images.AddRange(listImgs);
                        db.SaveChanges();

                        // Commit transaction
                        transaction.Commit();

                        // Send response
                        return Helper.ResponseHandle(HttpStatusCode.Created, new { 
                            success = true,
                            messages = new string[] {$"Create '{club.Name}' success!"}
                        });

                    }
                    catch(Exception err)
                    {
                        transaction.Rollback();
                        return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                        {
                            error = true,
                            errors = new string[] { "Can't create club, please try again later!" }
                        });
                    }
                    
                }
                
            }
        }
    }
}
