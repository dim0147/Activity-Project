using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Mvc = System.Web.Mvc;
using ActivityWebsite.Models;
using Newtonsoft.Json;
using ActivityWebsite.CustomHelper;
using ActivityWebsite.Config;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using System.Net;
using Microsoft.AspNet.Identity;
using ActivityWebsite.Hubs;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace ActivityWebsite.Controllers
{

    public class ClubController : Controller
    {
        [Route("club/create")]
        [Mvc.Authorize]
        [VerifyUser]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [Route("club/create")]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        [Mvc.Authorize]
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
                if (clubExist != null)
                {
                    return Helper.ResponseHandle(HttpStatusCode.Conflict, new
                    {
                        error = true,
                        errors = new string[] { $"Club '{model.name}' exist already!" }
                    });
                }

                // Start transaction 
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        // Add header images
                        string nameHeaderImg = EF.ImageHandle.SaveImg(model.headerImg, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);
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
                        foreach (int categoryId in model.categories)
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
                        foreach (var img in model.thumbnails)
                        {
                            string nameImg = EF.ImageHandle.SaveImg(img, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);
                            if (nameImg == null)
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
                        return Helper.ResponseHandle(HttpStatusCode.Created, new
                        {
                            success = true,
                            messages = new string[] { $"Create '{club.Name}' success!" }
                        });

                    }
                    catch (Exception err)
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

        [Route("club/{slug}")]
        public ActionResult Detail(string slug)
        {
            var club = EF.ClubHandle.GetFullClubBySlug(slug);
            int id = 0;
            if (club != null)
            {
                id = club.Id;
            }
            ViewBag.ClubId = id;
            return View();
        }

        [Mvc.Authorize]
        [VerifyUser]
        [Route("club/{slug}/edit")]
        public ActionResult Edit(string slug)
        {
            var club = EF.ClubHandle.GetFullClubBySlug(slug);
            int id = 0;
            if (club != null)
            {
                id = club.Id;
            }
            ViewBag.ClubId = id;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        [Mvc.Authorize]
        [VerifyUser]
        public ActionResult Edit(int id, EditClubModel model)
        {
            if (!ModelState.IsValid)
            {
                return Helper.AddModelError(ModelState);
            }

            // Check club is exist
            if(EF.ClubHandle.GetFullClubById(id) == null)
            {
                return Helper.ResponseHandle(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { $"Club not found!" }
                });
            }

            // Check if owner
            if (!EF.ClubHandle.isClubOwner(id, User.Identity.GetUserId()))
            {
                return Helper.ResponseHandle(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { $"You don't have permission to edit this club!" }
                });
            }

            // Check thumbnail image delete is valid
            if (model.listImgIdNeedDelete != null && model.listImgIdNeedDelete.Count() > 0)
            {
                bool thumbnailDelIsValid = EF.ImageHandle.ImgIsIncludeClub(id, model.listImgIdNeedDelete);
                if (!thumbnailDelIsValid)
                    return Helper.ResponseHandle(HttpStatusCode.BadRequest, new
                    {
                        error = true,
                        errors = new string[] { $"Thumbnail image not valid!" }
                    });
            }

            using (var db = new DbModel())
            {
                // List thumbnail to delete
                IEnumerable<Image> listImgNameToDel = null;

                // Edit header image if have
                string nameHeaderImg = null;
                string oldHeaderImg = null;
                if (model.headerImg != null)
                {
                    nameHeaderImg = EF.ImageHandle.SaveImg(model.headerImg, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);
                    if (nameHeaderImg == null)
                    {
                        return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                        {
                            error = true,
                            errors = new string[] { "Can't save header image" }
                        });
                    }
                }

                using (var contextTransaction = db.Database.BeginTransaction())
                {
                    // Edit Club
                    Club club = EF.ClubHandle.GetFullClubById(id);
                    club.Address = model.address.name;
                    club.Lat = model.address.lat;
                    club.Lng = model.address.lng;
                    club.Description = model.description;
                    club.EstablishedAt = model.establishedAt;
                    club.Name = model.name;
                    club.Slug = Helper.GerenateClubNameSlug(model.name);
                    club.OperationHours = model.operationHours;
                    if (nameHeaderImg != null)
                    {
                        oldHeaderImg = club.HeaderImg;
                        club.HeaderImg = nameHeaderImg;
                    }
                    db.Entry(club).State = System.Data.Entity.EntityState.Modified;
                    db.SaveChanges();

                    // Add Thumbnail 
                    if (model.thumbnails != null)
                    {
                        IList<Image> thumbnails = new List<Image>();
                        foreach (var img in model.thumbnails)
                        {
                            string nameImg = EF.ImageHandle.SaveImg(img, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);
                            if (nameImg == null)
                            {
                                return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                                {
                                    error = true,
                                    errors = new string[] { "Can't save thumbnail image" }
                                });
                            }
                            thumbnails.Add(new Image
                            {
                                Name = nameImg,
                                ClubId = club.Id,
                                Type = "club-thumbnail-image"
                            });
                        }
                        db.Images.AddRange(thumbnails);
                        db.SaveChanges();
                    }

                    // Delete Thumbnail (Db)
                    if (model.listImgIdNeedDelete != null && model.listImgIdNeedDelete.Count() > 0)
                    {
                        listImgNameToDel = EF.ImageHandle.GetImgs(model.listImgIdNeedDelete);
                        EF.ImageHandle.DeleteImgs(model.listImgIdNeedDelete);
                    }

                    // Delete all category in club
                    EF.ClubHandle.DeleteClubCategories(club.Id);

                    // Add all category
                    IList<ClubCategory> clubCategories = new List<ClubCategory>();
                    foreach (int categoryId in model.categories)
                    {
                        clubCategories.Add(new ClubCategory
                        {
                            CategoryId = categoryId,
                            ClubId = club.Id
                        });
                    }
                    db.ClubCategories.AddRange(clubCategories);
                    db.SaveChanges();

                    contextTransaction.Commit();
                }

                // Delete Header image in local
                if (oldHeaderImg != null)
                {
                    EF.ImageHandle.DelImg(oldHeaderImg, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);
                }
                // Delete thumbnail image in local
                if (listImgNameToDel != null)
                {
                    foreach (Image img in listImgNameToDel)
                    {
                        EF.ImageHandle.DelImg(img.Name, ConfigurationApp.VIRTUAL_DIR_CLUB_IMAGE);
                    }
                }
            }

            return Helper.ResponseHandle(HttpStatusCode.OK, new
            {
                success = true,
                messages = new string[] { $"Edit success!" }
            });
        }


        [HttpDelete]
        [Route("club/delete/{id}")]
        [Mvc.Authorize]
        [VerifyUser]
        public async Task<ActionResult> Delete(int id, DeleteClubModel model)
        {
            if (!ModelState.IsValid)
            {
                return Helper.AddModelError(ModelState);
            }

            // Check club is exist
            if (EF.ClubHandle.GetFullClubById(id) == null)
            {
                return Helper.ResponseHandle(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { $"Club not found!" }
                });
            }

            // Check if owner
            if (!EF.ClubHandle.isClubOwner(id, User.Identity.GetUserId()))
            {
                return Helper.ResponseHandle(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { $"You don't have permission to edit this club!" }
                });
            }

            bool isSuccess = await EF.ClubHandle.DeleteClub(id);
            if (isSuccess)
            {
                return Helper.ResponseHandle(HttpStatusCode.OK, new
                {
                    success = true
                });
            } 
            else
            {
                return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                {
                    error = true
                });
            }

        }

        [HttpGet]
        [Mvc.Authorize]
        [VerifyUser]
        [Route("club/{slug}/chatbox")]
        public ActionResult Chat(string slug)
        {
            var club = EF.ClubHandle.GetFullClubBySlug(slug);
            int id = 0;
            if (club != null)
            {
                id = club.Id;
            }
            ViewBag.ClubId = id;
            return View();
        }

    }
}
